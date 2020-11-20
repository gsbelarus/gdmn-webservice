/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import { IDocument } from '../../../../common';
import { appStorage } from '../../helpers/utils';
import { IAppContextProps, IAppState, IAppSettings, IReferences } from '../../model/types';
import { useStore as useServiceStore } from '../Service/store';
import { useTypesafeActions } from '../utils';
import { AppActions } from './actions';
import { reducer, initialState } from './reducer';

const defaultAppState: IAppContextProps = {
  state: initialState,
  actions: AppActions,
};

const sections = {
  SETTINGS: 'SETTINGS',
  REFERENCES: 'REFERENCES',
  DOCUMENTS: 'DOCUMENTS',
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IAppContextProps>(defaultAppState);

  const StoreProvider = ({ children }) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    const {
      state: { storagePath, isLoading },
      actions: { setLoading },
    } = useServiceStore();

    /* При смене ветки хранилища данных (пользователь\копмания) перезагружаем данные из хранилища */
    /* TODO Предотвратить выполнение сохранения в момент выполнения loadData */
    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        // настройки приложения
        const storageSettings: IAppSettings = await appStorage.getItem(`${storagePath}/${sections.SETTINGS}`);
        actions.setSettings(storageSettings);
        // Справочники
        const references = (await appStorage.getItem(`${storagePath}/${sections.REFERENCES}`)) as IReferences;
        actions.setReferences(references);
        // документы
        const documents = (await appStorage.getItem(`${storagePath}/${sections.DOCUMENTS}`)) as IDocument[];
        actions.setDocuments(documents);
        setLoading(false);
      };

      if (storagePath) {
        loadData();
      }
    }, [actions, storagePath]);

    /*  Сохранение справочников в storage при их изменении */
    useEffect(() => {
      const saveReferences = async () => {
        await appStorage.setItem(`${storagePath}/${sections.REFERENCES}`, state.references);
      };

      if (state.references && storagePath && !isLoading) {
        saveReferences();
      }
    }, [state.references, storagePath]);

    /*  Сохранение настроек в storage при их изменении */
    useEffect(() => {
      const saveSettings = async () => {
        await appStorage.setItem(`${storagePath}/${sections.SETTINGS}`, state.settings);
      };

      if (state.references && storagePath && !isLoading) {
        saveSettings();
      }
    }, [state.references, storagePath]);

    /*  Сохранение документов в storage при их изменении */
    useEffect(() => {
      const saveSettings = async () => {
        await appStorage.setItem(`${storagePath}/${sections.DOCUMENTS}`, state.documents);
      };

      if (state.documents && storagePath && !isLoading) {
        saveSettings();
      }
    }, [state.documents, storagePath]);

    useEffect(() => {
      if (!!state.settings?.autodeletingDocument && state.documents && !isLoading) {
        const deleteDocs = state.documents.filter((document) => document?.head?.status === 3);
        if (deleteDocs.length > 0) {
          deleteDocs.forEach((document) => {
            actions.deleteDocument(document.id);
          });
        }
      }
    }, [actions, state.documents, state.settings]);

    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
