import React, { useEffect } from 'react';

import { IServiceContextProps, IServiceState } from '../../model';
import Api from '../../service/Api';
import Storage from '../../service/Storage';
import { useTypesafeActions } from '../utils';
import { ServiceActions } from './actions';
import { initialState, reducer } from './reducer';

const apiService = new Api();
const storageService = new Storage();

const defaultAppState: IServiceContextProps = {
  state: initialState,
  actions: ServiceActions,
  apiService,
  storageService,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IServiceContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IServiceState, typeof ServiceActions>(
      reducer,
      initialState,
      ServiceActions,
    );

    useEffect(() => {
      (async () => {
        actions.setServerUrl(await storageService.getServer()); // Загружаем путь к серверу из хранилища в стейт
        actions.setDeviceId(await storageService.getDeviceId()); // Загружаем deviceId из хранилища в стейт
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const saveState = async () => {
        storageService.setDeviceId(state.deviceId); // записываем deviceId в хранилище устройства
        apiService.setDeviceId(state.deviceId); // в службе Service обновляем deviceId
      };

      if (state.deviceId) {
        saveState();
      }
    }, [actions, state.deviceId]);

    useEffect(() => {
      const saveState = async () => {
        storageService.setServer(state.serverUrl); // записываем путь к серверу в хранилище устройства
        apiService.setUrl(state.serverUrl); // в службе Service обновляем путь к серверу
      };
      if (state.serverUrl) {
        saveState();
      }
    }, [actions, state.serverUrl]);

    return (
      <StoreContext.Provider value={{ state, actions, apiService, storageService }}>{children}</StoreContext.Provider>
    );
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
