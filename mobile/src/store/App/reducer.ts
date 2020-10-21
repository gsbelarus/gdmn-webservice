import { Reducer } from 'react';
import Reactotron from 'reactotron-react-native';

import { ILine } from '../../../../common';
import { getNextDocLineId } from '../../helpers/utils';
import { IAppState, ISellLine } from '../../model';
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
  settingsSearch: ['toContact'],
  weighedGoods: undefined,
};

export const reducer: Reducer<IAppState, TAppActions> = (state = initialState, action): IAppState => {
  if (__DEV__) {
    // console.log('App action: ', JSON.stringify(action));
    Reactotron.log('appStore', action);
  }

  switch (action.type) {
    case ActionAppTypes.NEW_DOCUMENT: {
      return { ...state, documents: [...(state.documents || []), action.payload] };
    }
    case ActionAppTypes.EDIT_DOCUMENT: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? { ...doc, head: action.payload.head } : doc,
        ),
      };
    }
    case ActionAppTypes.EDIT_STATUS_DOCUMENT: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? { ...doc, head: { ...doc.head, status: action.payload.status } } : doc,
        ),
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
      const nextId = getNextDocLineId(state.documents.find((doc) => doc.id === action.payload.docId));

      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.docId ? { ...doc, lines: [...doc.lines, action.payload.line] } : doc,
        ),
      };
    }
    case ActionAppTypes.DOCUMENT_DELETE_LINE: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.docId
            ? {
                ...doc,
                lines: doc.lines.filter((line) => line.id !== action.payload.lineId),
              }
            : doc,
        ),
      };
    }
    case ActionAppTypes.DOCUMENT_EDIT_LINE: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.docId
            ? {
                ...doc,
                lines: (doc.lines as (ILine | ISellLine)[]).map((line) =>
                  line.id === action.payload.line.id ? action.payload.line : line,
                ),
              }
            : doc,
        ),
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
    default:
      return state;
  }
};
