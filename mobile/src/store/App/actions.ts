import { IHead, ILine, IDocument, IReference } from '../../../../common';
import { IAppSettings } from '../../model';
import { createActionPayload, ActionsUnion } from '../utils';

export enum ActionAppTypes {
  LOAD_REFERENCES = 'LOAD_REFERENCES',
  NEW_DOCUMENT = 'NEW_DOCUMENT',
  EDIT_DOCUMENT = 'EDIT_DOCUMENT',
  EDIT_STATUS_DOCUMENT = 'EDIT_STATUS_DOCUMENT',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
  DOCUMENT_ADD_LINE = 'DOCUMENT_ADD_LINE',
  DOCUMENT_DELETE_LINE = 'DOCUMENT_DELETE_LINE',
  DOCUMENT_EDIT_LINE = 'DOCUMENT_EDIT_LINE',
  SET_SETTINGS = 'SET_SETTINGS',
}

export const AppActions = {
  loadreferences: createActionPayload<ActionAppTypes.LOAD_REFERENCES, IReference[]>(ActionAppTypes.LOAD_REFERENCES),
  newDocument: createActionPayload<ActionAppTypes.NEW_DOCUMENT, IDocument>(ActionAppTypes.NEW_DOCUMENT),
  editDocument: createActionPayload<ActionAppTypes.EDIT_DOCUMENT, { id: number; head: IHead }>(
    ActionAppTypes.EDIT_DOCUMENT,
  ),
  editStatusDocument: createActionPayload<ActionAppTypes.EDIT_STATUS_DOCUMENT, { id: number; status: number }>(
    ActionAppTypes.EDIT_STATUS_DOCUMENT,
  ),
  deleteDocument: createActionPayload<ActionAppTypes.DELETE_DOCUMENT, number>(ActionAppTypes.DELETE_DOCUMENT),
  addLine: createActionPayload<ActionAppTypes.DOCUMENT_ADD_LINE, { docId: number; line: ILine }>(
    ActionAppTypes.DOCUMENT_ADD_LINE,
  ),
  deleteLine: createActionPayload<ActionAppTypes.DOCUMENT_DELETE_LINE, { docId: number; lineId: string }>(
    ActionAppTypes.DOCUMENT_DELETE_LINE,
  ),
  editLine: createActionPayload<ActionAppTypes.DOCUMENT_EDIT_LINE, { docId: number; lineId: string; value: number }>(
    ActionAppTypes.DOCUMENT_EDIT_LINE,
  ),
  setSettings: createActionPayload<ActionAppTypes.SET_SETTINGS, IAppSettings>(ActionAppTypes.SET_SETTINGS),
};

export type TAppActions = ActionsUnion<typeof AppActions>;
