import { useState } from "react";

export type CompanyState = 'CREATED' | 'CREATING' | 'UPDATED' | 'UPDATING' | 'DELETED' | 'DELETING' | 'ADMIN';

export interface ICompany {
  companyState: CompanyState;
  companyName?: string;
  errorMessage?: string;
};

export type CreateCompanyProc = (companyName: string) => Promise<ICompany>;
export type UpdateCompanyProc = (companyName: string) => Promise<ICompany>;
export type DeleteCompanyProc = (companyName: string) => Promise<ICompany>;

export const useCompany = (companyName?: string): [ICompany, CreateCompanyProc, UpdateCompanyProc, DeleteCompanyProc] => {
  const [company, setCompany] = useState<ICompany>({ companyState: 'DELETED', companyName });

  const doCreateCompany: CreateCompanyProc = async (companyName: string) => {
    setCompany({ companyState: 'CREATING', companyName });
    console.log('doCreate');
    try {
      const resFetch = await fetch(`http://localhost:3649/api/organisation/new?title=${companyName}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      let newState: ICompany;
      console.log(res);
      if (res.status === 200) {
        newState = {
          companyState: 'CREATED'
        };
      }
      else {
        newState = {
          companyState: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setCompany(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: ICompany = {
        companyState: 'ADMIN',
        errorMessage: err
      };
      setCompany(newStateErr);
      return newStateErr;
    }

  };

  const doUpdateCompany: UpdateCompanyProc = async (companyName: string) => {
    setCompany({companyState: 'UPDATING'});
    console.log('doUpdate');

    const body = JSON.stringify({
      title: companyName
    });

    try {
      const resFetch = await fetch("http://localhost:3649/api/organisation/editeProfile", { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body });
      const res = await resFetch.json();
      let newState: ICompany;
      if (res.status === 200) {
        newState = {
          companyState: 'UPDATED'
        };
      }
      else {
        newState = {
          companyState: 'ADMIN',
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setCompany(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: ICompany = {
        companyState: 'ADMIN',
        errorMessage: err
      };
      setCompany(newStateErr);
      return newStateErr;
    }
  };

  const doDeleteCompany = async (companyName: string) => {

    const body = JSON.stringify({
      title: companyName
    });

    setCompany({companyState: 'DELETING', companyName});
    console.log('doDelete');

    try {
      const resFetch = await fetch("http://localhost:3649/api/", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      const res = await resFetch.json();
      let newState: ICompany;
      if (res.status === 200) {
        newState = {
          companyState: 'DELETED',
        };
      }
      else {
        newState = {
          companyState: 'ADMIN',
        };
      }
      setCompany(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: ICompany = {
        companyState: 'ADMIN'
      };
      setCompany(newStateErr);
      return newStateErr;
    }
  };

  return [company, doCreateCompany, doUpdateCompany, doDeleteCompany];
};