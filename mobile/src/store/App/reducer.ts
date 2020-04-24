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
  documents,
  remains,
  references,
  goods,
  contacts,
  documentTypes,
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
            ...action.payload.head,
          },
          ...state.documents.slice(action.payload.id),
        ],
      };
    case ActionAppTypes.DOCUMENT_ADD_LINE: {
      const document = state.documents.find((item) => item.id === action.payload.docId);
      const id =
        Number(
          document.lines.reduce((line, currLine) => {
            return line.id > currLine.id ? line : currLine;
          }).id,
        ) + 1;
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, action.payload.docId),
          {
            ...document,
            lines: [...document.lines, { id: id.toString(), ...action.payload.line }],
          },
          ...state.documents.slice(action.payload.docId),
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
          ...state.documents.slice(action.payload.docId),
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
              ...document.lines.slice(Number(action.payload.lineId)),
            ],
          },
          ...state.documents.slice(action.payload.docId),
        ],
      };
    }
    default:
      return state;
  }
};
