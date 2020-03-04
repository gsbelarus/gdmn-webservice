import React, {Reducer } from "react";
import { IAppState } from "../model";

interface IAction<T, R = any> {
  type: T;
  payload: R;
}

enum ActionTypes {
  SET_ERROR = 'SET_ERROR',
  CONNECTION = 'CONNECTION'
}

type IError = string;

export type ErrorCreateAction = IAction<ActionTypes.SET_ERROR, IError>;

export const errorCreate = (errorText: IError): ErrorCreateAction => {
  return {
    type: ActionTypes.SET_ERROR,
    payload: errorText
  };
}

type TActions = IAction<ActionTypes>;

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
};

const reducer: Reducer<IAppState, TActions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_ERROR:
      return { ...state, errorText: action.payload };
    default:
      return state;
  }
};

export const MyContext = React.createContext<ContextProps>(defaultAppState);

export const MyContextProvider = (props: any) => {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };
  return (
    <MyContext.Provider value={value}>{props.children}</MyContext.Provider>
  );
}


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
