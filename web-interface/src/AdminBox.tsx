import React from 'react';
import { Stack } from 'office-ui-fabric-react';
import { IUserParams } from './LoginPage';

export interface IAdminProps {
  userParams: IUserParams;
}

export const AdminBox = (props: IAdminProps) => {
  return (
    <div>
      <Stack horizontalAlign='center' >
        <div style={{width: '30vh', padding: '10px'}} >
          Организации
        </div>
      </Stack>
    </div>
  )
}