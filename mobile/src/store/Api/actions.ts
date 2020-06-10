import { IBaseUrl } from '../../../../common';
import { createActionPayload, ActionsUnion } from '../utils';

export enum ActionApiTypes {
  SET_SERVER_URL = 'SET_SERVER_URL',
  SET_STORAGE_PATH = 'SET_STORAGE_PATH',
}

export const ApiActions = {
  setServerUrl: createActionPayload<ActionApiTypes.SET_SERVER_URL, IBaseUrl>(ActionApiTypes.SET_SERVER_URL),
  setStoragePath: createActionPayload<ActionApiTypes.SET_STORAGE_PATH, string>(ActionApiTypes.SET_STORAGE_PATH),
};

export type TApiActions = ActionsUnion<typeof ApiActions>;
