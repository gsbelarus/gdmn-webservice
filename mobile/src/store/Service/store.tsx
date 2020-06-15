import React, { useEffect, useState } from 'react';

import { IServiceContextProps, IServiceState } from '../../model';
import Api from '../../service/Api';
import Storage from '../../service/Storage';
import { useTypesafeActions } from '../utils';
import { ServiceActions } from './actions';
import { reducer, initialState } from './reducer';

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
    const [init, setInit] = useState(false);
    const [state, actions] = useTypesafeActions<IServiceState, typeof ServiceActions>(
      reducer,
      initialState,
      ServiceActions,
    );

    useEffect(() => {
      if (state.serverUrl !== undefined) {
        apiService.setUrl(state.serverUrl); // в службе Service обновляем путь к серверу
        if (!init) {
          // Если не инициализация, а изменение
          storageService.setServer(state.serverUrl); // записываем путь к серверу в хранилище устройства
        }
      } else {
        setInit(true);
      }
    }, [actions, init, state.serverUrl]);

    //useEffect для deviceId
    useEffect(() => {
      if (state.deviceId !== undefined) {
        apiService.setDeviceId(state.deviceId); // в службе Service обновляем deviceId
        if (!init) {
          // Если не инициализация, а изменение
          storageService.setDeviceId(state.deviceId); // записываем deviceId в хранилище устройства
          // сохранение deviceId || '0'
        }
      } else {
        setInit(true);
      }
    }, [actions, init, state.deviceId]);

    useEffect(() => {
      const getInitialState = async () => {
        actions.setServerUrl(await storageService.getServer()); // Загружаем путь к серверу из хранилища в стейт
        // TODO загрузка deviceId из хранилища
        actions.setDeviceId(await storageService.getDeviceId()); // Загружаем deviceId из хранилища в стейт
        setInit(false);
      };

      if (init) {
        getInitialState();
      }
    }, [actions, init]);

    return (
      <StoreContext.Provider value={{ state, actions, apiService, storageService }}>{children}</StoreContext.Provider>
    );
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
