import React, { useState } from 'react';
import { PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
import { IUserParams, IUser } from './LoginPage';

export interface IAdminBoxProps {
  userParams: IUserParams;
  onSave: (userParams: IUserParams) => void;
}

export const Profile = (props: IAdminBoxProps) => {
  const {onSave, userParams} = props;
  const [state, setState] = useState<IUser>({
    user: userParams.user,
    fullName: userParams.fullName,
    phone: userParams.phone
   });

  return (
    <Stack horizontalAlign='center'>
      <div style={{width: '30vh', padding: '10px'}}>
        <TextField
          label="Пользователь:"
          value={state.user}
          onChange={ (_, user) => setState({...state, user: user ? user : ''}) }
        />
        <TextField
          label="ФИО:"
          value={state.fullName}
          onChange={ (_, fullName) => setState({...state, fullName}) }
        />
        <TextField
          label="Номер телефона:"
          value={state.phone}
          onChange={ (_, phone) => setState({...state, phone}) }
        />
        <div className="">
          <PrimaryButton
            text="Сохранить"
            style={{marginTop: '10px', float: 'right'}}
            disabled={!state.user
              || JSON.stringify({user: userParams.user, fullName: userParams.fullName, phone: userParams.phone})
                === JSON.stringify(state)}
            onClick={() => {
              onSave({ user: state.user, fullName: state.fullName, phone: state.phone });
            }}
          />
        </div>
      </div>
    </Stack>
  )
}