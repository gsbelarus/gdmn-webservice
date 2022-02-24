import { IServiceState } from '../../model/types';
import { ActionServiceTypes, TServiceActions } from './actions';

export const middleware = (action: TServiceActions, state: IServiceState) => {
  if (__DEV__) {
    console.log('Middleware Service action: ', JSON.stringify(action));
  }

  switch (action.type) {
    case ActionServiceTypes.SET_LOADING:
  }
};
