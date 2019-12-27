import { useState } from "react";

export type CompanyState = 'CREATED' | 'CREATING' | 'EDITED' | 'EDITING' | 'DELETED' | 'DELETING' | 'ADMIN';

export interface ICompany {
  CompanyState: CompanyState;
  CompanyName?: string;
  errorMessage?: string;
};

export type CreateCompanyProc = (CompanyName: string) => Promise<ICompany>;
export type EditCompanyProc = (CompanyName: string) => Promise<ICompany>;
export type DeleteCompanyProc = (CompanyName: string) => Promise<ICompany>;

export const useCompany = (CompanyName?: string): [ICompany, CreateCompanyProc, EditCompanyProc, DeleteCompanyProc] => {
  const [company, setCompany] = useState<ICompany>({ CompanyState: 'DELETED', CompanyName });

  const doCreateCompany: CreateCompanyProc = (CompanyName: string) => {
    setCompany({ CompanyState: 'CREATING', CompanyName });
    console.log('doCreate');

    const body = JSON.stringify({
      title: CompanyName
    });

    return fetch("http://localhost:3649/api/organisation/new", {method: 'POST', headers: {'Content-Type': 'application/json'}, body})
    .then ( res => res.json() )
    .then ( res => {
      let newState: ICompany;

      if (res.status === 200) {
        newState = {
          CompanyState: 'CREATED'
        };
       } else {
        newState = {
          CompanyState: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }

      setCompany(newState);
      return newState;
    })
    .catch( err => {
      const newState: ICompany = {
        CompanyState: 'ADMIN',
        errorMessage: err
      };

      setCompany(newState);
      return newState;
    });

  };

  const doEditCompany: EditCompanyProc = (CompanyName: string) => {
    setCompany({CompanyState: 'EDITING'});
    console.log('doEdit');

    const body = JSON.stringify({
      title: CompanyName
    });

    return fetch("http://localhost:3649/api/organisation/editeProfile", {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body})
      .then ( res => res.json() )
      .then ( res => {
        let newState: ICompany;

        if (res.status === 200) {
          newState = {
            CompanyState: 'EDITED'
          };
         } else {
          newState = {
            CompanyState: 'ADMIN',
            errorMessage: `${res.status} - ${res.result}`
          };
        }

        setCompany(newState);
        return newState;
      })
      .catch( err => {
        const newState: ICompany = {
          CompanyState: 'ADMIN',
          errorMessage: err
        };

        setCompany(newState);
        return newState;
      });
  };

  const doDeleteCompany = (CompanyName: string) => {

    const body = JSON.stringify({
      title: CompanyName
    });

    setCompany({CompanyState: 'DELETING', CompanyName});
    console.log('doDelete');

    return fetch("http://localhost:3649/api/", {method: 'POST', headers: {'Content-Type': 'application/json'}, body})
      .then ( res => res.json() )
      .then ( res => {
        let newState: ICompany;

        if (res.status === 200) {
          newState = {
            CompanyState: 'DELETED',
          };
         } else {
          newState = {
            CompanyState: 'ADMIN',
          };
        }

        setCompany(newState);
        return newState;
      })
      .catch( err => {
        const newState: ICompany = {
          CompanyState: 'ADMIN'
        };

        setCompany(newState);
        return newState;
      });
  };

  return [company, doCreateCompany, doEditCompany, doDeleteCompany];
};