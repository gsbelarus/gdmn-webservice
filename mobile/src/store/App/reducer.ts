import { Reducer } from 'react';
import Reactotron from 'reactotron-react-native';

import { IDocument } from '../../../../common';
import { IAppState } from '../../model';
import { TAppActions, ActionAppTypes } from './actions';

export const initialState: IAppState = {
  settings: undefined,
  documents: undefined,
  remains: undefined,
  goods: undefined,
  contacts: undefined,
  documentTypes: undefined,
  boxings: undefined,
  boxingsLine: undefined,
  settingsSearch: ['number'],
  weighedGoods: undefined,
};

export const reducer: Reducer<IAppState, TAppActions> = (state = initialState, action): IAppState => {
  if (__DEV__) {
    // console.log('App action: ', JSON.stringify(action));
    Reactotron.log('appStore', action);
  }

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
    case ActionAppTypes.DELETE_ALL_DOCUMENTS:
      return {
        ...state,
        documents: [],
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
      const idxl = document.lines.findIndex((line) => line.id === action.payload.line.id);
      console.log(action.payload.line);
      return {
        ...state,
        documents: [
          ...state.documents.slice(0, idx),
          {
            ...document,
            lines: [
              ...document.lines.slice(0, idxl),
              {
                ...action.payload.line,
              },
              ...document.lines.slice(idxl + 1),
            ],
          },
          ...state.documents.slice(idx + 1),
        ],
      };
    }
    case ActionAppTypes.SET_SETTINGS:
      return { ...state, settings: action.payload };
    case ActionAppTypes.SET_DOCUMENTTYPES:
      return { ...state, documentTypes: action.payload };
    case ActionAppTypes.SET_DOCUMENTS:
      return { ...state, documents: action.payload };
    case ActionAppTypes.SET_REMAINS:
      return { ...state, remains: action.payload };
    case ActionAppTypes.SET_CONTACTS:
      return { ...state, contacts: action.payload };
    case ActionAppTypes.SET_GOODS:
      return { ...state, goods: action.payload };
    case ActionAppTypes.SET_BOXINGS:
      return { ...state, boxings: action.payload };
    case ActionAppTypes.SET_WEIGHED_GOODS:
      return { ...state, weighedGoods: action.payload };
    case ActionAppTypes.SET_BOXINGS_LINE: {
      return { ...state, boxingsLine: action.payload };
    }
    case ActionAppTypes.SET_SETTINGS_SEARCH: {
      return { ...state, settingsSearch: action.payload };
    }
    case ActionAppTypes.SET_FORM_PARAMS: {
      return { ...state, formParams: { ...state.formParams, ...action.payload } };
    }
    case ActionAppTypes.CLEAR_FORM_PARAMS: {
      return { ...state, formParams: undefined };
    }
    /*case ActionAppTypes.SET_PRODUCT_PARAMS: {
      return { ...state, productParams: { ...state.productParams, ...action.payload } };
    }
    case ActionAppTypes.CLEAR_PRODUCT_PARAMS: {
      return { ...state, productParams: undefined };
    }
    case ActionAppTypes.SET_DOCUMENT_PARAMS: {
      return { ...state, documentParams: { ...state.documentParams, ...action.payload } };
    }
    case ActionAppTypes.CLEAR_DOCUMENT_PARAMS: {
      return { ...state, documentParams: undefined };
    }*/
    default:
      return state;
  }
};
