import React, { useEffect } from 'react';

import Api from '../../api/Api';
import Sync from '../../api/Sync';
import { IApiContextProps, IApiState } from '../../model';
import { useTypesafeActions } from '../utils';
import { ApiActions } from './actions';
import { reducer, initialState } from './reducer';

const api = new Api();

const sync = new Sync();

const defaultAppState: IApiContextProps = {
  state: initialState,
  actions: ApiActions,
  api,
  sync,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IApiContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IApiState, typeof ApiActions>(reducer, initialState, ApiActions);

    useEffect(() => {
      const getUrl = async () => {
        actions.setServerUrl(await sync.getServer());
      };

      if (state.serverUrl !== undefined) {
        api.setUrl(state.serverUrl);
      } else {
        getUrl();
      }
    }, [actions, state.serverUrl]);

    return <StoreContext.Provider value={{ state, actions, api, sync }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
