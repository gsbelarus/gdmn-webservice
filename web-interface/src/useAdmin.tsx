import { useState } from "react";
import { IUser, IUserCompany } from "./types";

export type AdminState = 'RECEIVED_USERS' | 'RECIEVING_USERS' | 'ADMIN' | 'RECEIVED_USERS_BY_COMPANY' | 'RECEIVING_USERS_BY_COMPANY' | 'RECEIVED_COMPANY' | 'RECEIVING_COMPANY';

export interface IAdmin {
  adminState: AdminState;
  users?: IUser[];
  company?: IUserCompany;
  errorMessage?: string;
};

export type GetUsersProc = () => Promise<IAdmin>;
export type GetUsersByCompanyProc = (companyName: string) => Promise<IAdmin>;
export type GetCompanyProc = (companyName: string) => Promise<IAdmin>;

//export type DeleteUserProc = (userName: string) => Promise<IAdmin>;

export const useAdmin = (): [IAdmin, GetUsersProc, GetUsersByCompanyProc, GetCompanyProc] => {
  const [admin, setAdmin] = useState<IAdmin>({ adminState: 'ADMIN' });

  const doGetUsers: GetUsersProc = async () => {
    setAdmin({ adminState: 'RECIEVING_USERS' });
   console.log('doGetCompanies');

    try {
      const resFetch = await fetch("http://localhost:3649/api/user/getUsers", { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      let newState: IAdmin;
      if (res.status === 200) {
        newState = {
          adminState: 'RECEIVED_USERS',
          users: res.body.map((u: IUser) => { return { userName: u.userName, password: '123' }; })
        };
      }
      else {
        newState = {
          adminState: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setAdmin(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: IAdmin = {
        adminState: 'ADMIN',
        errorMessage: err
      };
      setAdmin(newStateErr);
      return newStateErr;
    }

  };

  const doGetUsersByCompany: GetUsersByCompanyProc = async (companyName: string) => {
    setAdmin({adminState: 'RECEIVING_USERS_BY_COMPANY'});
    console.log('doGetUsersByCompany');

    try {
      const resFetch = await fetch(`http://localhost:3649/api/user/byOrganisation?idOrganisation=${companyName}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      console.log(res);
      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'RECEIVED_USERS_BY_COMPANY',
          users: res.result.map((u: any) => {return {userName: u.userName, firstName: u.firstName, lastName: u.lastName, numberPhone: u.phone}})
        };
      }
      else {
        newState = {
          adminState: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setAdmin(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: IAdmin = {
        adminState: 'ADMIN',
        errorMessage: err
      };
      setAdmin(newStateErr);
      return newStateErr;
    }
  };

  const doGetCompany: GetUsersByCompanyProc = async (companyName: string) => {
    setAdmin({adminState: 'RECEIVING_COMPANY'});
    console.log('doGetCompany');
    console.log(companyName);
    try {
      const resFetch = await fetch(`http://localhost:3649/api/organisation/profile?title=${companyName}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      let newState: IAdmin;
      if (res.status === 200) {
        newState = {
          adminState: 'RECEIVED_COMPANY',
          company: {companyId: res.result.id, companyName: res.result.title}
        };
      }
      else {
        newState = {
          adminState: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setAdmin(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: IAdmin = {
        adminState: 'ADMIN',
        errorMessage: err
      };
      setAdmin(newStateErr);
      return newStateErr;
    }
  };

  // const doDeleteUser = (UserName: string) => {

  //   const body = JSON.stringify({
  //     userName: UserName
  //   });

  //   setAdmin({adminState: 'DELETING'});
  //   console.log('doDelete');

  //   return fetch("http://localhost:3649/api/user/", {method: 'POST', headers: {'Content-Type': 'application/json'}, body})
  //     .then ( resFetch => resFetch.json() )
  //     .then ( resFetch => {
  //       let newState: IAdmin;

  //       if (resFetch.status === 200) {
  //         newState = {
  //           adminState: 'DELETED',
  //         };
  //        } else {
  //         newState = {
  //           adminState: 'ADMIN',
  //         };
  //       }

  //       setAdmin(newState);
  //       return newState;
  //     })
  //     .catch( err => {
  //       const newState: IAdmin = {
  //         adminState: 'ADMIN'
  //       };

  //       setAdmin(newState);
  //       return newState;
  //     });
  // };

  return [admin, doGetUsers, doGetUsersByCompany, doGetCompany];
};