import React, { useEffect } from 'react';

import { IDocument } from '../../../../common';
import config from '../../config';
import { log } from '../../helpers/log';
import { appStorage } from '../../helpers/utils';
import {
  IAppContextProps,
  IAppState,
  IAppSettings,
  IReferences,
  ICompanySettings,
  IViewParams,
} from '../../model/types';
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
  VIEWPARAMS: 'VIEWPARAMS',
};

const createStoreContext = () => {
  const StoreContext = React.createContext<IAppContextProps>(defaultAppState);

  const StoreProvider = ({ children }: any) => {
    const [state, actions] = useTypesafeActions<IAppState, typeof AppActions>(reducer, initialState, AppActions);
    const {
      state: { storagePath, isLoading },
      actions: { setLoading },
    } = useServiceStore();

    /* При смене ветки хранилища данных (пользователь\копмания) перезагружаем данные из хранилища */
    /* TODO Предотвратить выполнение сохранения в момент выполнения loadData */
    useEffect(() => {
      const loadData = async () => {
        log('Load data', 'Начало загрузки данных из Storage');
        setLoading(true);
        // настройки приложения
        const storageSettings: IAppSettings = await appStorage.getItem(`${storagePath}/${sections.SETTINGS}`);
        log('Load data', 'Прочитаны настройки приложения');
        actions.setSettings(storageSettings);
        log('Load data', 'Настройки приложения отправлены в редукс');
        // настройки компании
        const storageCompanySettings: ICompanySettings = await appStorage.getItem(
          `${storagePath}/${sections.COMPANYSETTINGS}`,
        );
        log('Load data', 'Прочитаны настройки компании');
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
        log('Load data', 'Прочитаны справочники');
        actions.setReferences(references);
        log('Load data', 'Справочники отправлены в редукс');
        // документы
        const documents = (await appStorage.getItem(`${storagePath}/${sections.DOCUMENTS}`)) as IDocument[];
        actions.setDocuments(documents);

        // viewParams
        const viewParams = (await appStorage.getItem(`${storagePath}/${sections.VIEWPARAMS}`)) as IViewParams;
        actions.setViewParams(viewParams);

        log('Load data', 'Окончание загрузки данных из Storage');
        setLoading(false);
      };

      if (storagePath) {
        loadData();
      }
    }, [actions, setLoading, storagePath]);

    /*  Сохранение справочников в storage при их изменении */
    useEffect(() => {
      const saveReferences = async () => {
        // console.log('saveReferences');
        log('Save references', 'Начало сохранения справочников в Storage');
        // console.log('Начало сохранения справочников в Storage');
        await appStorage.setItem(`${storagePath}/${sections.REFERENCES}`, state.references);
        log('Save references', 'Окончание сохранения справочников в Storage');
      };

      if (state.references && storagePath && !isLoading) {
        saveReferences();
      }
    }, [state.references, storagePath]);

    /*  Сохранение настроек в storage при их изменении */
    useEffect(() => {
      const saveSettings = async () => {
        // console.log('saveSettings');
        log('Save setting', 'Начало сохранения настроек в Storage');
        await appStorage.setItem(`${storagePath}/${sections.SETTINGS}`, state.settings);
        log('Save setting', 'Окончание сохранения настроек в Storage');
      };

      if (state.settings && storagePath && !isLoading) {
        saveSettings();
      }
    }, [state.settings, storagePath]);

    /*  Сохранение настроек компании в storage при их изменении */
    useEffect(() => {
      const saveCompanySettings = async () => {
        // console.log('saveCompanySettings');
        log('Save CompanySettings', 'Начало сохранения настроек компании в Storage');
        await appStorage.setItem(`${storagePath}/${sections.COMPANYSETTINGS}`, state.companySettings);
        log('Save CompanySettings', 'Окончание сохранения настроек компании в Storage');
      };

      if (state.companySettings && storagePath && !isLoading) {
        saveCompanySettings();
      }
    }, [state.companySettings, storagePath]);

    /*  Сохранение документов в storage при их изменении */
    useEffect(() => {
      const saveDocuments = async () => {
        // console.log('saveDocuments');
        log('Save Documents', 'Начало сохранения документов в Storage');
        await appStorage.setItem(`${storagePath}/${sections.DOCUMENTS}`, state.documents);
        log('Save Documents', 'Окончание сохранения настроек документов в Storage');
      };

      if (state.documents && storagePath && !isLoading) {
        saveDocuments();
      }
    }, [state.documents, storagePath]);

    /*  Сохранение viewParams в storage при их изменении */
    useEffect(() => {
      const saveViewParams = async () => {
        // console.log('saveDocuments');
        log('Save ViewParams', 'Начало сохранения viewParams в Storage');
        await appStorage.setItem(`${storagePath}/${sections.VIEWPARAMS}`, state.viewParams);
        log('Save ViewParams', 'Окончание сохранения viewParams в Storage');
      };
      if (state.viewParams && storagePath && !isLoading) {
        saveViewParams();
      }
    }, [state.viewParams, storagePath]);
    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
