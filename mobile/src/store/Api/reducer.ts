import { Reducer } from 'react';

import { IApiState } from '../../model';
import { TApiActions, ActionApiTypes } from './actions';

export const initialState: IApiState = {
  serverUrl: undefined,
  storagePath: undefined,
};

export const reducer: Reducer<IApiState, TApiActions> = (state = initialState, action): IApiState => {
  switch (action.type) {
    case ActionApiTypes.SET_SERVER_URL:
      return { ...state, serverUrl: action.payload };
    case ActionApiTypes.SET_STORAGE_PATH:
      return { ...state, storagePath: action.payload };
    default:
      return state;
  }
};
