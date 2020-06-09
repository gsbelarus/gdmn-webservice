import React, { useEffect } from 'react';

import Api from '../../api/Api';
import Sync from '../../api/Sync';
import { appStorage } from '../../helpers/utils';
import { IAuthState, IAuthContextProps } from '../../model';
import { useTypesafeActions } from '../utils';
import { AuthActions } from './actions';
import { reducer, initialState } from './reducer';

const api = new Api();

const sync = new Sync();

const defaultAppState: IAuthContextProps = {
  state: initialState,
  actions: AuthActions,
  api,
  sync,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IAuthContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAuthState, typeof AuthActions>(reducer, initialState, AuthActions);

    // TODO: возможно нужно отвязаться от state.userID
    useEffect(() => {
      const loadStorageData = async () => {
        const settings = await appStorage.getItems([
          `${state.userID}/SYNCHRONIZATION`,
          `${state.userID}/AUTODELETING_DOCUMENT`,
        ]);
        console.log('load settings.SYNCHRONIZATION', settings.SYNCHRONIZATION);
        actions.setSynchonization(settings.SYNCHRONIZATION);
        console.log('load settings.AUTODELETING_DOCUMENT', settings.AUTODELETING_DOCUMENT);
        actions.setAutodeletingDocument(settings.AUTODELETING_DOCUMENT);
      };

      if (state.loggedIn && state.userID) {
        loadStorageData();
      }
      console.log('state.loggedIn', state.loggedIn);
      console.log('state.userID', state.userID);
    }, [actions, state.loggedIn, state.userID]);

    useEffect(() => {
      const saveStorageData = async () => {
        await appStorage.setItem(`${state.userID}/SYNCHRONIZATION`, state.synchronization);
        console.log('save settings.SYNCHRONIZATION', state.synchronization);
      };

      if (state.synchronization) {
        saveStorageData();
      }
    }, [actions, state.synchronization, state.userID]);

    return <StoreContext.Provider value={{ state, actions, api, sync }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
