import { IDocument, IBaseUrl, IReference } from '../../../common';
import { IForm, IRemains } from '../../../common/base';
import Api from '../service/Api';
import Sync from '../service/Storage';
import { AppActions, AuthActions, ServiceActions } from '../store';

export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IField {
  id: string;
  value: string;
}

export interface IListItem {
  id?: number;
  value?: string;
  [key: string]: unknown;
}

export interface IFormParams {
  fromContact?: number[];
  toContact?: number[];
  dateBegin?: string;
  dateEnd?: string;
}

export interface IDocumentParams {
  status: number;
  date?: string;
  tocontactId?: number;
  fromcontactId?: number;
  doctype?: number;
  docnumber?: string;
}

export interface IRemainsParams {
  contactId?: number;
}

export interface IFilterParams {
  fieldSearch: string[];
}

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
  darkTheme?: boolean;
}

export interface IReferences {
  [name: string]: IReference | IRemains;
}

export interface IAppState {
  settings?: IAppSettings;
  documents?: IDocument[];
  references?: IReferences;
  forms?: {
    [name: string]: IForm;
  };
  // filterParams: string[];
}
