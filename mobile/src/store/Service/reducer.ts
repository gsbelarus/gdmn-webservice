import { Reducer } from 'react';

import { IServiceState } from '../../model';
import { TServiceActions, ActionServiceTypes } from './actions';

export const initialState: IServiceState = {
  serverUrl: undefined,
  deviceId: undefined,
  storagePath: undefined,
};

export const reducer: Reducer<IServiceState, TServiceActions> = (state = initialState, action): IServiceState => {
  switch (action.type) {
    case ActionServiceTypes.SET_SERVER_URL:
      return { ...state, serverUrl: action.payload };
    case ActionServiceTypes.SET_DEVICE_ID:
      return { ...state, deviceId: action.payload };
    case ActionServiceTypes.SET_STORAGE_PATH:
      return { ...state, storagePath: action.payload };
    default:
      return state;
  }
};
