import React, { useEffect } from 'react';

import { IContact, IDocument, IGood, IRemains } from '../../../../common';
import { IMDGoodRemain, IModel, IModelData } from '../../../../common/base';
import config from '../../config';
import { rlog } from '../../helpers/log';
import { appStorage, getRemainsModel } from '../../helpers/utils';
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
        rlog('Load data', 'Начало загрузки данных из Storage');
        // console.log('loadData');
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

        rlog('getRemainsModel', 'Начало построения модели');
        const remainsModel: IModel<IModelData<IMDGoodRemain>> = getRemainsModel(
          references?.contacts?.data as IContact[],
          references?.goods?.data as IGood[],
          (references?.remains?.data as unknown) as IRemains[],
        );
        rlog('getRemainsModel', 'Окончание построения модели');
        actions.setModel(remainsModel);
        // документы
        const documents = (await appStorage.getItem(`${storagePath}/${sections.DOCUMENTS}`)) as IDocument[];
        actions.setDocuments(documents);

        // viewParams
        const viewParams = (await appStorage.getItem(`${storagePath}/${sections.VIEWPARAMS}`)) as IViewParams;
        actions.setViewParams(viewParams);

        rlog('Load data', 'Окончание загрузки данных из Storage');
        setLoading(false);
      };

      if (storagePath) {
        loadData();
      }
    }, [actions, setLoading, storagePath]);

    // /* Формирование модели при изменениях в справочниках*/
    // useEffect(() => {
    //   const saveModel = async () => {
    //     rlog('getRemainsModel', 'Начало построения модели');
    //     const remainsModel: IModel<IModelData<IMDGoodRemain>> = getRemainsModel(
    //       state.references?.contacts?.data as IContact[],
    //       state.references?.goods?.data as IGood[],
    //       (state.references?.remains?.data as unknown) as IRemains[],
    //     );
    //     rlog('getRemainsModel', 'Окончание построения модели');
    //     actions.setModel(remainsModel);
    //   };

    //   if (state.references && storagePath && !isLoading) {
    //     saveModel();
    //   }
    // }, [references?.contacts?.data, references?.goods?.data, references?.remains?.data, storagePath, isLoading]);

    /*  Сохранение справочников в storage при их изменении */
    useEffect(() => {
      const saveReferences = async () => {
        // console.log('saveReferences');
        rlog('Save references', 'Начало сохранения справочников в Storage');
        // console.log('Начало сохранения справочников в Storage');
        await appStorage.setItem(`${storagePath}/${sections.REFERENCES}`, state.references);
        rlog('Save references', 'Окончание сохранения справочников в Storage');
        // console.log('Окончание сохранения справочников в Storage');
      };

      if (state.references && storagePath && !isLoading) {
        saveReferences();
      }
    }, [state.references, storagePath]);

    /*  Сохранение настроек в storage при их изменении */
    useEffect(() => {
      const saveSettings = async () => {
        // console.log('saveSettings');
        rlog('Save setting', 'Начало сохранения настроек в Storage');
        await appStorage.setItem(`${storagePath}/${sections.SETTINGS}`, state.settings);
        rlog('Save setting', 'Окончание сохранения настроек в Storage');
      };

      if (state.settings && storagePath && !isLoading) {
        saveSettings();
      }
    }, [state.settings, storagePath]);

    /*  Сохранение настроек компании в storage при их изменении */
    useEffect(() => {
      const saveCompanySettings = async () => {
        // console.log('saveCompanySettings');
        rlog('Save CompanySettings', 'Начало сохранения настроек компании в Storage');
        await appStorage.setItem(`${storagePath}/${sections.COMPANYSETTINGS}`, state.companySettings);
        rlog('Save CompanySettings', 'Окончание сохранения настроек компании в Storage');
      };

      if (state.companySettings && storagePath && !isLoading) {
        saveCompanySettings();
      }
    }, [state.companySettings, storagePath]);

    /*  Сохранение документов в storage при их изменении */
    useEffect(() => {
      const saveDocuments = async () => {
        // console.log('saveDocuments');
        rlog('Save Documents', 'Начало сохранения документов в Storage');
        await appStorage.setItem(`${storagePath}/${sections.DOCUMENTS}`, state.documents);
        rlog('Save Documents', 'Окончание сохранения настроек документов в Storage');
      };

      if (state.documents && storagePath && !isLoading) {
        saveDocuments();
      }
    }, [state.documents, storagePath]);

    /*  Сохранение viewParams в storage при их изменении */
    useEffect(() => {
      const saveViewParams = async () => {
        // console.log('saveDocuments');
        rlog('Save ViewParams', 'Начало сохранения viewParams в Storage');
        await appStorage.setItem(`${storagePath}/${sections.VIEWPARAMS}`, state.viewParams);
        rlog('Save ViewParams', 'Окончание сохранения viewParams в Storage');
      };
      if (state.viewParams && storagePath && !isLoading) {
        saveViewParams();
      }
    }, [state.viewParams, storagePath]);

    // function useSelectors(ourReducer: Reducer<IAppState, TAppActions>, mapStateToSelectors: (arg0: IAppState) => any) {
    //   // eslint-disable-next-line no-shadow
    //   const [state] = ourReducer;
    //   const selectors = useMemo(() => mapStateToSelectors(state), [state]);
    //   return selectors;
    // }

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
    //   console.log('getRemainsModel_1');
    //   console.log('contacts', state.references?.contacts?.data?.length);
    //   console.log('goods', state.references?.goods?.data?.length);
    //   console.log('remins', state.references?.remins?.data?.length);
    //   if (state.references?.contacts?.data && state.references?.goods?.data && state.references?.remins?.data) {
    //     console.log('getRemainsModel_2');
    //     const remainsModel = getRemainsModel(
    //       state.references?.contacts?.data as IContact[],
    //       state.references?.goods?.data as IGood[],
    //       (state.references?.remains?.data as unknown) as IRemains[],
    //     );
    //     console.log('getRemainsModel_3', remainsModel.name);
    //     actions.setModel(remainsModel);
    //   }
    // }, [state.references?.contacts?.data, state.references?.goods?.data, state.references?.remins?.data]);

    return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
  };

  const useStore = () => React.useContext(StoreContext);

  return { StoreProvider, useStore };
};

export const { StoreProvider, useStore } = createStoreContext();
