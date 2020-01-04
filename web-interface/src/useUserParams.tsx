import { useState, useCallback } from "react";
import { IUserCompany, IUser } from "./types";

export type UserState = 'RECEIVED_COMPANIES' | 'RECIEVING_COMPANIES' | 'EDITED_USER' | 'EDITING_USER' | 'DELETED' | 'DELETING' | 'ADMIN' | 'PROFILE';

export interface IUserParams {
  state: UserState;
  companies?: IUserCompany[];
  errorMessage?: string;
};

export type GetCompaniesProc = (userName: string) => Promise<IUserParams>;
export type EditUserProc = (user: IUser) => Promise<IUserParams>;
export type DeleteUserProc = (userName: string) => Promise<IUserParams>;

export const useUserParams = (): [IUserParams, GetCompaniesProc, EditUserProc, DeleteUserProc] => {
  const [userParams, setUserParams] = useState<IUserParams>({ state: 'ADMIN' });

  const doGetCompanies: GetCompaniesProc = useCallback(async (userName: string) => {
    setUserParams({ state: 'RECIEVING_COMPANIES' });

   console.log('doGetCompanies');

    try {
      const resFetch = await fetch(`http://localhost:3649/api/organisation/byUser?idUser=${userName}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      const res = await resFetch.json();

      let newState: IUserParams;
      if (res.status === 200) {
        newState = {
          state: 'RECEIVED_COMPANIES',
          companies: res.result?.map((org: any) => ({companyName: org.title, userRole: org.userRole}) )
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

  const doEditUser: EditUserProc = useCallback(async (user: IUser) => {
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

  const doDeleteUser = async (userName: string) => {

    const body = JSON.stringify({
      userName: userName
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

  return [userParams, doGetCompanies, doEditUser, doDeleteUser];
};