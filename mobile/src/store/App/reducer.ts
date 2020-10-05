import { Reducer } from 'react';
import Reactotron from 'reactotron-react-native';

import { getNextDocLineId } from '../../helpers/utils';
import { IAppState } from '../../model/types';
import { TAppActions, ActionAppTypes } from './actions';

export const initialState: IAppState = {
  settings: {},
  documents: [],
  references: {},
  forms: {},
  filterParams: ['number'],
};

export const reducer: Reducer<IAppState, TAppActions> = (state = initialState, action): IAppState => {
  if (__DEV__) {
    console.log('App action: ', JSON.stringify(action));
    Reactotron.log('appStore', action);
  }

  switch (action.type) {
    case ActionAppTypes.ADD_DOCUMENT: {
      return { ...state, documents: [...state.documents, action.payload] };
    }
    case ActionAppTypes.UPDATE_DOCUMENT_HEAD: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? { ...doc, head: action.payload.head } : doc,
        ),
      };
      // const idx = state.documents.findIndex((document) => document.id === action.payload.id);
      // return {
      //   ...state,
      //   documents: [
      //     ...state.documents.slice(0, idx),
      //     {
      //       ...state.documents.find((document) => document.id === action.payload.id),
      //       head: action.payload.head,
      //     },
      //     ...state.documents.slice(idx + 1),
      //   ],
      // };
    }
    case ActionAppTypes.UPDATE_DOCUMENT_STATUS: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? { ...doc, head: { ...doc.head, status: action.payload.status } } : doc,
        ),
      };
      // const idx = state.documents.findIndex((document) => document.id === action.payload.id);
      // const document = state.documents[idx];
      // return {
      //   ...state,
      //   documents: [
      //     ...state.documents.slice(0, idx),
      //     {
      //       ...document,
      //       head: {
      //         ...document?.head,
      //         status: action.payload.status,
      //       },
      //     },
      //     ...state.documents.slice(idx + 1),
      //   ],
      // };
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
          doc.id === action.payload.docId
            ? { ...doc, lines: [...doc.lines, { ...action.payload.line, id: nextId }] }
            : doc,
        ),
      };

      /*   const idx = state.documents.findIndex((document) => document.id === action.payload.docId);
      const document = state.documents[idx];
      const docLine = document.lines;
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
      }; */
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

    /* const idx = state.documents.findIndex((document) => document.id === action.payload.docId);
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
  } */
    case ActionAppTypes.DOCUMENT_UPDATE_LINE: {
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.docId
            ? {
                ...doc,
                lines: doc.lines.map((line) => (line.id === action.payload.line.id ? action.payload.line : line)),
              }
            : doc,
        ),
      };
      /*       const idx = state.documents.findIndex((document) => document.id === action.payload.docId);
      const document = state.documents[idx];
      const idxl = document.lines.findIndex((line) => line.id === action.payload.line.id);
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
      }; */
    }
    case ActionAppTypes.SET_SETTINGS:
      return { ...state, settings: action.payload };
    // case ActionAppTypes.SET_DOCUMENTTYPES:
    //   return { ...state, references: {...state.references, documentTypes: { action.payload }}}
    case ActionAppTypes.SET_DOCUMENTS:
      return { ...state, documents: action.payload };
    case ActionAppTypes.SET_REFERENCES:
      return { ...state, references: action.payload };
    case ActionAppTypes.SET_REFERENCE:
      return { ...state, references: { ...state.references, [action.payload.name]: action.payload } };
    case ActionAppTypes.SET_FORM: {
      return { ...state, forms: { ...state.forms, [action.payload.name]: action.payload } };
    }
    /*  case ActionAppTypes.SET_REMAINS:
      return { ...state, remains: action.payload }
    case ActionAppTypes.SET_CONTACTS:
      return { ...state, contacts: action.payload }
    case ActionAppTypes.SET_GOODS:
      return { ...state, goods: action.payload }
    case ActionAppTypes.SET_SETTINGS_SEARCH: {
      return { ...state, filterParams: action.payload }
    }
    case ActionAppTypes.SET_FORM_PARAMS: {
      return { ...state, formParams: { ...state.formParams, ...action.payload } }
    }
    case ActionAppTypes.CLEAR_FORM_PARAMS: {
      return { ...state, formParams: undefined };
    }
    case ActionAppTypes.SET_PRODUCT_PARAMS: {
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
    } */
    default:
      return state;
  }
};
