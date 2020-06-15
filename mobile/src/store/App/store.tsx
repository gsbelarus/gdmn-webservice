import React, { useEffect, useState } from 'react';

import { appStorage } from '../../helpers/utils';
import { IAppContextProps, IAppState, IAppSettings } from '../../model';
import { useStore as useServiceStore } from '../Service/store';
//import { useStore as useAuthStore } from '../Auth/store';
import { useTypesafeActions } from '../utils';
import { AppActions } from './actions';
import { reducer, initialState } from './reducer';

const defaultAppState: IAppContextProps = {
  state: initialState,
  actions: AppActions,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IAppContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    const {
      state: { storagePath },
    } = useServiceStore();

    const [isLoad, setIsLoad] = useState(false);

    // TODO возможно нужно отвязаться от state.userID
    /* */
    useEffect(() => {
      const loadStorageData = async () => {
        const storageSettings: IAppSettings = await appStorage.getItem(`${storagePath}/SETTINGS`);

        actions.setSettings(storageSettings);
      };

      if (storagePath) {
        loadStorageData();
      }
    }, [actions, storagePath]);

    useEffect(() => {
      if (state.settings) {
        const saveStorageData = async () => {
          await appStorage.setItem(`${storagePath}/SETTINGS`, state.settings);
        };

        if (storagePath && isLoad) {
          saveStorageData();
        }
        setIsLoad(true);
      }
    }, [isLoad, state.settings, storagePath]);

    /* TODO Добавить огранизацию */

    /* TODO Убрать loggedIn => state.userID*/
    /*     useEffect(() => {
      const saveStorageData = async () => {
        await appStorage.setItem(`${state.userID}/SETTINGS`, state.settings);
        // console.log('save settings.SYNCHRONIZATION', state.synchronization);
        // const settings = await appStorage.getItem(`${state.userID}/SYNCHRONIZATION`);
        // console.log('settings', settings);
      };

      if (state.synchronization) {
        saveStorageData();
      }
    }, [state.settings, state.userID]); */
    /* Предотврпатить выполнение сохранения в момент выполнения loadStorageData */

    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
