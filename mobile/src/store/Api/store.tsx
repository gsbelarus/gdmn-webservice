import React from 'react';

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
    return <StoreContext.Provider value={{ state, actions, api, sync }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
