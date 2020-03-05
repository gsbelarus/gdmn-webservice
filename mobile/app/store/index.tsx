import React, { Reducer, useRef, useReducer, useMemo, useEffect } from "react";
import { IAppState } from "../model";
import { TActions, ActionTypes } from './actions';
import { ActionsUnion } from './utils';

import { AppActions } from './actions';
export { AppActions } from './actions';

const initialState: IAppState = {};

type ContextProps = {
  state: IAppState;
  actions: typeof AppActions;
}

const defaultAppState: ContextProps = {
  state: initialState,
  actions: AppActions,
};

const reducer: Reducer<IAppState, TActions> = (state = initialState, action): IAppState => {
  switch (action.type) {
    case ActionTypes.SET_DEVICE_STATUS:
      return { ...state, deviceRegistered: action.payload };
    case ActionTypes.SET_USER_STATUS:
      return { ...state, loggedIn: action.payload };
    case ActionTypes.SET_COMPANY_ID:
      return { ...state, companyID: action.payload };
    case ActionTypes.SET_USER_ID:
      return { ...state, userID: action.payload };
    default:
      return state;
  }
};

const createStoreContext = () => {
  const StoreContext = React.createContext<ContextProps>(defaultAppState);

  const StoreProvider = (props: any) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    return <StoreContext.Provider value={{ state, actions }}>{props.children}</StoreContext.Provider>
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
}

export const { StoreProvider, useStore } = createStoreContext();

interface IAction {
  [key: string]: (...args: any[]) => any;
}

function useTypesafeActions<S, Actions extends IAction>(
  reducer: Reducer<S, ActionsUnion<Actions>>,
  initialState: S,
  actions: Actions
): [S, Actions] {
  const [state, dispatch] = useReducer(reducer, initialState);

  const boundActions = useMemo(() => {
    function bindActionCreator(actionCreator: (...args: any[]) => any, dispatcher: typeof dispatch) {
      return function (this: any) {
        return dispatcher(actionCreator.apply(this as any, (arguments as unknown) as any[]));
      };
    }

    const newActions = Object.keys(actions).reduce(
      (ba, actionName) => {
        ba[actionName] = bindActionCreator(actions[actionName], dispatch);
        return ba;
      }, {} as IAction
    );
    return newActions;
  }, [actions, dispatch]);

  return [state, boundActions as Actions];
}
