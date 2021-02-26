import Reactotron from 'reactotron-react-native';

import { IAppState } from '../../model/types';
import { TAppActions, ActionAppTypes } from './actions';

/* const loggerBefore = (action) => {
  console.log('logger before:', action);
};

const loggerAfter = (action) => {
  console.log('logger after:', action);
}; */

export const middleware = (action: TAppActions, state: IAppState) => {
  if (__DEV__) {
    console.log('Middleware App action: ', JSON.stringify(action));
    /*     Reactotron.display({
      name: `App action ${action.type}`,
      value: action,
      important: false,
    }); */
  }

  switch (action.type) {
    case ActionAppTypes.ADD_DOCUMENT: {
    }
  }
};
