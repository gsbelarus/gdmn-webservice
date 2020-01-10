import { useState } from "react";
import { IUser, IUserCompany, IDevice } from "./types";

export type AdminState = 'RECEIVED_USERS' | 'RECIEVING_USERS' | 'ADMIN' | 'RECEIVED_USERS_BY_COMPANY' | 'RECEIVING_USERS_BY_COMPANY' | 'RECEIVED_COMPANY' | 'RECEIVING_COMPANY'
  | 'CREATING_CODE' | 'CREATED_CODE' | 'CREATING_USER' | 'CREATED_USER'  | 'RECEIVED_DEVICES_BY_USER' | 'RECEIVING_DEVICES_BY_USER';

export interface IAdmin {
  adminState: AdminState;
  users?: IUser[];
  company?: IUserCompany;
  code?: string;
  devices?: IDevice[];
  errorMessage?: string;
};

export type GetUsersProc = () => Promise<IAdmin>;
export type GetUsersByCompanyProc = (companyId: string) => Promise<IAdmin>;
export type GetCompanyProc = (companyId: string) => Promise<IAdmin>;
export type CreateCodeProc = (userID: string) => Promise<IAdmin>;
export type CreateUserProc = (user: IUser, companyId: string) => Promise<IAdmin>;
export type GetDevicesByUserProc = (userId: string) => Promise<IAdmin>;

//export type DeleteUserProc = (userName: string) => Promise<IAdmin>;

export const useAdmin = (): [IAdmin, GetUsersProc, GetUsersByCompanyProc, GetCompanyProc, CreateCodeProc, CreateUserProc, GetDevicesByUserProc] => {
  const [admin, setAdmin] = useState<IAdmin>({ adminState: 'ADMIN' });

  const doGetUsers: GetUsersProc = async () => {
    setAdmin({ adminState: 'RECIEVING_USERS' });
   console.log('doGetCompanies');

    try {
      const resFetch = await fetch("http://localhost:3649/api/user/all", { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      let newState: IAdmin;
      if (res.status === 200) {
        newState = {
          adminState: 'RECEIVED_USERS',
          users: res.result
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

  const doGetUsersByCompany: GetUsersByCompanyProc = async (companyId: string) => {
    setAdmin({adminState: 'RECEIVING_USERS_BY_COMPANY'});
    console.log('doGetUsersByCompany');

    try {
      const resFetch = await fetch(`http://localhost:3649/api/user/byOrganisation?idOrganisation=${companyId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();

      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'RECEIVED_USERS_BY_COMPANY',
          users: res.result.map((r: any) => ({userId: r.id, userName: r.userName, lastName: r.lastName, firstName: r.firstName, phoneNumber: r.phoneNumber, password: r.password}))
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

  const doGetDevicesByUser: GetDevicesByUserProc = async (userId: string) => {
    setAdmin({adminState: 'RECEIVING_DEVICES_BY_USER'});
    console.log('doGetDevicesByUser');

    try {
      const resFetch = await fetch(`http://localhost:3649/api/device/byUser?idUser=${userId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      console.log(res);
      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'RECEIVED_DEVICES_BY_USER',
          devices: res.result
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

  const doGetCompany: GetCompanyProc = async (companyId: string) => {
    setAdmin({adminState: 'RECEIVING_COMPANY'});
    console.log('doGetCompany');

    try {
      const resFetch = await fetch(`http://localhost:3649/api/organisation/profile?idOrganisation=${companyId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      let newState: IAdmin;
      console.log(res.result);
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

  const doCreateCode: CreateCodeProc = async (userId: string) => {
    setAdmin({adminState: 'CREATING_CODE'});
    console.log('doCreateCode');

    try {
      const resFetch = await fetch(`http://localhost:3649/api/device/getActivationCode?user=${userId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      console.log(res);
      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'CREATED_CODE',
          code: res.result
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

  const doCreateUser: CreateUserProc = async (user: IUser, companyId: string) => {
    setAdmin({adminState: 'CREATING_USER'});
    console.log('doCreateUser');

    const body = JSON.stringify({
      id: user.userId,
      userName: user.userName,
      password: user.password,
      lastName: user.lastName,
      firstName: user.firstName,
      phoneNumber: user.phoneNumber,
      organisations: [companyId]
    });

    try {
      const resFetch = await fetch("http://localhost:3649/api/signup", { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body });

      const res = await resFetch.json();
      console.log(res);
      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'CREATED_USER',
          code: res.result
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

  return [admin, doGetUsers, doGetUsersByCompany, doGetCompany, doCreateCode, doCreateUser, doGetDevicesByUser];
};