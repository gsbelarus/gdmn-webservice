import React from 'react';
import { Stack, DetailsList, IColumn, SelectionMode, Link } from 'office-ui-fabric-react';
import { IUser, IItem } from '../types';
import { Company } from './Company';

export interface ICompanyProps {
  companyName: string;
  companyId: string;
  users?: IUser[];
  allUsers?: IUser[];
  onUpdateCompany: (companyId: string, companyName: string) => void;
  onGetAllUsers: () => void;
  onClearError: () => void;
  onSelectUser: (userId: string) => void;
}

export const CompanyBox = ({ onUpdateCompany, companyName, companyId, users, onClearError, onSelectUser }: ICompanyProps) => {

  const items: IItem[] = users?.map(u => ({key: u.userName, name: u.userName})) || [];
  const columns: IColumn[] = [{
    key: 'userName',
    name: 'Пользователи:',
    minWidth: 210,
    fieldName: 'name',
    onRender: item => (
      <Link key={item.key} onClick={() => onSelectUser(item.key)}>
        {item.name}
      </Link>
  )}];

  return (
    <Stack horizontalAlign='center' >
      <Company
        companyName={companyName}
        onClearError={onClearError}
        onEditCompany={(newCompanyName) => onUpdateCompany(companyId, newCompanyName)}
      />
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