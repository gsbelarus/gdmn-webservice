import { useState } from 'react';

import { IContact, IGood, IMDGoodRemain, IModel, IModelData, IRemains } from '../../../../common/base';
import { getRemainsModel } from '../../helpers/utils';
import { useAppStore } from '../../store';

export const useModel = () => {
  const { state: appState, actions: appActions } = useAppStore();

  const data = (state.models?.remains?.data as unknown) as IModelData<IMDGoodRemain>;
  const [model, setModel] = useState(data);

  const loadModel = (contacts: IContact[], goods: IGood[], remains: IRemains[]) => {
    // что-то загружаем, что-то формируем
    console.log('getRemainsModel', 'Начало построения модели');
    const remainsModel: IModel<IModelData<IMDGoodRemain>> = getRemainsModel(contacts, goods, remains);
    console.log('getRemainsModel', 'Окончание построения модели');
    setModel(remainsModel);
  };

  const refreshModel = () => {
    // перечитывается модель
    //setModel();
  };

  return [model, loadModel, refreshModel];
};

// export const screen = (props) => {

//   const [model, loadModel, refreshModel] = useModel();

//   useEffect( () => loadModel(), [] );

//   return (
//     <div>
//       <button onClick={ () => refreshModel() }
//          Refresh
//       </button>
//     </div>
//   )

// }
