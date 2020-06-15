import { Reducer } from 'react';

import contacts from '../../mockData//GD_Contact.json';
import documents from '../../mockData/Document.json';
import documentTypes from '../../mockData/GD_DocumentType.json';
import goods from '../../mockData/Goods.json';
import references from '../../mockData/References.json';
import remains from '../../mockData/Remains.json';
import { IAppState } from '../../model';
import { TAppActions, ActionAppTypes } from './actions';

export const initialState: IAppState = {
  settings: undefined,
  documents,
  remains,
  references,
  goods,
  contacts,
  documentTypes,
};

export const reducer: Reducer<IAppState, TAppActions> = (state = initialState, action): IAppState => {
  console.log('App action: ', JSON.stringify(action));
  switch (action.type) {
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
      const id =
        document.lines
          .map((item) => Number(item.id))
          .reduce((lineId, currLineId) => {
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
      const idx = state.documents.findIndex((document) => document.id === action.payload.docId);
      const document = state.documents[idx];
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, idx),
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
          ...state.documents.slice(idx + 1),
        ],
      };
    }
    case ActionAppTypes.SET_SETTINGS:
      return { ...state, settings: action.payload };
    default:
      return state;
  }
};
