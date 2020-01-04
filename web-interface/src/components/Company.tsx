import React, { useState } from 'react';
import { PrimaryButton, Stack, TextField, Text, DetailsList, IColumn, SelectionMode, Link } from 'office-ui-fabric-react';
import { IUser, IUserCompany, IItem } from '../types';

export interface ICompanyProps {
  isCreate?: boolean;
  company?: IUserCompany;
  users?: IUser[];
  onCreateCompany: (name: string) => void;
  onUpdateCompany: (id: number, name: string) => void;
  onGetAllUsers: () => void;
}

export const Company = ({ onCreateCompany, onUpdateCompany, company, isCreate, users }: ICompanyProps) => {
  const [name, setName] = useState(company?.companyName);

  const items: IItem[] = users?.map(u => ({key: u.userName, name: u.userName})) || [];
  const columns: IColumn[] = [{
    key: 'userName',
    name: 'Пользователи:',
    minWidth: 210,
    fieldName: 'name',
    onRender: item => (
      <Link key={item.key} onClick={() => alert(`Item invoked: ${item.name}`)}>
        {item.name}
      </Link>
  )}];

  console.log(items);

  return (
    <Stack horizontalAlign='center' >
        <Stack.Item>
          <TextField
            label="Наименование организации:"
            value={company?.companyName}
            onChange={ (_, name) => setName(name ? name : '') }
          />
          <div className="">
            <PrimaryButton
              text="Сохранить"
              style={{marginTop: '10px', float: 'right'}}
              disabled={!name
                || name === company?.companyName}
              onClick={() => {
                if (name) {
                  if (isCreate)
                    onCreateCompany(name)
                  else
                    company?.companyId && onUpdateCompany(company?.companyId, name);
                }
              }}
            />
          </div>
        </Stack.Item>
        <Stack.Item>
          <DetailsList
            items={items}
            columns={columns}
            selectionMode={SelectionMode.none}
            isHeaderVisible={true}
          />
        </Stack.Item>
    </Stack>
  )
}