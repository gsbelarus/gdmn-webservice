import { IDocument, IRemain, IGood, IDocumentType, IContact, IReference, IBaseUrl, IInventoryDocumentType } from '../../../common';
import { ISellDocument } from './sell';
export { ISellDocument, ISellHead, ISellLine, ILineTara, ITara} from './sell';
import Api from '../service/Api';
import Sync from '../service/Storage';
import { AppActions, AuthActions, ServiceActions } from '../store';

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
}

export interface IAppSettings {
  synchronization?: boolean;
  autodeletingDocument?: boolean;
}

export interface IAppState {
  documents?: (IDocument | ISellDocument)[];
  settings?: IAppSettings;
  remains?: IRemain[];
  goods?: IGood[];
  documentTypes?: (IDocumentType | IInventoryDocumentType)[];
  contacts?: IContact[];
  references?: IReference[];
}
