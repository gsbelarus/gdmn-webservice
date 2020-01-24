import { useState, useCallback } from "react";
import { IUserCompany, IUser } from "./types";

export type UserState = 'RECEIVED_COMPANIES'
  | 'RECIEVING_COMPANIES'
  | 'EDITED_USER'
  | 'EDITING_USER'
  | 'DELETED'
  | 'DELETING'
  | 'ADMIN'
  | 'PROFILE'
  | 'GETTING_ME'
  | 'GOT_ME'
  | 'LOGGING_OUT';

export interface IUserParams {
  state: UserState;
  companies?: IUserCompany[];
  user?: IUser;
  errorMessage?: string;
};

export type GetMeProc = () => Promise<IUserParams>;
export type GetCompaniesProc = (userId: string) => Promise<IUserParams>;
export type UpdateUserProc = (user: IUser) => Promise<IUserParams>;
export type DeleteUserProc = (userId: string) => Promise<IUserParams>;

export const useUserParams = (): [IUserParams, GetMeProc, GetCompaniesProc, UpdateUserProc, DeleteUserProc] => {
  const [userParams, setUserParams] = useState<IUserParams>({ state: 'ADMIN' });

  const doGetMe: GetMeProc = useCallback(async () => {
    setUserParams({ state: 'GETTING_ME' });

   console.log('doGetMe');

    try {
      const resFetch = await fetch(`http://localhost:3649/api/me`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      const res = await resFetch.json();

      let newState: IUserParams;
      const r = res.result;
      if (res.status === 200) {
        newState = {
          state: 'GOT_ME',
          user: {id: r.id, userName: r.userName, lastName: r.lastName, firstName: r.firstName, phoneNumber: r.phoneNumber, password: r.password}
        };
       } else {
        newState = {
          state: 'LOGGING_OUT',
          errorMessage: `${res.status} - ${res.result}`
        };
      }

      setUserParams(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: IUserParams = {
        state: 'LOGGING_OUT',
        errorMessage: err
      };

      setUserParams(newStateErr);
      return newStateErr;
    };

  }, []);

  const doGetCompanies: GetCompaniesProc = useCallback(async (userId: string) => {
    setUserParams({ state: 'RECIEVING_COMPANIES' });

   console.log('doGetCompanies');

    try {
      const resFetch = await fetch(`http://localhost:3649/api/organisation/byUser?userId=${userId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      const res = await resFetch.json();
      console.log(res);
      let newState: IUserParams;
      if (res.status === 200) {
        newState = {
          state: 'RECEIVED_COMPANIES',
          companies: res.result
        };
       } else {
        newState = {
          state: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }

      setUserParams(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: IUserParams = {
        state: 'ADMIN',
        errorMessage: err
      };

      setUserParams(newStateErr);
      return newStateErr;
    };

  }, []);

  const doUpdateUser: UpdateUserProc = useCallback(async (user: IUser) => {
    setUserParams({state: 'EDITING_USER'});
    console.log('doEdit');

    const body = JSON.stringify(user);

    try {
      const resFetch = await fetch("http://localhost:3649/api/user/edite", { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body });
      const res = await resFetch.json();
      let newState: IUserParams;
      if (res.status === 200) {
        newState = {
          state: 'EDITED_USER'
        };
      }
      else {
        newState = {
          state: 'PROFILE',
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setUserParams(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: IUserParams = {
        state: 'PROFILE',
        errorMessage: err
      };
      setUserParams(newStateErr);
      return newStateErr;
    }
  }, []);

  const doDeleteUser = async (userId: string) => {

    const body = JSON.stringify({
      userName: userId
    });

    setUserParams({state: 'DELETING'});
    console.log('doDelete');

    try {
      const resFetch = await fetch("http://localhost:3649/api/user/", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      const res = await resFetch.json();
      let newState: IUserParams;
      if (res.status === 200) {
        newState = {
          state: 'DELETED',
        };
      }
      else {
        newState = {
          state: 'ADMIN',
        };
      }
      setUserParams(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: IUserParams = {
        state: 'ADMIN'
      };
      setUserParams(newStateErr);
      return newStateErr;
    }
  };

  return [userParams, doGetMe, doGetCompanies, doUpdateUser, doDeleteUser];
};
