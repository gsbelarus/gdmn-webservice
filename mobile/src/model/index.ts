import { IDocument, IRemain, IGood, IDocumentType, IContact, IReference, IBaseUrl, IInventoryDocumentType } from '../../../common';
import Api from '../api/Api';
import Sync from '../api/Sync';
import { AppActions, AuthActions } from '../store';
import { ISellDocument } from './sell';
export { ISellDocument, ISellHead, ISellLine, ILineTara, ITara} from './sell';

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
  documents?: (IDocument | ISellDocument)[];
  remains?: IRemain[];
  goods?: IGood[];
  documentTypes?: (IDocumentType | IInventoryDocumentType)[];
  contacts?: IContact[];
  references?: IReference[];
}
