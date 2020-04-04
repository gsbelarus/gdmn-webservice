import { Reducer } from 'react';

import { saveToStorage } from '../helpers/utils';
import { IAppState } from '../model';
import { TActions, ActionTypes } from './actions';

export const initialState: IAppState = {
  baseUrl: undefined,
  deviceRegistered: undefined,
  loggedIn: undefined,
  companyID: undefined,
  synchronization: false,
  autodeletingDocument: false,
};

export const reducer: Reducer<IAppState, TActions> = (state = initialState, action): IAppState => {
  switch (action.type) {
    case ActionTypes.DISCONNECT:
      return {
        ...{
          baseUrl: state.baseUrl,
          initialState,
        },
      };
    case ActionTypes.LOG_OUT:
      return { ...state, userID: undefined, loggedIn: false };
    case ActionTypes.SET_BASEURL:
      return { ...state, baseUrl: action.payload };
    case ActionTypes.SET_DEVICE_STATUS:
      return { ...state, deviceRegistered: action.payload };
    case ActionTypes.SET_USER_STATUS:
      return { ...state, loggedIn: action.payload };
    case ActionTypes.SET_COMPANY_ID:
      return { ...state, companyID: action.payload };
    case ActionTypes.SET_USER_ID:
      return { ...state, userID: action.payload };
    case ActionTypes.SET_SYNCHRONIZATION:
      saveToStorage(JSON.stringify({ value: action.payload }), `${state.userID}/SYNCHRONIZATION`);
      return { ...state, synchronization: action.payload };
    case ActionTypes.SET_AUTODELETING_DOCUMENT:
      saveToStorage(JSON.stringify({ value: action.payload }), `${state.userID}/AUTODELETING_DOCUMENT`);
      return { ...state, autodeletingDocument: action.payload };
    default:
      return state;
  }
};
