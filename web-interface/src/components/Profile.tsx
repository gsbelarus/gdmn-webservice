import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import { IUser, IUserCompany, IDevice } from '../types';
import { User } from './User';
import { CompanyList } from './CompanyList';
import { DeviceList } from './DeviceList';

export interface IProfileProps {
  user: IUser;
  companies?: IUserCompany[];
  devices?: IDevice[];
  isEditOK?: boolean;
  onClearEditOK?: () => void;
  onEditProfile: (user: IUser) => void;
  onClearError: () => void;
  onRemoveDevices?: (uIds: string[]) => void;
  onBlockDevices?:  (uIds: string[]) => void;
  isCanEditUser?: boolean;
}

export const Profile = ({ onEditProfile, user, companies, onClearError, isEditOK, devices, isCanEditUser, onRemoveDevices, onBlockDevices }: IProfileProps) => {
  return (
    <Stack horizontalAlign='center'>
      <User
        key={user.userId}
        isEditOK={isEditOK}
        user={user}
        onEditProfile={onEditProfile}
        onClearError={onClearError}
        isCanEditUser={isCanEditUser}
      />
      <Stack horizontalAlign='start'>
        {
          !!companies?.length   &&
          <CompanyList
            companies={companies}
          />
        }
        {
          !!devices?.length  &&
          <DeviceList
            devices={devices}
            onBlockDevices={onBlockDevices}
            onRemoveDevices={onRemoveDevices}
            onClearError={onClearError}
          />
        }
      </Stack>
    </Stack>
  )
}