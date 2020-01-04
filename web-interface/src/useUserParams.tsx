import { useState } from "react";
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

  const doGetCompanies: GetCompaniesProc = (userName: string) => {
    setUserParams({ state: 'RECIEVING_COMPANIES' });

    // return new Promise(
    //   resolve => {
    //     setTimeout( () => {

    //       const newState: IUserParams = {
    //         state: 'RECEIVED_COMPANIES',
    //         companies: []//[{name: 'Company1', userRole: 'Admin'}, {name: 'Company2'}, {name: 'Company3'}]
    //       };

    //       setUserParams(newState);

    //       resolve(newState);

    //     }, 2000 );
    //   }
    // );


   console.log('doGetCompanies');


    return fetch(`http://localhost:3649/api/organisation/byUser?idUser=${userName}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'})
    .then ( res => res.json() )
    .then ( res => {
      let newState: IUserParams;
      console.log(res);
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
    })
    .catch( err => {
      const newState: IUserParams = {
        state: 'ADMIN',
        errorMessage: err
      };

      setUserParams(newState);
      return newState;
    });

  };

  const doEditUser: EditUserProc = (user: IUser) => {
    setUserParams({state: 'EDITING_USER'});
    console.log('doEdit');

    const body = JSON.stringify(user);

    return fetch("http://localhost:3649/api/user/edite", {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body})
      .then ( res => res.json() )
      .then ( res => {
        let newState: IUserParams;

        if (res.status === 200) {
          newState = {
            state: 'EDITED_USER'
          };
         } else {
          newState = {
            state: 'PROFILE',
            errorMessage: `${res.status} - ${res.result}`
          };
        }

        setUserParams(newState);
        return newState;
      })
      .catch( err => {
        const newState: IUserParams = {
          state: 'PROFILE',
          errorMessage: err
        };

        setUserParams(newState);
        return newState;
      });
  };

  const doDeleteUser = (UserName: string) => {

    const body = JSON.stringify({
      userName: UserName
    });

    setUserParams({state: 'DELETING'});
    console.log('doDelete');

    return fetch("http://localhost:3649/api/user/", {method: 'POST', headers: {'Content-Type': 'application/json'}, body})
      .then ( res => res.json() )
      .then ( res => {
        let newState: IUserParams;

        if (res.status === 200) {
          newState = {
            state: 'DELETED',
          };
         } else {
          newState = {
            state: 'ADMIN',
          };
        }

        setUserParams(newState);
        return newState;
      })
      .catch( err => {
        const newState: IUserParams = {
          state: 'ADMIN'
        };

        setUserParams(newState);
        return newState;
      });
  };

  return [userParams, doGetCompanies, doEditUser, doDeleteUser];
};