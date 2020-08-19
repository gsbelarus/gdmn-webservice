import { IDocument, IRemain, IGood, IDocumentType, IContact, IBaseUrl } from '../../../common';
import Api from '../service/Api';
import Sync from '../service/Storage';
import { AppActions, AuthActions, ServiceActions } from '../store';
import { ISellDocument, ITara, ILineTara, IFormParams, IDocumentParams } from './sell';
export { ISellDocument, ISellHead, ISellLine, ILineTara, ITara } from './sell';

export interface IServiceContextProps {
  state: IServiceState;
  actions: typeof ServiceActions;
  apiService: Api;
  storageService: Sync;
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

export interface IServiceState {
  isLoading: boolean;
  serverUrl?: IBaseUrl;
  deviceId?: string;
  storagePath?: string;
}

export interface IAuthState {
  companyID?: string | null;
  userID?: string | null;
  deviceRegistered?: boolean;
  deviceActive?: boolean;
  deviceId?: string;
  profile?: {
    userName: string;
    companyName: string;
  };
}

export interface IAppSettings {
  synchronization?: boolean;
  autodeletingDocument?: boolean;
  dakrTheme?: boolean;
}

export interface IAppState {
  documents?: (IDocument | ISellDocument)[];
  settings?: IAppSettings;
  remains?: IRemain[];
  goods?: IGood[];
  documentTypes?: IDocumentType[];
  contacts?: IContact[];
  boxings?: ITara[];
  boxingsLine?: {
    docId: number;
    lineDoc: string;
    lineBoxings: ILineTara[];
  }[];
  settingsSearch?: string[];
  formParams?: IFormParams;
  documentParams?: IDocumentParams;
}

export interface IField {
  id: number;
  value: string;
}
