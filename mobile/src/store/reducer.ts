import { Reducer } from 'react';
import { TActions, ActionTypes } from './actions';
import { IAppState } from '../model';
import { baseUrl } from '../helpers/utils';

export const initialState: IAppState = {
  baseUrl: undefined,
  deviceRegistered: undefined,
  loggedIn: undefined
};

// TODO User Status переделать в LogIn
export const reducer: Reducer<IAppState, TActions> = (state = initialState, action): IAppState => {
  switch (action.type) {
    case ActionTypes.DISCONNECT:
      return { ...{ baseUrl: state.baseUrl, initialState } };
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
    default:
      return state;
  }
};
