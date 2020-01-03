import React, { useState, useEffect } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
import { IUser } from '../types';

export interface IProfileProps {
  user: IUser;
  isEditOK?: boolean;
  onClearEditOK: () => void;
  onEditProfile: (user: IUser) => void;
  onClearError: () => void;
}

export const Profile = ({ onEditProfile, user, onClearError, isEditOK, onClearEditOK }: IProfileProps) => {
  const [state, setState] = useState<IUser>(user);

  useEffect(() => {
    if (isEditOK)
      onClearEditOK()
  }, [state, isEditOK, onClearEditOK])

  return (
    <Stack horizontalAlign='center'>
      { isEditOK &&
        <div>
          Данные успешно сохранены!
        </div>
      }
      <div style={{width: '30vh', padding: '10px'}}>
        <TextField
          disabled={true}
          label="Пользователь:"
          value={state.userName}
          onChange={ (_, login) => setState({...state, userName: login ? login : ''}) }
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
            disabled={!state.userName || (((user.firstName || '') === (state.firstName || ''))
              && ((user.lastName || '') === (state.lastName || '')) && ((user.numberPhone || '') === (state.numberPhone || '')) )}
            onClick={() => {
              onClearError();
              onEditProfile(state);
            }}
          />
        </div>
      </div>
    </Stack>
  )
}