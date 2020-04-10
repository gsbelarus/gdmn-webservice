import Api from '../api/Api';
import Sync from '../api/Sync';
import { AppActions } from '../store';

export interface IContextProps {
  state: IAppState;
  actions: typeof AppActions;
  api: Api;
  sync: Sync;
}

export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IServerResponse<T> {
  status: number;
  result: T;
}

export interface IBaseUrl {
  protocol: string;
  server: string;
  port: number;
  apiPath: string;
}

export interface IUserCredentials {
  userName: string;
  password: string;
}

export interface IDevice {
  uid: string;
  user: string;
  state: string;
}

export interface INewDevice {
  uid: string;
  user: string;
}

export interface IAppState {
  baseUrl?: IBaseUrl;
  companyID?: string;
  userID?: string;
  deviceRegistered?: boolean;
  deviceActive?: boolean;
  loggedIn?: boolean;
  deviceId?: string;
}

// перенести в общую папку common
export interface IUser {
  id: string;
  userName: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface IMessageInfo{
  uid: string;
  date: Date;
}

export interface IMessage {
  head: {
    id: string;
    producer: string;
    consumer: string;
    companyId: string;
    dateTime: string;
  };
  body: {
    type: string;
    payload: {
      name: string;
      params: string[];
    };
  };
}

