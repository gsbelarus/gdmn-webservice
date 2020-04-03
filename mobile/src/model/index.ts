import Api from '../api/Api';
import { AppActions } from '../store';

export interface IContextProps {
  state: IAppState;
  actions: typeof AppActions;
  api: Api;
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

export interface INewDevice {
  uid: string;
  userId: string;
}

export interface IAppState {
  baseUrl?: IBaseUrl;
  companyID?: string;
  userID?: string;
  deviceRegistered?: boolean;
  deviceActive?: boolean;
  loggedIn?: boolean;
  deviceId?: string;
  synchronization: boolean;
  autodeletingDocument: boolean;
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
