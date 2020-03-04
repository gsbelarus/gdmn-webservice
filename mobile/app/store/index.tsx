import React, { createContext, useContext, Reducer, useReducer } from "react";
import { IAppState } from "../model";

const initialState: IAppState = {
  appState: "CONNECTION",
  errorText: ""
};

type ContextProps = {
  state: IAppState;
  dispatch: ({ type }: { type: string }) => void;
}

const defaultAppState: ContextProps = {
  state: initialState,
  dispatch: (): void => { }
  // dispatch: ({ type }: { type: string }): void => { }
};


interface IAction<T, R = any> {
  type: T;
  payload: R;
}

enum ActionTypes {
  ERROR = 'SET_ERROR',
  CONNECTION = 'CONNECTION'
}

type IError = string;

export type ErrorCreateAction = IAction<ActionTypes.ERROR, IError>;

export const errorCreate = (errorText: IError): ErrorCreateAction => {
  return {
    type: ActionTypes.ERROR,
    payload: errorText
  };
}

type TActions = IAction<ActionTypes>;

const reducer: Reducer<IAppState, TActions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ERROR:
      return { ...state, errorText: action.payload };
    default:
      return state;
  }
};

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


export const MyContext = React.createContext<ContextProps>(defaultAppState);

export const MyContextProvider = (props: any) => {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };
  return (
    <MyContext.Provider value={value}>{props.children}</MyContext.Provider>
  );
}
