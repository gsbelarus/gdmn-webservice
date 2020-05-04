import Api from '../api/Api';
import Sync from '../api/Sync';
import { AppActions, AuthActions } from '../store';
import { IDocument, IRemain, IGood, IDocumentType, IContact, IReference } from './inventory';

export interface IAuthContextProps {
  state: IAuthState;
  actions: typeof AuthActions;
  api: Api;
  sync: Sync;
}

export interface IAppContextProps {
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
  result: boolean;
  error?: string;
  data?: T;
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

export interface IAuthState {
  baseUrl?: IBaseUrl;
  companyID?: string;
  userID?: string;
  deviceRegistered?: boolean;
  deviceActive?: boolean;
  loggedIn?: boolean;
  deviceId?: string;
}

export interface IAppState {
  documents?: IDocument[];
  remains?: IRemain[];
  goods?: IGood[];
  documentTypes?: IDocumentType[];
  contacts?: IContact[];
  references?: IReference[];
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

export interface IMessageInfo {
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
