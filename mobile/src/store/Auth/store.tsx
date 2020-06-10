import React from 'react';

import { IAuthState, IAuthContextProps } from '../../model';
import { useTypesafeActions } from '../utils';
import { AuthActions } from './actions';
import { reducer, initialState } from './reducer';

const defaultAppState: IAuthContextProps = {
  state: initialState,
  actions: AuthActions,
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IAuthContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAuthState, typeof AuthActions>(reducer, initialState, AuthActions);

    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
