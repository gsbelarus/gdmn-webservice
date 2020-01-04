import React, { useState, useEffect } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
import { IUser, IUserCompany } from '../types';

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
        { !!companies?.length &&
          <div style={{width: '80vh', padding: '10px'}}>
            <span style={{width: '100%', float: 'left'}}>
              Мои организации:
            </span>
            {
              companies.map((comp, xid) => {
                return (
                  <span key={xid} style={{width: '100%', float: 'left'}}>
                    {comp.companyName}
                  </span>
                )
              })
            }
          </div>
       }
    </Stack>
  )
}