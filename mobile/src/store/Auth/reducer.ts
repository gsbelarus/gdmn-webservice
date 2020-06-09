import { Reducer } from 'react';

import { IDocument } from '../../../../common';
import { IAuthState } from '../../model';
import { TAuthActions, ActionAuthTypes } from './actions';

export const initialState: IAuthState = {
  baseUrl: undefined,
  deviceRegistered: undefined,
  loggedIn: undefined,
  companyID: undefined,
};

export const reducer: Reducer<IAuthState, TAuthActions> = (state = initialState, action): IAuthState => {
  switch (action.type) {
    case ActionAuthTypes.DISCONNECT:
      return { ...{ baseUrl: state.baseUrl, initialState, documents: [] as IDocument[] } };
    case ActionAuthTypes.LOG_OUT:
      return { ...state, userID: undefined, loggedIn: false, companyID: undefined };
    case ActionAuthTypes.SET_BASEURL:
      return { ...state, baseUrl: action.payload };
    case ActionAuthTypes.SET_DEVICE_STATUS:
      return { ...state, deviceRegistered: action.payload };
    case ActionAuthTypes.SET_USER_STATUS:
      return { ...state, loggedIn: action.payload };
    case ActionAuthTypes.SET_COMPANY_ID:
      return { ...state, companyID: action.payload };
    case ActionAuthTypes.SET_USER_ID:
      return { ...state, userID: action.payload };
    case ActionAuthTypes.SET_SYNCHRONIZATION:
      return { ...state, synchronization: action.payload };
    case ActionAuthTypes.SET_AUTODELETING_DOCUMENT:
      return { ...state, autodeletingDocument: action.payload };
    default:
      return state;
  }
};
