import { Reducer } from 'react';

/*import contacts from '../../mockData//GD_Contact.json';*/
import documents from '../../mockData/Document.json';
import { IDocument, IContact, IDocumentType, IInventoryDocumentType, IGood, IReference } from '../../../../common';
//import documents from '../../mockData/Otves/Document.json';
//import references from '../../mockData/Otves/References.json';
/*import documentTypes from '../../mockData/GD_DocumentType.json';*/
/*import goods from '../../mockData/Goods.json';*/
import references from '../../mockData/References.json';
import remains from '../../mockData/Remains.json';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IAppState, ISellDocument } from '../../model';
import { TAppActions, ActionAppTypes } from './actions';
const documentTypes = references.find((ref) => ref.type === 'documentTypes').data as IInventoryDocumentType[] | IDocumentType[];
const contacts = references.find((ref) => ref.type === 'contacts').data as IContact[];
const goods = references.find((ref) => ref.type === 'goods').data as IGood[];

export const initialState: IAppState = {
  documents,
  remains,
  goods,
  documentTypes,
  contacts,
  references: references as IReference[],
};

export const reducer: Reducer<IAppState, TAppActions> = (state = initialState, action): IAppState => {
  switch (action.type) {
    case ActionAppTypes.DISCONNECT:
      return { ...initialState };
    case ActionAppTypes.NEW_DOCUMENT: {
      return { ...state, documents: [...state.documents, action.payload] };
    }
    case ActionAppTypes.EDIT_DOCUMENT: {
      const idx = state.documents.findIndex((document) => document.id === action.payload.id);
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, idx),
          {
            ...state.documents.find((document) => document.id === action.payload.id),
            head: action.payload.head,
          },
          ...state.documents.slice(idx + 1),
        ],
      };
    }
    case ActionAppTypes.EDIT_STATUS_DOCUMENT: {
      const idx = state.documents.findIndex((document) => document.id === action.payload.id);
      const document = state.documents[idx];
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, idx),
          {
            ...document,
            head: {
              ...document.head,
              status: action.payload.status,
            },
          },
          ...state.documents.slice(idx + 1),
        ],
      };
    }
    case ActionAppTypes.DELETE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter((document) => document.id !== action.payload),
      };
    case ActionAppTypes.DOCUMENT_ADD_LINE: {
      const idx = state.documents.findIndex((document) => document.id === action.payload.docId);
      const document = state.documents[idx];
      const docLine = (document as IDocument).lines;
      // document instanceof Object && (document as IDocument)
      //   ? (document as IDocument).lines
      //   : (document as ISellDocument).lines;
      const id =
        docLine
          .map((item: { id: unknown }) => Number(item.id))
          .reduce((lineId: number, currLineId: number) => {
            return lineId > currLineId ? lineId : currLineId;
          }, -1) + 1;
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, idx),
          {
            ...document,
            lines: [...document.lines, { ...action.payload.line, id: id.toString() }],
          },
          ...state.documents.slice(idx + 1),
        ],
      };
    }
    case ActionAppTypes.DOCUMENT_DELETE_LINE: {
      const idx = state.documents.findIndex((document) => document.id === action.payload.docId);
      const document = state.documents[idx];
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, idx),
          {
            ...document,
            lines: document.lines.filter((line) => line.id !== action.payload.lineId),
          },
          ...state.documents.slice(idx + 1),
        ],
      };
    }
    case ActionAppTypes.DOCUMENT_EDIT_LINE: {
      const idx = state.documents.findIndex((document) => document.id === action.payload.docId);
      const document = state.documents[idx];
      const idxl = document.lines.findIndex((line) => line.id === action.payload.lineId);
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, idx),
          {
            ...document,
            lines: [
              ...document.lines.slice(0, idxl),
              {
                ...document.lines.find((line) => line.id === action.payload.lineId),
                quantity: action.payload.value,
              },
              ...document.lines.slice(idxl + 1),
            ],
          },
          ...state.documents.slice(idx + 1),
        ],
      };
    }
    default:
      return state;
  }
};
