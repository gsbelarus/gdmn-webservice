import React, { Reducer, useReducer, useMemo } from 'react';
import { IAppState, IContextProps } from '../model';
import { AppActions, TActions, useTypesafeActions } from './actions';
import { reducer, initialState } from './reducer';

const defaultAppState: IContextProps = {
  state: initialState,
  actions: AppActions
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IContextProps>(defaultAppState);

  const StoreProvider = (props: any) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    return <StoreContext.Provider value={{ state, actions }}>{props.children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
