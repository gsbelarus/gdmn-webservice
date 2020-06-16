import { IBaseUrl } from '../../../../common';
import { createActionPayload, ActionsUnion } from '../utils';

export enum ActionServiceTypes {
  SET_SERVER_URL = 'SET_SERVER_URL',
  SET_DEVICE_ID = 'SET_DEVICE_ID',
  SET_STORAGE_PATH = 'SET_STORAGE_PATH',
}

export const ServiceActions = {
  setServerUrl: createActionPayload<ActionServiceTypes.SET_SERVER_URL, IBaseUrl>(ActionServiceTypes.SET_SERVER_URL),
  setDeviceId: createActionPayload<ActionServiceTypes.SET_DEVICE_ID, string>(ActionServiceTypes.SET_DEVICE_ID),
  setStoragePath: createActionPayload<ActionServiceTypes.SET_STORAGE_PATH, string>(ActionServiceTypes.SET_STORAGE_PATH),
};

export type TServiceActions = ActionsUnion<typeof ServiceActions>;
