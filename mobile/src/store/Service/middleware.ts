import Reactotron from 'reactotron-react-native';

import { IServiceState } from '../../model/types';
import { StoreMiddlware } from '../utils';
import { ActionServiceTypes, TServiceActions } from './actions';

export const middleware: StoreMiddlware = (action: TServiceActions, state: IServiceState) => {
  if (__DEV__) {
    console.log('Middleware Service action: ', JSON.stringify(action));
    /*     Reactotron.display({
      name: `Service action ${action.type}`,
      value: action,
      important: false,
    }); */
  }

  switch (action.type) {
    case ActionServiceTypes.SET_LOADING:
  }
};
