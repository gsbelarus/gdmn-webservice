import { useState } from 'react';
import { Frame } from './Frame';
import React from 'react';
import { Stack, Pivot, PivotItem, TextField, PrimaryButton, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { PasswordInput } from './PasswordInput';

export interface IUser {
  user: string;
  fullName?: string;
  phone?: string;
}

export interface IUserLog extends IUser {
  password: string;
}

export interface IUserParams extends IUser {
  organizations?: string[];
  devices?: string[];
}

export interface ILoginPageStateProps {
  logInInitialValues: IUserLog;
  logInRequesting: boolean;
  logUpRequesting: boolean;
 // errorMessage?: string[];
}

export interface ISignInBoxProps extends ILoginPageStateProps {
  onLogIn: (data: IUserLog) => void;
  onLogUp: (data: IUserLog) => void;
 // onHideMessage: () => void;
}

export const LoginPage = (props: ISignInBoxProps) => {
  const tabs = ['Вход', 'Регистрация'];
  const { onLogIn, logInRequesting, onLogUp, logUpRequesting, logInInitialValues } = props;
  const [ repeatPassword, setRepeatPassword ] = useState();
  const [state, setState] = useState<IUserLog>({
    user: logInInitialValues.user,
    password: logInInitialValues.password,
    fullName: logInInitialValues.fullName,
    phone: logInInitialValues.phone
   });


  return (
    <Stack horizontalAlign='center'>
      <Frame border marginTop height='500px'>
        <Pivot aria-label="SignInBox" style={{width: '300px'}}>
          {tabs.map(t =>
            (
              <PivotItem headerText={t}>
                { t === 'Вход'
                  ?
                  <>
                    <TextField
                      label="Пользователь:"
                      disabled={logInRequesting}
                      value={state.user}
                      onChange={ (_, user) => user && setState({...state, user}) }
                    />
                    <PasswordInput
                      label="Пароль:"
                      disabled={logInRequesting}
                      value={state.password}
                      onChange={(_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                        setState({...state, password: newValue ? newValue : ''});
                      }}
                    />
                    <div className="SignInText" style={{paddingTop: '4px', textAlign: 'right', width: '100%', textDecoration: 'underline', fontSize: '12px'}}>Забыли пароль?</div>
                    <div className="SignInButtons">
                      <PrimaryButton
                        text="Войти"
                        style={{marginTop: '8px', float: 'right'}}
                        disabled={logInRequesting}
                        onRenderIcon={
                          logInRequesting ? (_props, _defaultRenderer) => <Spinner size={SpinnerSize.xSmall} /> : undefined
                        }
                        onClick={() => {
                          onLogIn({ user: state.user, password: state.password });
                        }}
                      />
                    </div>
                  </>
                :
                  <>
                    <TextField
                      label="Пользователь:"
                      disabled={logUpRequesting}
                      value={state.user}
                      onChange={ (_, user) => user && setState({...state, user}) }
                    />
                    <PasswordInput
                      label="Пароль:"
                      disabled={logUpRequesting}
                      value={state.password}
                      onChange={(_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                        setState({...state, password: newValue ? newValue : ''});
                        if (repeatPassword !== '') setState({...state, password: ''});
                      }}
                    />
                    <PasswordInput
                      label="Повторите пароль:"
                      disabled={logUpRequesting}
                      value={repeatPassword}
                      onChange={(_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                        setRepeatPassword(newValue ? newValue : '');
                      }}
                      onGetErrorMessage={(value) => value === '' ? "Повторите пароль" : value === state.password ? "" : "Неправильный пароль"}
                    />
                    <TextField
                      label="ФИО:"
                      disabled={logUpRequesting}
                      value={state.fullName}
                      onChange={ (_, fullName) => fullName && setState({...state, fullName}) }
                    />
                    <TextField
                      label="Номер телефона:"
                      disabled={logUpRequesting}
                      value={state.phone}
                      onChange={ (_, phone) => phone && setState({...state, phone}) }
                    />
                    <div className="SignUpButtons">
                      <PrimaryButton
                        text="Регистрация"
                        style={{marginTop: '8px', float: 'right'}}
                        disabled={logUpRequesting || state.user === '' || state.password === '' || repeatPassword === '' || state.password !== repeatPassword}
                        onRenderIcon={
                          logUpRequesting ? (_props, _defaultRenderer) => <Spinner size={SpinnerSize.xSmall} /> : undefined
                        }
                        onClick={() => {
                          onLogUp({ user: state.user, password: state.password, fullName: state.fullName });
                        }}
                      />
                    </div>
                  </>
                }
              </PivotItem>
            )
          )}
        </Pivot>
      </Frame>
    </Stack>
  );
}