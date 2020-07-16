import { IHead, ILine, IDocument, IRemain, IDocumentType, IGood, IContact } from '../../../../common';
import { ISellHead, ISellDocument, ISellLine, IAppSettings, ITara, ILineTara } from '../../model';
import { createActionPayload, ActionsUnion } from '../utils';

export enum ActionAppTypes {
  NEW_DOCUMENT = 'NEW_DOCUMENT',
  EDIT_DOCUMENT = 'EDIT_DOCUMENT',
  EDIT_STATUS_DOCUMENT = 'EDIT_STATUS_DOCUMENT',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
  DOCUMENT_ADD_LINE = 'DOCUMENT_ADD_LINE',
  DOCUMENT_DELETE_LINE = 'DOCUMENT_DELETE_LINE',
  DOCUMENT_EDIT_LINE = 'DOCUMENT_EDIT_LINE',
  SET_SETTINGS = 'SET_SETTINGS',
  // SET_REFERENCES = 'SET_REFERENCES',
  SET_DOCUMENTS = 'SET_DOCUMENTS',
  SET_GOODS = 'SET_GOODS',
  SET_DOCUMENTTYPES = 'SET_DOCUMENTTYPES',
  SET_CONTACTS = 'SET_CONTACTS',
  SET_REMAINS = 'SET_REMAINS',
  SET_BOXINGS = 'SET_BOXINGS',
  SET_BOXINGS_LINE = 'SET_BOXINGS_LINE',
}

export const AppActions = {
  newDocument: createActionPayload<ActionAppTypes.NEW_DOCUMENT, IDocument | ISellDocument>(ActionAppTypes.NEW_DOCUMENT),
  editDocument: createActionPayload<ActionAppTypes.EDIT_DOCUMENT, { id: number; head: IHead | ISellHead }>(
    ActionAppTypes.EDIT_DOCUMENT,
  ),
  editStatusDocument: createActionPayload<ActionAppTypes.EDIT_STATUS_DOCUMENT, { id: number; status: number }>(
    ActionAppTypes.EDIT_STATUS_DOCUMENT,
  ),
  deleteDocument: createActionPayload<ActionAppTypes.DELETE_DOCUMENT, number>(ActionAppTypes.DELETE_DOCUMENT),
  addLine: createActionPayload<ActionAppTypes.DOCUMENT_ADD_LINE, { docId: number; line: ILine | ISellLine }>(
    ActionAppTypes.DOCUMENT_ADD_LINE,
  ),
  deleteLine: createActionPayload<ActionAppTypes.DOCUMENT_DELETE_LINE, { docId: number; lineId: string }>(
    ActionAppTypes.DOCUMENT_DELETE_LINE,
  ),
  editLine: createActionPayload<ActionAppTypes.DOCUMENT_EDIT_LINE, { docId: number; line: ILine | ISellLine }>(
    ActionAppTypes.DOCUMENT_EDIT_LINE,
  ),
  setSettings: createActionPayload<ActionAppTypes.SET_SETTINGS, IAppSettings>(ActionAppTypes.SET_SETTINGS),
  // setReferences: createActionPayload<ActionAppTypes.SET_REFERENCES, IReference[]>(ActionAppTypes.SET_REFERENCES),
  setDocuments: createActionPayload<ActionAppTypes.SET_DOCUMENTS, IDocument[]>(ActionAppTypes.SET_DOCUMENTS),
  setRemains: createActionPayload<ActionAppTypes.SET_REMAINS, IRemain[]>(ActionAppTypes.SET_REMAINS),
  setDocumentTypes: createActionPayload<ActionAppTypes.SET_DOCUMENTTYPES, IDocumentType[]>(
    ActionAppTypes.SET_DOCUMENTTYPES,
  ),
  setGoods: createActionPayload<ActionAppTypes.SET_GOODS, IGood[]>(ActionAppTypes.SET_GOODS),
  setContacts: createActionPayload<ActionAppTypes.SET_CONTACTS, IContact[]>(ActionAppTypes.SET_CONTACTS),
  setBoxings: createActionPayload<ActionAppTypes.SET_BOXINGS, ITara[]>(ActionAppTypes.SET_BOXINGS),
  setBoxingsLine: createActionPayload<
    ActionAppTypes.SET_BOXINGS_LINE,
    { docId: number; lineDoc: string; lineBoxings: ILineTara[] }[]
  >(ActionAppTypes.SET_BOXINGS_LINE),
};

export type TAppActions = ActionsUnion<typeof AppActions>;
