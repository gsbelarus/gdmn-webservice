import React from 'react';

import { IAppState, IContextProps } from '../model';
import { AppActions } from './actions';
import { reducer, initialState } from './reducer';
import { useTypesafeActions } from './utils';

const defaultAppState: IContextProps = {
  state: initialState,
  actions: AppActions,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
