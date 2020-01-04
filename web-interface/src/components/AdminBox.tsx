 import React from 'react';
import { Stack, IColumn, DetailsList, SelectionMode, Text, Link } from 'office-ui-fabric-react';
import { IItem, IUserCompany } from '../types';

export interface IAdminProps {
  companies: IUserCompany[];
  onCreateCompany: () => void;
  onSelectCompany: (companyName: string) => void;
  onClearError: () => void;
}

export const AdminBox = ({companies, onCreateCompany, onClearError, onSelectCompany}: IAdminProps) => {

  const items: IItem[] = companies.map(c => ({key: c.companyName, name: c.companyName}));
  const columns: IColumn[] = [{
    key: 'companyName',
    name: 'Мои организации:',
    minWidth: 300,
    fieldName: 'name',
    onRender: item => (
      <Link key={item.key} onClick={() => onSelectCompany(item.name)}>
        {item.name}
      </Link>
  )}];

  return (
    <Stack horizontalAlign='center'>
      <DetailsList
        items={items}
        columns={columns}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />
    </Stack>
  )
}