import React from 'react';

import { AppConfig } from '../api/app';
import { IAppState, IContextProps } from '../model';
import { AppActions } from './actions';
import { reducer, initialState } from './reducer';
import { useTypesafeActions } from './utils';

const appConfig = new AppConfig();

const api = { app: appConfig };

const defaultAppState: IContextProps = {
  state: initialState,
  actions: AppActions,
  api,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    return <StoreContext.Provider value={{ state, actions, api }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
