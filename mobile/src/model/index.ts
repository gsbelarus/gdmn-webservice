import { IDocument, IRemain, IGood, IDocumentType, IContact, IReference, IBaseUrl } from '../../../common';
import Api from '../api/Api';
import Sync from '../api/Sync';
import { AppActions, AuthActions, ApiActions } from '../store';

export interface IApiContextProps {
  state: IApiState;
  actions: typeof ApiActions;
  api: Api;
  sync: Sync;
}

export interface IAuthContextProps {
  state: IAuthState;
  actions: typeof AuthActions;
}

export interface IAppContextProps {
  state: IAppState;
  actions: typeof AppActions;
}

export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
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

export interface IApiState {
  serverUrl?: IBaseUrl;
  storagePath?: string;
}

export interface IAuthState {
  companyID?: string;
  userID?: string;
  deviceRegistered?: boolean;
  deviceActive?: boolean;
  deviceId?: string;
}

export interface IAppSettings {
  synchronization?: boolean;
  autodeletingDocument?: boolean;
}

export interface IAppState {
  settings: IAppSettings;
  documents?: IDocument[];
  remains?: IRemain[];
  goods?: IGood[];
  documentTypes?: IDocumentType[];
  contacts?: IContact[];
  references?: IReference[];
}
