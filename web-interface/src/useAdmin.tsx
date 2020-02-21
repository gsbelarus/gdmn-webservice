import { useState } from "react";
import { IUser, IUserCompany, IDevice } from "./types";

export type AdminState = 'RECEIVED_USERS' | 'RECIEVING_USERS' | 'ADMIN' | 'RECEIVED_USERS_BY_COMPANY' | 'RECEIVING_USERS_BY_COMPANY' | 'RECEIVED_COMPANY' | 'RECEIVING_COMPANY'
  | 'CREATING_CODE' | 'CREATED_CODE' | 'CREATING_USER' | 'CREATED_USER'  | 'RECEIVED_DEVICES_BY_USER' | 'RECEIVING_DEVICES_BY_USER' | 'ADDING_USER' | 'ADDED_USER'
  | 'REMOVING_USERS' | 'REMOVED_USERS' | 'REMOVING_USERS_FROM_COMPANY' | 'REMOVED_USERS_FROM_COMPANY';

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
export type AddUserProc = (userId: string, companyId: string) => Promise<IAdmin>;
export type GetDevicesByUserProc = (userId: string) => Promise<IAdmin>;
export type RemoveUsersProc = (userIds: string[]) => Promise<IAdmin>;
export type RemoveUsersFromCompanyProc = (userIds: string[], companyId: string) => Promise<IAdmin>;

export const useAdmin = (): [IAdmin, GetUsersProc, GetUsersByCompanyProc, GetCompanyProc, CreateCodeProc, CreateUserProc, AddUserProc, GetDevicesByUserProc, RemoveUsersProc, RemoveUsersFromCompanyProc] => {
  const [admin, setAdmin] = useState<IAdmin>({ adminState: 'ADMIN' });

  const doGetUsers: GetUsersProc = async () => {
    setAdmin({ adminState: 'RECIEVING_USERS' });
   console.log('doGetUsers');

    try {
      const resFetch = await fetch("http://localhost:3649/api/user/all", { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      let newState: IAdmin;
      if (res.status === 200) {
        newState = {
          adminState: 'RECEIVED_USERS',
          users: res.result.map((r: any) => ({userId: r.id, userName: r.userName}))
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
      const resFetch = await fetch(`http://localhost:3649/api/user/byCompany?companyId=${companyId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();

      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'RECEIVED_USERS_BY_COMPANY',
          users: res.result.map((r: any) =>
          ({userId: r.id, userName: r.userName, lastName: r.lastName, firstName: r.firstName, phoneNumber: r.phoneNumber, password: r.password}))
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
      const resFetch = await fetch(`http://localhost:3649/api/device/byUser?userId=${userId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
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
      const resFetch = await fetch(`http://localhost:3649/api/company/profile?companyId=${companyId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
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
      id: user.id,
      userName: user.userName,
      password: user.password,
      lastName: user.lastName,
      firstName: user.firstName,
      phoneNumber: user.phoneNumber,
      companies: [companyId]
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

  const doAddUser: AddUserProc = async (userId: string, companyId: string) => {
    setAdmin({adminState: 'ADDING_USER'});
    console.log('doAddUser');

    const body = JSON.stringify({
      companyId: companyId,
      userId: userId
    });

    try {
      const resFetch = await fetch("http://localhost:3649/api/user/addCompany", { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body });

      const res = await resFetch.json();
      console.log(res);
      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'ADDED_USER',
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

  const doRemoveUsers: RemoveUsersProc = async (userIds: string[]) => {
    setAdmin({adminState: 'REMOVING_USERS'});
    console.log('doRemoveUsers');

    const body = JSON.stringify({
      users: userIds
    });

    try {
      const resFetch = await fetch("http://localhost:3649/api/user/removeUsers", { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body });

      const res = await resFetch.json();
      console.log(res);
      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'REMOVED_USERS'
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

  const doRemoveUsersFromCompany: RemoveUsersFromCompanyProc = async (userIds: string[], companyId: string) => {
    setAdmin({adminState: 'REMOVING_USERS_FROM_COMPANY'});
    console.log('doRemoveUsersFromCompany');

    const body = JSON.stringify({
      users: userIds,
      companyId: companyId
    });
    console.log(body);
    try {
      const resFetch = await fetch("http://localhost:3649/api/user/removeUsersFromCompany", { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body });

      const res = await resFetch.json();
      console.log(res);
      let newState: IAdmin;
      if (res.status === 200) {
         newState = {
          adminState: 'REMOVED_USERS_FROM_COMPANY'
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

  return [admin, doGetUsers, doGetUsersByCompany, doGetCompany, doCreateCode, doCreateUser, doAddUser, doGetDevicesByUser, doRemoveUsers, doRemoveUsersFromCompany];
};