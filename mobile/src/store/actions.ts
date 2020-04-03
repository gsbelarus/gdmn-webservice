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
  SET_SYNCHRONIZATION = 'SET_SYNCHRONIZATION',
  SET_AUTODELETING_DOCUMENT = 'SET_AUTODELETING_DOCUMENT',
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
  setSynchonization: createActionPayload<ActionTypes.SET_SYNCHRONIZATION, boolean>(ActionTypes.SET_SYNCHRONIZATION),
  setAutodeletingDocument: createActionPayload<ActionTypes.SET_AUTODELETING_DOCUMENT, boolean>(
    ActionTypes.SET_AUTODELETING_DOCUMENT,
  ),
};

export type TActions = ActionsUnion<typeof AppActions>;
