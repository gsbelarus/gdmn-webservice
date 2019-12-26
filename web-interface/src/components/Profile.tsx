import React, { useState } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
import { IUser } from '../types';

export interface IProfileProps {
  user: IUser;
  onEditProfile: (userParams: IUser) => void;
}

export const Profile = (props: IProfileProps) => {
  const { onEditProfile, user } = props;
  const [state, setState] = useState<IUser>(user);

  return (
    <Stack horizontalAlign='center'>
      <div style={{width: '30vh', padding: '10px'}}>
        <TextField
          label="Пользователь:"
          value={state.login}
          onChange={ (_, login) => setState({...state, login: login ? login : ''}) }
        />
        <TextField
          label="Имя:"
          value={state.firstName}
          onChange={ (_, firstName) => setState({...state, firstName}) }
        />
        <TextField
          label="Фамилия:"
          value={state.lastName}
          onChange={ (_, lastName) => setState({...state, lastName}) }
        />
        <TextField
          label="Номер телефона:"
          value={state.numberPhone}
          onChange={ (_, numberPhone) => setState({...state, numberPhone}) }
        />
        <div className="">
          <PrimaryButton
            text="Сохранить"
            style={{marginTop: '10px', float: 'right'}}
            disabled={!state.login
              || JSON.stringify(user)
                === JSON.stringify(state)}
            onClick={() => {
              onEditProfile(state);
            }}
          />
        </div>
      </div>
    </Stack>
  )
}