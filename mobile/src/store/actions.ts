import { IBaseUrl } from '../model';
import { createActionPayload, ActionsUnion, createAction } from './utils';

export enum ActionTypes {
  DISCONNECT = 'DISCONNECT',
  LOG_OUT = 'LOG_OUT',
  SET_DEVICE_STATUS = 'SET_DEVICE_STATUS',
  SET_USER_STATUS = 'SET_USER_STATUS',
  SET_COMPANY_ID = 'SET_COMPANY_ID',
  SET_USER_ID = 'SET_USER_ID',
  SET_BASEURL = 'SET_BASEURL',
  SET_DEVICE_ID = 'SET_DEVICE_ID',
}

export const AppActions = {
  disconnect: createActionPayload<ActionTypes.DISCONNECT, void>(ActionTypes.DISCONNECT),
  logOut: createAction<ActionTypes.LOG_OUT>(ActionTypes.LOG_OUT),
  setBaseUrl: createActionPayload<ActionTypes.SET_BASEURL, IBaseUrl>(ActionTypes.SET_BASEURL),
  setDeviceStatus: createActionPayload<ActionTypes.SET_DEVICE_STATUS, boolean | undefined>(
    ActionTypes.SET_DEVICE_STATUS,
  ),
  setUserStatus: createActionPayload<ActionTypes.SET_USER_STATUS, boolean | undefined>(ActionTypes.SET_USER_STATUS),
  setCompanyID: createActionPayload<ActionTypes.SET_COMPANY_ID, string>(ActionTypes.SET_COMPANY_ID),
  setUserID: createActionPayload<ActionTypes.SET_USER_ID, string>(ActionTypes.SET_USER_ID),
  setDeviceID: createActionPayload<ActionTypes.SET_DEVICE_ID, string>(ActionTypes.SET_DEVICE_ID),
};

export type TActions = ActionsUnion<typeof AppActions>;
