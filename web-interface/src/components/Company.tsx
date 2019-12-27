import React, { useState } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';

export interface ICompanyProps {
  isCreate?: boolean;
  companyName?: string;
  users?: string[];
  onCreateCompany: (name: string) => void;
  onEditCompany: (name: string) => void;
}

export const Company = ({ onCreateCompany, onEditCompany, companyName, isCreate, users }: ICompanyProps) => {
  const [name, setName] = useState(companyName);

  return (
    <Stack horizontalAlign='center'>
      <div style={{width: '30vh', padding: '10px'}}>
        <TextField
          label="Наименование организации:"
          value={name}
          onChange={ (_, name) => setName(name ? name : '') }
        />
        <div className="">
          <PrimaryButton
            text="Сохранить"
            style={{marginTop: '10px', float: 'right'}}
            disabled={!name
              || name === companyName}
            onClick={() => {
              if (name) {
                if (isCreate)
                  onCreateCompany(name)
                else
                  onEditCompany(name);
              }
            }}
          />
        </div>
        { users &&
          users.map((user, xid) => {
            return (
              <Stack.Item key={xid} styles={{root: {width: '80vh', fontSize: '16px', height: '40px', borderBottom: '1px solid rgb(218, 220, 224)', borderTop: '1px solid rgb(218, 220, 224)'}}}>
                <span style={{color: 'blue', textDecoration: 'underline'}}
                  onClick={ () => {} }>
                  {user}
                </span>
              </Stack.Item>)
          })
        }
      </div>
    </Stack>
  )
}