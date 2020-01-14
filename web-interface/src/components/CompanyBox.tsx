import React, { useRef, useState, useEffect } from 'react';
import { Stack, DetailsList, IColumn, SelectionMode, Link, CheckboxVisibility, PrimaryButton, Selection } from 'office-ui-fabric-react';
import { IUser, IItem } from '../types';
import { Company } from './Company';

export interface ICompanyProps {
  companyName: string;
  companyId: string;
  users?: IUser[];
  allUsers?: IUser[];
  onUpdateCompany: (companyId: string, companyName: string) => void;
  onClearError: () => void;
  onSelectUser: (userId: string) => void;
  onRemoveUsersFromCompany?: (usersId: string[]) => void;
}

export const CompanyBox = ({ onUpdateCompany, companyName, companyId, users, onClearError, onSelectUser, onRemoveUsersFromCompany }: ICompanyProps) => {

  const [selectedItems, setSelectedItems] = useState([] as string[]);
  const selection = useRef(new Selection({
    onSelectionChanged: () => {
      console.log(selection.current);
      const newSelection = selection.current.getSelection().map( s => s.key ).filter( s => typeof s === 'string' ) as typeof selectedItems;
      setSelectedItems(newSelection);
    }
  }));

  console.log(selectedItems);

  const items: IItem[] = users?.map(u => ({key: u.userName, name: u.userName, status: u.isAdmin ? 'Администратор' : ''})) || [];
  const columns: IColumn[] = [{
    key: 'userName',
    name: 'Пользователь',
    minWidth: 210,
    fieldName: 'name',
    onRender: item => (
      <Link key={item.key} onClick={() => onSelectUser(item.key)}>
        {item.name}
      </Link>
    )
  },
  {
    key: 'userStatus',
    name: 'Статус',
    minWidth: 100,
    fieldName: 'status'
  }];

  return (
    <Stack horizontalAlign='center'>
      <Company
        companyName={companyName}
        onClearError={onClearError}
        onUpdateCompany={(newCompanyName) => onUpdateCompany(companyId, newCompanyName)}
      />
      <Stack.Item>
        <DetailsList
          items={items}
          columns={columns}
          isHeaderVisible={true}
          checkboxVisibility={CheckboxVisibility.onHover}
          data-is-scrollable="true"
          selectionMode={SelectionMode.multiple}
          selection={selection.current}
          setKey="set"
        />
        {selectedItems.length > 0 && onRemoveUsersFromCompany &&
          <PrimaryButton
            text="Удалить"
            style={{marginTop: '10px', float: 'right'}}
            disabled={false}
            onClick={() => {
              onClearError();
              onRemoveUsersFromCompany(selectedItems);
              setSelectedItems([]);
            }}
          />
        }
      </Stack.Item>
    </Stack>
  )
}