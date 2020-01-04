 import React from 'react';
import { Stack } from 'office-ui-fabric-react';

export interface IAdminProps {
  companies: string[];
  onCreateCompany: () => void;
  onSelectCompany: (companyName: string) => void;
  onClearError: () => void;
}

export interface IParamsField {
  key: string;
  name: string;
  fieldname: string;
}

export const AdminBox = ({companies, onCreateCompany, onClearError, onSelectCompany}: IAdminProps) => {

  return (
    <div>
      <Stack horizontalAlign='center'>
        <div style={{width: '80vh', padding: '10px'}}>
          <Stack.Item styles={{root: {fontWeight: 'bold', fontSize: '18px', marginBottom: '10px'}}}>
            Мои организации:
          </Stack.Item>
          {companies.map((comp, xid) => {
            return (
              <Stack.Item key={xid} styles={{root: {width: '80vh', fontSize: '16px', height: '40px', borderBottom: '1px solid rgb(218, 220, 224)', borderTop: '1px solid rgb(218, 220, 224)'}}}>
                <span style={{color: 'blue', textDecoration: 'underline'}}
                  onClick={ () => onSelectCompany(comp) }>
                  {comp}
                </span>
              </Stack.Item>)
            })
          }
        </div>
      </Stack>
    </div>
  )
}