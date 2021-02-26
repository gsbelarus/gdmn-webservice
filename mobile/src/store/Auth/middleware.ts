import Reactotron from 'reactotron-react-native';

import { IAuthState } from '../../model/types';
import { ActionAuthTypes, TAuthActions } from './actions';

export const middleware = (action: TAuthActions, state: IAuthState) => {
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
