import React from 'react';
import { Stack, IColumn, DetailsList, SelectionMode } from 'office-ui-fabric-react';
import { IUser, IUserCompany, IItem, IDevice } from '../types';
import { User } from './User';

export interface IProfileProps {
  user: IUser;
  companies?: IUserCompany[];
  devices?: IDevice[];
  isEditOK?: boolean;
  onClearEditOK?: () => void;
  onEditProfile: (user: IUser) => void;
  onClearError: () => void;
}

export const Profile = ({ onEditProfile, user, companies, onClearError, isEditOK, devices }: IProfileProps) => {

  const companyItems: IItem[] = companies?.map(c => ({key: c.companyName, name: c.companyName})) || [];
  const companyColumns: IColumn[] = [{
    key: 'companyName',
    name: 'Организации пользователя',
    minWidth: 300,
    fieldName: 'name',
  }];

  const deviceItems: IItem[] = devices?.map(d => ({key: d.uid, name: d.uid, state: d.state})) || [];
  const deviceColumns: IColumn[] = [{
    key: 'deviceName',
    name: 'Наименование устройств',
    minWidth: 300,
    fieldName: 'name',
  },
  {
    key: 'deviceStatus',
    name: 'Статус',
    minWidth: 100,
    fieldName: 'state',
  }];

  return (
    <Stack horizontalAlign='center'>
      <User
        key={user.userId}
        isEditOK={isEditOK}
        user={user}
        onEditProfile={onEditProfile}
        onClearError={onClearError}
      />
      <Stack horizontalAlign='center'>
        <DetailsList
          items={companyItems}
          columns={companyColumns}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
        />
        <DetailsList
          items={deviceItems}
          columns={deviceColumns}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
        />
      </Stack>
    </Stack>
  )
}