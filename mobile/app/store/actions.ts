// import { TDeviceStatus } from '../model'
import { createActionPayload, ActionsUnion } from './utils';

export enum ActionTypes {
  SET_DEVICE_STATUS = 'SET_DEVICE_STATUS',
  SET_USER_STATUS = 'SET_USER_STATUS',
  SET_COMPANY_ID = 'SET_COMPANY_ID',
  SET_USER_ID = 'SET_USER_ID'
}

export const AppActions = {
  setDeviceStatus: createActionPayload<ActionTypes.SET_DEVICE_STATUS, boolean>(ActionTypes.SET_DEVICE_STATUS),
  setUserStatus: createActionPayload<ActionTypes.SET_USER_STATUS, boolean>(ActionTypes.SET_USER_STATUS),
  setCompanyID: createActionPayload<ActionTypes.SET_COMPANY_ID, string>(ActionTypes.SET_COMPANY_ID),
  setUserID: createActionPayload<ActionTypes.SET_USER_ID, string>(ActionTypes.SET_USER_ID)
}

export type TActions = ActionsUnion<typeof AppActions>;
