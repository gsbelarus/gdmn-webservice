import React, { useState } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
import { IUserParams } from './SignInBox';

export interface IAdminBoxProps {
  userParams: IUserParams;
  onSaveProfile: (userParams: IUserParams) => void;
}

export const Profile = (props: IAdminBoxProps) => {
  const {onSaveProfile, userParams: userParams} = props;
  const [ userName, setUserName ] = useState(userParams.name);
  const [ fullName, setFullName ] = useState(userParams.fullName);
  const [ phone, setPhone ] = useState(userParams.phone);

  return (
    <div>
      <Stack >
        <TextField
          label="Пользователь:"
          value={userName}
          onChange={ (_, userName) => setUserName(userName ? userName : '') }
        />
        <TextField
          label="ФИО:"
          value={fullName}
          onChange={ (_, fullName) => setFullName(fullName) }
        />
        <TextField
          label="Номер телефона:"
          value={phone}
          onChange={ (_, phone) => setPhone(phone) }
        />
        <PrimaryButton
          text="Сохранить"
          style={{marginTop: '8px', float: 'right'}}
          disabled={!userName
            || JSON.stringify({name: userParams.name, fullName: userParams.fullName, phone: userParams.phone}) === JSON.stringify({name: userName, fullName, phone})}
          onClick={() => {
            onSaveProfile({ name: userName, fullName, phone });
          }}
        />
      </Stack>
    </div>
  )
}