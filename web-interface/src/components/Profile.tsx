import React, { useState, useEffect } from 'react';
import { PrimaryButton, Stack, TextField, IColumn, Link, DetailsList, SelectionMode, Text } from 'office-ui-fabric-react';
import { IUser, IUserCompany, IItem } from '../types';

export interface IProfileProps {
  user: IUser;
  companies?: IUserCompany[];
  isEditOK?: boolean;
  onClearEditOK: () => void;
  onEditProfile: (user: IUser) => void;
  onClearError: () => void;
}

export const Profile = ({ onEditProfile, user, companies, onClearError, isEditOK, onClearEditOK }: IProfileProps) => {
  const [state, setState] = useState<IUser>(user);

  const items: IItem[] = companies?.map(c => ({key: c.companyName, name: c.companyName})) || [];
  const columns: IColumn[] = [{
    key: 'companyName',
    name: 'Мои организации:',
    minWidth: 300,
    fieldName: 'name',
  }];

  useEffect(() => {
    if (isEditOK) {
      onClearEditOK();
    }
  }, [state])

  return (
    <Stack horizontalAlign='center'>
      { isEditOK &&
        <Text>
          Данные успешно сохранены!
        </Text>
      }
      <Stack.Item>
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
      </Stack.Item>
      <Stack horizontalAlign='center'>
        <DetailsList
          items={items}
          columns={columns}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
        />
      </Stack>
    </Stack>
  )
}