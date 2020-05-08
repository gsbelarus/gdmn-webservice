import { Reducer } from 'react';

/*import contacts from '../../mockData//GD_Contact.json';
import documents from '../../mockData/Document.json';*/
import documents from '../../mockData/Otves/Document.json';
import references from '../../mockData/Otves/References.json';
/*import documentTypes from '../../mockData/GD_DocumentType.json';*/
/*import goods from '../../mockData/Goods.json';
import references from '../../mockData/References.json';*/
import remains from '../../mockData/Remains.json';
const documentTypes = references.find((ref) => ref.type === "documentTypes").data;
const contacts = references.find((ref) => ref.type === "contacts").data;
const goods = references.find((ref) => ref.type === 'goods').data; 

import { IAppState } from '../../model';
import { TAppActions, ActionAppTypes } from './actions';

export const initialState: IAppState = {
  documents,
  remains, 
  goods, 
  documentTypes,
  contacts,
  references
};

export const reducer: Reducer<IAppState, TAppActions> = (state = initialState, action): IAppState => {
  switch (action.type) {
    case ActionAppTypes.DISCONNECT:
      return { ...initialState };
    case ActionAppTypes.NEW_DOCUMENT: {
      return { ...state, documents: [...state.documents, action.payload] };
    }
    case ActionAppTypes.EDIT_DOCUMENT:
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, action.payload.id),
          {
            ...state.documents.find((document) => document.id === action.payload.id),
            head: action.payload.head,
          },
          ...state.documents.slice(action.payload.id + 1),
        ],
      };
    case ActionAppTypes.EDIT_STATUS_DOCUMENT: {
      const document = state.documents.find((item) => item.id === action.payload.id);
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, action.payload.id),
          {
            ...document,
            head: {
              ...document.head,
              status: action.payload.status,
            },
          },
          ...state.documents.slice(action.payload.id + 1),
        ],
      };
    }
    case ActionAppTypes.DELETE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter((document) => document.id !== action.payload),
      };
    case ActionAppTypes.DOCUMENT_ADD_LINE: {
      const document = state.documents.find((item) => item.id === action.payload.docId);
      const id =
        document.lines
          .map((item) => Number(item.id))
          .reduce((lineId, currLineId) => {
            return lineId > currLineId ? lineId : currLineId;
          }, -1) + 1;
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, action.payload.docId),
          {
            ...document,
            lines: [...document.lines, { ...action.payload.line, id: id.toString() }],
          },
          ...state.documents.slice(action.payload.docId + 1),
        ],
      };
    }
    case ActionAppTypes.DOCUMENT_DELETE_LINE: {
      const document = state.documents.find((item) => item.id === action.payload.docId);
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, action.payload.docId),
          {
            ...document,
            lines: document.lines.filter((line) => line.id !== action.payload.lineId),
          },
          ...state.documents.slice(action.payload.docId + 1),
        ],
      };
    }
    case ActionAppTypes.DOCUMENT_EDIT_LINE: {
      const document = state.documents.find((item) => item.id === action.payload.docId);
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, action.payload.docId),
          {
            ...document,
            lines: [
              ...document.lines.slice(0, Number(action.payload.lineId)),
              {
                ...document.lines.find((line) => line.id === action.payload.lineId),
                quantity: action.payload.value,
              },
              ...document.lines.slice(Number(action.payload.lineId) + 1),
            ],
          },
          ...state.documents.slice(action.payload.docId + 1),
        ],
      };
    }
    default:
      return state;
  }
};
