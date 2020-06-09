import { IBaseUrl } from '../../../../common';
import { createActionPayload, ActionsUnion, createAction } from '../utils';

export enum ActionAuthTypes {
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

export const AuthActions = {
  disconnect: createActionPayload<ActionAuthTypes.DISCONNECT, void>(ActionAuthTypes.DISCONNECT),
  logOut: createAction<ActionAuthTypes.LOG_OUT>(ActionAuthTypes.LOG_OUT),
  setBaseUrl: createActionPayload<ActionAuthTypes.SET_BASEURL, IBaseUrl>(ActionAuthTypes.SET_BASEURL),
  setDeviceStatus: createActionPayload<ActionAuthTypes.SET_DEVICE_STATUS, boolean | undefined>(
    ActionAuthTypes.SET_DEVICE_STATUS,
  ),
  setUserStatus: createActionPayload<ActionAuthTypes.SET_USER_STATUS, boolean | undefined>(
    ActionAuthTypes.SET_USER_STATUS,
  ),
  setCompanyID: createActionPayload<ActionAuthTypes.SET_COMPANY_ID, string>(ActionAuthTypes.SET_COMPANY_ID),
  setUserID: createActionPayload<ActionAuthTypes.SET_USER_ID, string>(ActionAuthTypes.SET_USER_ID),
  setSynchonization: createActionPayload<ActionAuthTypes.SET_SYNCHRONIZATION, boolean>(
    ActionAuthTypes.SET_SYNCHRONIZATION,
  ),
  setAutodeletingDocument: createActionPayload<ActionAuthTypes.SET_AUTODELETING_DOCUMENT, boolean>(
    ActionAuthTypes.SET_AUTODELETING_DOCUMENT,
  ),
};

export type TAuthActions = ActionsUnion<typeof AuthActions>;
