import React, { Reducer } from "react";
import { IAppState } from "../model";
import { TActions, ActionTypes } from './actions';

export { AppActions } from './actions';

const initialState: IAppState = {};

type ContextProps = {
  state: IAppState;
  dispatch: ({ type }: { type: string }) => void;
}

const defaultAppState: ContextProps = {
  state: initialState,
  dispatch: (): void => { }
};

const reducer: Reducer<IAppState, TActions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_DEVICE_STATUS:
      return { ...state, isDeviceRegistered: action.payload };
    default:
      return state;
  }
};


export const StoreContext = React.createContext<ContextProps>(defaultAppState);

export const StoreProvider = (props: any) => {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };
  return <StoreContext.Provider value={value}>{props.children}</StoreContext.Provider>
};

/* const createStoreContext = () => {
  const StoreContext = React.createContext<ContextProps>(defaultAppState);

  const StoreProvider = (props: any) => {
    let [state, dispatch] = React.useReducer(reducer, initialState);
    let value = { state, dispatch };
    return <StoreContext.Provider value={value}>{props.children}</StoreContext.Provider>
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
}

export const { StoreProvider, useStore } = createStoreContext(); */
/* const Actions: IAction<ActionTypes>[] = [{ type: ActionTypes.ERROR, payload: '' }, { type: ActionTypes.CONNECTION, payload: '' }];

/* const reducer: Reducer<IAppState, TActions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ERROR:
      return { ...state, errorText: action.payload };
    default:
      return state;
  }
}; type TActions = ElementType<typeof Actions> */

/* type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
  ? ElementType
  : never */
