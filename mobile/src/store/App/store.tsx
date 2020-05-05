import React from 'react';

import Api from '../../api/Api';
import Sync from '../../api/Sync';
import { IAppContextProps, IAppState } from '../../model';
import { useTypesafeActions } from '../utils';
import { AppActions } from './actions';
import { reducer, initialState } from './reducer';

const api = new Api();

const sync = new Sync();

const defaultAppState: IAppContextProps = {
  state: initialState,
  actions: AppActions,
  api,
  sync,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IAppContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    return <StoreContext.Provider value={{ state, actions, api, sync }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
