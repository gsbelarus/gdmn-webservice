import { ActionAuthTypes } from './actions';

export const middleware = (action: any) => {
  if (__DEV__) {
    console.log('Middleware Auth action: ', JSON.stringify(action));
  }

  switch (action.type) {
    case ActionAuthTypes.SET_USER_STATUS: {
    }
  }
};
