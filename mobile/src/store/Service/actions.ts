import { IBaseUrl } from '../../../../common';
import { createActionPayload, ActionsUnion } from '../utils';

export enum ActionServiceTypes {
  SET_SERVER_URL = 'SET_SERVER_URL',
  SET_STORAGE_PATH = 'SET_STORAGE_PATH',
}

export const ServiceActions = {
  setServerUrl: createActionPayload<ActionServiceTypes.SET_SERVER_URL, IBaseUrl>(ActionServiceTypes.SET_SERVER_URL),
  setStoragePath: createActionPayload<ActionServiceTypes.SET_STORAGE_PATH, string>(ActionServiceTypes.SET_STORAGE_PATH),
};

export type TServiceActions = ActionsUnion<typeof ServiceActions>;
