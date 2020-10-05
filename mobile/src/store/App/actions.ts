/* eslint-disable @typescript-eslint/no-explicit-any */
import { IHead, ILine, IDocument, IReference, IForm } from '../../../../common';
import { IAppSettings } from '../../model/types';
import { createActionPayload, ActionsUnion, createAction } from '../utils';

// eslint-disable-next-line no-shadow
export enum ActionAppTypes {
  ADD_DOCUMENT = 'ADD_DOCUMENT',
  UPDATE_DOCUMENT_HEAD = 'UPDATE_DOCUMENT_HEAD',
  UPDATE_DOCUMENT_STATUS = 'UPDATE_DOCUMENT_STATUS',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
  DELETE_ALL_DOCUMENTS = 'DELETE_ALL_DOCUMENTS',
  DOCUMENT_ADD_LINE = 'DOCUMENT_ADD_LINE',
  DOCUMENT_DELETE_LINE = 'DOCUMENT_DELETE_LINE',
  DOCUMENT_UPDATE_LINE = 'DOCUMENT_UPDATE_LINE',
  SET_SETTINGS = 'SET_SETTINGS',
  SET_REFERENCE = 'SET_REFERENCE',
  SET_REFERENCES = 'SET_REFERENCES',
  SET_DOCUMENTS = 'SET_DOCUMENTS',
  SET_FORM = 'SET_FORM',
  /*   SET_GOODS = 'SET_GOODS',
  SET_DOCUMENTTYPES = 'SET_DOCUMENTTYPES',
  SET_CONTACTS = 'SET_CONTACTS',
  SET_REMAINS = 'SET_REMAINS',
  SET_SETTINGS_SEARCH = 'SET_SETTINGS_SEARCH',
  SET_FORM_PARAMS = 'SET_FORM_PARAMS',
  CLEAR_FORM_PARAMS = 'CLEAR_FORM_PARAMS',
  SET_PRODUCT_PARAMS = 'SET_PRODUCT_PARAMS',
  CLEAR_PRODUCT_PARAMS = 'CLEAR_PRODUCT_PARAMS',
  SET_DOCUMENT_PARAMS = 'SET_DOCUMENT_PARAMS',
  CLEAR_DOCUMENT_PARAMS = 'CLEAR_DOCUMENT_PARAMS', */
}

export const AppActions = {
  addDocument: createActionPayload<ActionAppTypes.ADD_DOCUMENT, IDocument>(ActionAppTypes.ADD_DOCUMENT),
  updateDocument: createActionPayload<ActionAppTypes.UPDATE_DOCUMENT_HEAD, { id: number; head: IHead }>(
    ActionAppTypes.UPDATE_DOCUMENT_HEAD,
  ),
  updateDocumentStatus: createActionPayload<ActionAppTypes.UPDATE_DOCUMENT_STATUS, { id: number; status: number }>(
    ActionAppTypes.UPDATE_DOCUMENT_STATUS,
  ),
  deleteDocument: createActionPayload<ActionAppTypes.DELETE_DOCUMENT, number>(ActionAppTypes.DELETE_DOCUMENT),
  deleteAllDocuments: createAction<ActionAppTypes.DELETE_ALL_DOCUMENTS>(ActionAppTypes.DELETE_ALL_DOCUMENTS),
  addLine: createActionPayload<ActionAppTypes.DOCUMENT_ADD_LINE, { docId: number; line: ILine }>(
    ActionAppTypes.DOCUMENT_ADD_LINE,
  ),
  deleteLine: createActionPayload<ActionAppTypes.DOCUMENT_DELETE_LINE, { docId: number; lineId: number }>(
    ActionAppTypes.DOCUMENT_DELETE_LINE,
  ),
  editLine: createActionPayload<ActionAppTypes.DOCUMENT_UPDATE_LINE, { docId: number; line: ILine }>(
    ActionAppTypes.DOCUMENT_UPDATE_LINE,
  ),
  setSettings: createActionPayload<ActionAppTypes.SET_SETTINGS, IAppSettings>(ActionAppTypes.SET_SETTINGS),
  setReference: createActionPayload<ActionAppTypes.SET_REFERENCE, IReference<any>>(ActionAppTypes.SET_REFERENCE),
  setReferences: createActionPayload<ActionAppTypes.SET_REFERENCES, { [name: string]: IReference }>(
    ActionAppTypes.SET_REFERENCES,
  ),
  setDocuments: createActionPayload<ActionAppTypes.SET_DOCUMENTS, IDocument[]>(ActionAppTypes.SET_DOCUMENTS),
  setForm: createActionPayload<ActionAppTypes.SET_FORM, IForm>(ActionAppTypes.SET_FORM),
  /*   setRemains: createActionPayload<ActionAppTypes.SET_REMAINS, IRemain[]>(ActionAppTypes.SET_REMAINS),
  setDocumentTypes: createActionPayload<ActionAppTypes.SET_DOCUMENTTYPES, IRefData[]>(ActionAppTypes.SET_DOCUMENTTYPES),
  setGoods: createActionPayload<ActionAppTypes.SET_GOODS, IGood[]>(ActionAppTypes.SET_GOODS),
  setContacts: createActionPayload<ActionAppTypes.SET_CONTACTS, IContact[]>(ActionAppTypes.SET_CONTACTS),
  setSettingsSearch: createActionPayload<ActionAppTypes.SET_SETTINGS_SEARCH, string[]>(
    ActionAppTypes.SET_SETTINGS_SEARCH,
  ),
  setFormParams: createActionPayload<ActionAppTypes.SET_FORM_PARAMS, IFormParams>(ActionAppTypes.SET_FORM_PARAMS),
  clearFormParams: createAction<ActionAppTypes.CLEAR_FORM_PARAMS>(ActionAppTypes.CLEAR_FORM_PARAMS),
  setProducParams: createActionPayload<ActionAppTypes.SET_PRODUCT_PARAMS, ILine>(ActionAppTypes.SET_PRODUCT_PARAMS),
  clearProductParams: createAction<ActionAppTypes.CLEAR_PRODUCT_PARAMS>(ActionAppTypes.CLEAR_PRODUCT_PARAMS),
  setDocumentParams: createActionPayload<ActionAppTypes.SET_DOCUMENT_PARAMS, IDocumentParams>(
    ActionAppTypes.SET_DOCUMENT_PARAMS,
  ),
  clearDocumentParams: createAction<ActionAppTypes.CLEAR_DOCUMENT_PARAMS>(ActionAppTypes.CLEAR_DOCUMENT_PARAMS), */
};

export type TAppActions = ActionsUnion<typeof AppActions>;
