import { useState } from "react";

export type CompanyState = 'CREATED' | 'CREATING' | 'EDITED' | 'EDITING' | 'DELETED' | 'DELETING' | 'ADMIN';

export interface ICompany {
  companyState: CompanyState;
  companyName?: string;
  errorMessage?: string;
};

export type CreateCompanyProc = (CompanyName: string) => Promise<ICompany>;
export type EditCompanyProc = (CompanyName: string) => Promise<ICompany>;
export type DeleteCompanyProc = (CompanyName: string) => Promise<ICompany>;

export const useCompany = (companyName?: string): [ICompany, CreateCompanyProc, EditCompanyProc, DeleteCompanyProc] => {
  const [company, setCompany] = useState<ICompany>({ companyState: 'DELETED', companyName });

  const doCreateCompany: CreateCompanyProc = (CompanyName: string) => {
    setCompany({ companyState: 'CREATING', companyName });
    console.log('doCreate');

    const body = JSON.stringify({
      title: CompanyName
    });

    return fetch("http://localhost:3649/api/organisation/new", {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body})
    .then ( res => res.json() )
    .then ( res => {
      let newState: ICompany;
      console.log(res);
      if (res.status === 200) {
        newState = {
          companyState: 'CREATED'
        };
       } else {
        newState = {
          companyState: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }

      setCompany(newState);
      return newState;
    })
    .catch( err => {
      const newState: ICompany = {
        companyState: 'ADMIN',
        errorMessage: err
      };

      setCompany(newState);
      return newState;
    });

  };

  const doEditCompany: EditCompanyProc = (CompanyName: string) => {
    setCompany({companyState: 'EDITING'});
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
            companyState: 'EDITED'
          };
         } else {
          newState = {
            companyState: 'ADMIN',
            errorMessage: `${res.status} - ${res.result}`
          };
        }

        setCompany(newState);
        return newState;
      })
      .catch( err => {
        const newState: ICompany = {
          companyState: 'ADMIN',
          errorMessage: err
        };

        setCompany(newState);
        return newState;
      });
  };

  const doDeleteCompany = (CompanyName: string) => {

    const body = JSON.stringify({
      title: companyName
    });

    setCompany({companyState: 'DELETING', companyName});
    console.log('doDelete');

    return fetch("http://localhost:3649/api/", {method: 'POST', headers: {'Content-Type': 'application/json'}, body})
      .then ( res => res.json() )
      .then ( res => {
        let newState: ICompany;

        if (res.status === 200) {
          newState = {
            companyState: 'DELETED',
          };
         } else {
          newState = {
            companyState: 'ADMIN',
          };
        }

        setCompany(newState);
        return newState;
      })
      .catch( err => {
        const newState: ICompany = {
          companyState: 'ADMIN'
        };

        setCompany(newState);
        return newState;
      });
  };

  return [company, doCreateCompany, doEditCompany, doDeleteCompany];
};