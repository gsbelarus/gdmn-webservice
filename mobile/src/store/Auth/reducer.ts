import { Reducer } from 'react';

import { IAuthState } from '../../model';
import { TAuthActions, ActionAuthTypes } from './actions';

export const initialState: IAuthState = {
  deviceRegistered: undefined,
  userID: undefined,
  companyID: undefined,
};

export const reducer: Reducer<IAuthState, TAuthActions> = (state = initialState, action): IAuthState => {
  console.log('Auth action: ', JSON.stringify(action));
  switch (action.type) {
    case ActionAuthTypes.DISCONNECT:
      return initialState;
    case ActionAuthTypes.LOG_OUT:
      return { ...state, userID: null, companyID: undefined };
    case ActionAuthTypes.SET_DEVICE_STATUS:
      return { ...state, deviceRegistered: action.payload };
    case ActionAuthTypes.SET_USER_STATUS:
      return { ...state, userID: action.payload?.userID };
    case ActionAuthTypes.SET_COMPANY_ID:
      return { ...state, companyID: action.payload };
    default:
      return state;
  }
};
