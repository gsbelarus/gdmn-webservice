import { useState } from "react";
import { IUser } from "./types";

export type AdminState = 'RECEIVED_USERS' | 'RECIEVING_USERS' | 'ADMIN' | 'RECEIVED_USERS_BY_COMPANY' | 'RECEIVING_USERS_BY_COMPANY';

export interface IAdmin {
  adminState: AdminState;
  users?: IUser[];
  errorMessage?: string;
};

export type GetUsersProc = () => Promise<IAdmin>;
export type GetUsersByCompanyProc = (companyName: string) => Promise<IAdmin>;
//export type DeleteUserProc = (userName: string) => Promise<IAdmin>;

export const useAdmin = (): [IAdmin, GetUsersProc, GetUsersByCompanyProc] => {
  const [admin, setAdmin] = useState<IAdmin>({ adminState: 'ADMIN' });

  const doGetUsers: GetUsersProc = () => {
    setAdmin({ adminState: 'RECIEVING_USERS' });
   console.log('doGetCompanies');

    return fetch("http://localhost:3649/api/user/getUsers", {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'})
    .then ( res => res.json() )
    .then ( res => {
      let newState: IAdmin;

      if (res.status === 200) {
        newState = {
          adminState: 'RECEIVED_USERS',
          users: res.body.map((u: IUser) => {return {userName: u.userName, password: '123' }})
        };
       } else {
        newState = {
          adminState: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }

      setAdmin(newState);
      return newState;
    })
    .catch( err => {
      const newState: IAdmin = {
        adminState: 'ADMIN',
        errorMessage: err
      };

      setAdmin(newState);
      return newState;
    });

  };

  const doGetUsersByCompany: GetUsersByCompanyProc = (companyName: string) => {
    setAdmin({adminState: 'RECEIVING_USERS_BY_COMPANY'});
    console.log('doGetUsersByCompany');

    return fetch(`http://localhost:3649/api/user/byOrganisation?idOrganisation=${companyName}` , {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'})
      .then ( res => res.json() )
      .then ( res => {
        let newState: IAdmin;

        if (res.status === 200) {
          newState = {
            adminState: 'RECEIVED_USERS_BY_COMPANY'
          };
         } else {
          newState = {
            adminState: 'ADMIN',
            errorMessage: `${res.status} - ${res.result}`
          };
        }

        setAdmin(newState);
        return newState;
      })
      .catch( err => {
        const newState: IAdmin = {
          adminState: 'ADMIN',
          errorMessage: err
        };

        setAdmin(newState);
        return newState;
      });
  };

  // const doDeleteUser = (UserName: string) => {

  //   const body = JSON.stringify({
  //     userName: UserName
  //   });

  //   setAdmin({adminState: 'DELETING'});
  //   console.log('doDelete');

  //   return fetch("http://localhost:3649/api/user/", {method: 'POST', headers: {'Content-Type': 'application/json'}, body})
  //     .then ( res => res.json() )
  //     .then ( res => {
  //       let newState: IAdmin;

  //       if (res.status === 200) {
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

  return [admin, doGetUsers, doGetUsersByCompany];
};