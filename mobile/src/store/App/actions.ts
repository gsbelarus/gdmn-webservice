import { IHead, ILine } from '../../model/inventory';
import { createActionPayload, ActionsUnion } from '../utils';

export enum ActionAppTypes {
  DISCONNECT = 'DISCONNECT',
  NEW_DOCUMENT = 'NEW_DOCUMENT',
  EDIT_DOCUMENT = 'EDIT_DOCUMENT',
  DOCUMENT_ADD_LINE = 'DOCUMENT_ADD_LINE',
  DOCUMENT_DELETE_LINE = 'DOCUMENT_DELETE_LINE',
  DOCUMENT_EDIT_LINE = 'DOCUMENT_EDIT_LINE',
}

export const AppActions = {
  disconnect: createActionPayload<ActionAppTypes.DISCONNECT, void>(ActionAppTypes.DISCONNECT),
  newDocument: createActionPayload<ActionAppTypes.NEW_DOCUMENT, { head: IHead; lines: ILine[] }>(
    ActionAppTypes.NEW_DOCUMENT,
  ),
  editDocument: createActionPayload<ActionAppTypes.EDIT_DOCUMENT, { id: number; head: IHead }>(
    ActionAppTypes.EDIT_DOCUMENT,
  ),
  addLine: createActionPayload<ActionAppTypes.DOCUMENT_ADD_LINE, { docId: number; line: ILine }>(
    ActionAppTypes.DOCUMENT_ADD_LINE,
  ),
  deleteLine: createActionPayload<ActionAppTypes.DOCUMENT_DELETE_LINE, { docId: number; lineId: string }>(
    ActionAppTypes.DOCUMENT_DELETE_LINE,
  ),
  editLine: createActionPayload<ActionAppTypes.DOCUMENT_EDIT_LINE, { docId: number; lineId: string; value: number }>(
    ActionAppTypes.DOCUMENT_EDIT_LINE,
  ),
};

export type TAppActions = ActionsUnion<typeof AppActions>;
