import { Reducer, useReducer, useMemo } from 'react';
import { createActionPayload, ActionsUnion, createAction } from './utils';
import { IBaseUrl } from '../model';

export enum ActionTypes {
  DISCONNECT = 'DISCONNECT',
  LOG_OUT = 'LOG_OUT',
  SET_DEVICE_STATUS = 'SET_DEVICE_STATUS',
  SET_USER_STATUS = 'SET_USER_STATUS',
  SET_COMPANY_ID = 'SET_COMPANY_ID',
  SET_USER_ID = 'SET_USER_ID',
  SET_BASEURL = 'SET_BASEURL'
}

export const AppActions = {
  disconnect: createActionPayload<ActionTypes.DISCONNECT, void>(ActionTypes.DISCONNECT),
  logOut: createAction<ActionTypes.LOG_OUT>(ActionTypes.LOG_OUT),
  setBaseUrl: createActionPayload<ActionTypes.SET_BASEURL, IBaseUrl>(ActionTypes.SET_BASEURL),
  setDeviceStatus: createActionPayload<ActionTypes.SET_DEVICE_STATUS, boolean | undefined>(
    ActionTypes.SET_DEVICE_STATUS
  ),
  setUserStatus: createActionPayload<ActionTypes.SET_USER_STATUS, boolean | undefined>(ActionTypes.SET_USER_STATUS),
  setCompanyID: createActionPayload<ActionTypes.SET_COMPANY_ID, string>(ActionTypes.SET_COMPANY_ID),
  setUserID: createActionPayload<ActionTypes.SET_USER_ID, string>(ActionTypes.SET_USER_ID)
};

export type TActions = ActionsUnion<typeof AppActions>;

interface IAction {
  [key: string]: (...args: any[]) => any;
}

export function useTypesafeActions<S, Actions extends IAction>(
  reducer: Reducer<S, TActions>,
  initialState: S,
  actions: Actions
): [S, Actions] {
  const [state, dispatch] = useReducer(reducer, initialState);

  const boundActions = useMemo(() => {
    function bindActionCreator(actionCreator: (...args: any[]) => any, dispatcher: typeof dispatch) {
      return function(this: any) {
        return dispatcher(actionCreator.apply(this as any, (arguments as unknown) as any[]));
      };
    }

    const newActions = Object.keys(actions).reduce((ba, actionName) => {
      ba[actionName] = bindActionCreator(actions[actionName], dispatch);
      return ba;
    }, {} as IAction);
    return newActions;
  }, [actions, dispatch]);

  return [state, boundActions as Actions];
}
