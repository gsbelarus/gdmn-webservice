/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import { IContact, IDocument, IGood, IRemains } from '../../../../common';
// import { ICompanySetting, IWeightCodeSettings } from '../../../../common/base';
import config from '../../config';
import { appStorage, getRemainsModel } from '../../helpers/utils';
import { IAppContextProps, IAppState, IAppSettings, IReferences, ICompanySettings } from '../../model/types';
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
  COMPANYSETTINGS: 'COMPANYSETTINGS',
  REFERENCES: 'REFERENCES',
  DOCUMENTS: 'DOCUMENTS',
  MODELS: 'MODELS',
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
        console.log('loadData');
        setLoading(true);
        // настройки приложения
        const storageSettings: IAppSettings = await appStorage.getItem(`${storagePath}/${sections.SETTINGS}`);
        actions.setSettings(storageSettings);
        // настройки компании
        const storageCompanySettings: ICompanySettings = await appStorage.getItem(
          `${storagePath}/${sections.COMPANYSETTINGS}`,
        );
        const weightSettings = storageCompanySettings?.weightSettings ?? config.system[0].weightSettings;
        actions.setCompanySettings(
          storageCompanySettings
            ? {
                ...storageCompanySettings,
                weightSettings,
              }
            : { weightSettings },
        );
        // Справочники
        const references = (await appStorage.getItem(`${storagePath}/${sections.REFERENCES}`)) as IReferences;
        actions.setReferences(references);

        console.log('getRemainsModel');
        const remainsModel = getRemainsModel(
          references?.contacts?.data as IContact[],
          references?.goods?.data as IGood[],
          (references?.remains?.data as unknown) as IRemains[],
        );
        actions.setModel(remainsModel);

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
        console.log('saveReferences');
        console.log('Начало сохранения справочников в Storage');
        await appStorage.setItem(`${storagePath}/${sections.REFERENCES}`, state.references);
        console.log('Окончание сохранения справочников в Storage');
      };

      if (state.references && storagePath && !isLoading) {
        saveReferences();
      }
    }, [state.references, storagePath]);

    /*  Сохранение настроек в storage при их изменении */
    useEffect(() => {
      const saveSettings = async () => {
        console.log('saveSettings');
        await appStorage.setItem(`${storagePath}/${sections.SETTINGS}`, state.settings);
      };

      if (state.settings && storagePath && !isLoading) {
        saveSettings();
      }
    }, [state.settings, storagePath]);

    /*  Сохранение настроек компании в storage при их изменении */
    useEffect(() => {
      const saveCompanySettings = async () => {
        console.log('saveCompanySettings');
        await appStorage.setItem(`${storagePath}/${sections.COMPANYSETTINGS}`, state.companySettings);
      };

      if (state.companySettings && storagePath && !isLoading) {
        saveCompanySettings();
      }
    }, [state.companySettings, storagePath]);

    /*  Сохранение документов в storage при их изменении */
    useEffect(() => {
      const saveDocuments = async () => {
        console.log('saveDocuments');
        await appStorage.setItem(`${storagePath}/${sections.DOCUMENTS}`, state.documents);
      };

      if (state.documents && storagePath && !isLoading) {
        saveDocuments();
      }
    }, [state.documents, storagePath]);

    // useEffect(() => {
    //   console.log('deleteDocument');
    //   if (!!state.settings?.autodeletingDocument && state.documents && !isLoading) {
    //     const deleteDocs = state.documents.filter((document) => document?.head?.status === 3);

    //     if (deleteDocs.length > 0) {
    //       deleteDocs.forEach((document) => {
    //         actions.deleteDocument(document.id);
    //       });
    //     }
    //   }
    // }, [actions, state.documents, state.settings]);

    // useEffect(() => {
    //   if (!isLoading) {
    //     console.log('getRemainsModel');
    //     const remainsModel = getRemainsModel(
    //       state.references?.contacts?.data as IContact[],
    //       state.references?.goods?.data as IGood[],
    //       (state.references?.remains?.data as unknown) as IRemains[],
    //     );
    //     actions.setModel(remainsModel);
    //   }
    // }, [state.references?.contacts?.data, state.references?.goods?.data, state.references?.remins?.data]);

    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
