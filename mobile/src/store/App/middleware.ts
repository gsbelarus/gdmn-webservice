import { TAppActions, ActionAppTypes } from './actions';

/* const loggerBefore = (action) => {
  console.log('logger before:', action);
};

const loggerAfter = (action) => {
  console.log('logger after:', action);
}; */

export const middleware = (action: TAppActions) => {
  if (__DEV__) {
    console.log('Middleware App action: ', JSON.stringify(action));
  }

  switch (action.type) {
    case ActionAppTypes.ADD_DOCUMENT: {
    }
  }
};
