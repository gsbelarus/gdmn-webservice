import { IDocument, IRemain, IGood, IDocumentType, IContact, IBaseUrl } from '../../../common';
import Api from '../service/Api';
import Sync from '../service/Storage';
import { AppActions, AuthActions, ServiceActions } from '../store';
import { ISellDocument, ITara, IWeighedGoods, ILineTara, IFormParams, IDocumentParams, ISellLine } from './sell';

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
  weighedGoods?: IWeighedGoods[];
  boxingsLine?: {
    docId: number;
    lineDoc: string;
    lineBoxings: ILineTara[];
  }[];
  settingsSearch?: string[];
  formParams?: IFormParams;
  productParams?: ISellLine;
  documentParams?: IDocumentParams;
}
