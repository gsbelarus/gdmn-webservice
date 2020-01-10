import React, { useState, useEffect } from 'react';
import { PrimaryButton, Stack, TextField, Text } from 'office-ui-fabric-react';
import { IUser } from '../types';

export interface ICompanyProps {
  user?: IUser;
  isEditOK?: boolean;
  onClearEditOK?: () => void;
  onEditProfile: (user: IUser) => void;
  onClearError: () => void;
}

export const User = ({ onEditProfile, user, onClearError, isEditOK, onClearEditOK }: ICompanyProps) => {
  const [state, setState] = useState<IUser>(user || {userName: ''});
  const [repeatPassword, setRepeatPassword] = useState();

  useEffect(() => {
    if (isEditOK && onClearEditOK) {
      onClearEditOK();
    }
  }, [state, isEditOK, onClearEditOK])

  return (
    <Stack horizontalAlign='center' >
      { isEditOK &&
        <Text>
          Данные успешно сохранены!
        </Text>
      }
      <Stack.Item>
        <TextField
          disabled={!!user}
          label="Пользователь:"
          value={state?.userName}
          onChange={ (_, login) => setState({...state, userName: login || ''}) }
        />
        <TextField
          label="Имя:"
          value={state?.firstName}
          onChange={ (_, firstName) => setState( {...state, firstName}) }
        />
        <TextField
          label="Фамилия:"
          value={state.lastName}
          onChange={ (_, lastName) => setState({...state, lastName}) }
        />
        <TextField
          label="Номер телефона:"
          value={state.phoneNumber}
          onChange={ (_, phoneNumber) => setState({...state, phoneNumber}) }
        />
          <TextField
            label="Пароль:"
            value={state.password}
            onChange={ (_, password) => setState({...state, password}) }
          />
          <TextField
            label="Повторите пароль:"
            value={repeatPassword}
            onChange={ (_, repeatPassword) => setRepeatPassword(repeatPassword) }
          />
        <div className="">
          <PrimaryButton
            text="Сохранить"
            style={{marginTop: '10px', float: 'right'}}
            disabled={!state.userName || (((user?.firstName || '') === (state.firstName || ''))
              && ((user?.lastName || '') === (state.lastName || '')) && ((user?.phoneNumber || '') === (state.phoneNumber || ''))
              && ((repeatPassword || '') !== (state.password || '')))}
            onClick={() => {
              onClearError();
              onEditProfile(state);
            }}
          />
        </div>
      </Stack.Item>
    </Stack>
  )}

