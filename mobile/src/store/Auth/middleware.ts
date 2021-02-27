import Reactotron from 'reactotron-react-native';

import { IAuthState } from '../../model/types';
import { StoreMiddlware } from '../utils';
import { ActionAuthTypes, TAuthActions } from './actions';

export const middleware: StoreMiddlware<TAuthActions> = (action) => {
  if (__DEV__) {
    console.log('Middleware Auth action: ', JSON.stringify(action));
    /*     Reactotron.display({
      name: `Auth action ${action.type}`,
      value: action,
      important: false,
    }); */
  }

  switch (action.type) {
    case ActionAuthTypes.SET_USER_STATUS: {
    }
  }
};
