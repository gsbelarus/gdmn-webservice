/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import { appStorage } from '../../helpers/utils';
import { IAppContextProps, IAppState, IAppSettings } from '../../model/types';
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
  CONTACTS: 'CONTACTS',
  DOCUMENTTYPES: 'DOCUMENTTYPES',
  GOODS: 'GOODS',
  DOCUMENTS: 'DOCUMENTS',
  REMAINS: 'REMAINS',
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
        actions.setSettings(storageSettings || {});
        // типы документов
        const documentTypes = await appStorage.getItem(`${storagePath}/${sections.DOCUMENTTYPES}`);
        actions.setDocumentTypes(documentTypes || []);
        // документы
        const documents = await appStorage.getItem(`${storagePath}/${sections.DOCUMENTS}`);
        actions.setDocuments(documents || []);
        // остатки
        const remains = await appStorage.getItem(`${storagePath}/${sections.REMAINS}`);
        actions.setRemains(remains || []);
        // товары
        const goods = await appStorage.getItem(`${storagePath}/${sections.GOODS}`);
        actions.setGoods(goods || []);
        // контакты
        const contacts = await appStorage.getItem(`${storagePath}/${sections.CONTACTS}`);
        actions.setContacts(contacts || []);
        setLoading(false);
      };

      if (storagePath) {
        loadData();
      }
    }, [actions, storagePath]);

    /*  Сохранение настроек в storage при их изменении */
    useEffect(() => {
      const saveSettings = async () => {
        await appStorage.setItem(`${storagePath}/${sections.SETTINGS}`, state.settings);
      };

      if (state.settings && storagePath && !isLoading) {
        saveSettings();
      }
    }, [state.settings, storagePath]);

    /*  Сохранение контактов в storage при их изменении */
    useEffect(() => {
      const saveData = async () =>
        await appStorage.setItem(`${storagePath}/${sections.CONTACTS}`, state.references.contacts);
      if (state.references.contacts && storagePath && !isLoading) {
        saveData();
      }
    }, [state.references.contacts, storagePath]);

    /*  Сохранение товаров в storage при их изменении */
    useEffect(() => {
      const saveData = async () => await appStorage.setItem(`${storagePath}/${sections.GOODS}`, state.references.goods);
      if (state.references.goods && storagePath && !isLoading) {
        saveData();
      }
    }, [state.references.goods, storagePath]);

    /*  Сохранение типов документов в storage при их изменении */
    useEffect(() => {
      const saveData = async () =>
        await appStorage.setItem(`${storagePath}/${sections.DOCUMENTTYPES}`, state.references.documentTypes);
      if (state.references.documentTypes && storagePath && !isLoading) {
        saveData();
      }
    }, [state.references.documentTypes, storagePath]);

    /*  Сохранение остатков в storage при их изменении */
    useEffect(() => {
      const saveData = async () => {
        await appStorage.setItem(`${storagePath}/${sections.REMAINS}`, state.references.remains);
      };

      if (state.references.remains && storagePath && !isLoading) {
        saveData();
      }
    }, [state.references.remains, storagePath]);

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
      if (!!state.settings?.autodeletingDocument && !isLoading) {
        const deleteDocs = state.documents.filter((document) => document.head.status === 3);
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
