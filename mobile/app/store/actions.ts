// import { TDeviceStatus } from '../model'
import { createActionPayload, ActionsUnion } from './utils';

interface IAction<T, R> {
  type: T;
  payload: R;
}

export enum ActionTypes {
  SET_DEVICE_STATUS = 'SET_DEVICE_STATUS',
  SET_USER_STATUS = 'SET_USER_STATUS',
  SET_COMPANY_ID = 'SET_COMPANY_ID',
  SET_USER_ID = 'SET_USER_ID'
}

/* type TDeviceStatus = IAction<ActionTypes.SET_DEVICE_STATUS, boolean>; */
/* type TUserStatus = IAction<ActionTypes.SET_USER_STATUS, boolean>; */
/* type TCompanyID = IAction<ActionTypes.SET_COMPANY_ID, number>; */
/* type TUserID = IAction<ActionTypes.SET_USER_ID, number>; */
/*  */
/* type CreateActionTypes = TDeviceStatus | TUserStatus | TCompanyID | TUserID; */

export const AppActions = {
   setDeviceStatus: createActionPayload<ActionTypes.SET_DEVICE_STATUS, boolean>(ActionTypes.SET_DEVICE_STATUS)
}

export type TActions = ActionsUnion<typeof AppActions>;
// export const deviceStatus = (payload: boolean): CreateActionTypes => {
//   return {
//     type: ActionTypes.SET_DEVICE_STATUS,
//     payload
//   };
// }

/* onst values = Object.keys(ActionTypes).filter(k => typeof ActionTypes[k as any] === "number").map(k => ActionTypes[k as any]);
const Actions = [...values];

export type TActions = ElementType<typeof Actions>

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
  ? ElementType
  : never
 */

// export type TActions = typeof ActionTypes;
