import { useState } from 'react';
import { Frame } from './Frame';
import React from 'react';
import { Stack, Pivot, PivotItem, TextField, PrimaryButton, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { PasswordInput } from './PasswordInput';

export interface ISignInBoxData {
  userName: string;
  password: string;
  fullName: string;
  phone?: string;
  organization?: string[];
  uid?: string;
}

export interface ISignInBoxStateProps {
  signInInitialValues: ISignInBoxData;
  signInRequesting: boolean;
  signUpRequesting: boolean;
 // errorMessage?: string[];
}

export interface ISignInBoxProps extends ISignInBoxStateProps {
  onSignIn: (data: ISignInBoxData) => void;
  onSignUp: (data: ISignInBoxData) => void;
 // onHideMessage: () => void;
}

export const SignInBox = (props: ISignInBoxProps) => {
  const tabs = ['Вход', 'Регистрация'];
  const { onSignIn, signInRequesting, onSignUp, signUpRequesting, signInInitialValues } = props;
  const [ userName, setUserName ] = useState(signInInitialValues.userName);
  const [ password, setPassword ] = useState(signInInitialValues.password);
  const [ repeatPassword, setRepeatPassword ] = useState();
  const [ fullName, setFullName ] = useState(signInInitialValues.fullName);
  const [ phone, setPhone ] = useState();

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
                      disabled={signInRequesting}
                      value={userName}
                      onChange={ (_, userName) => userName && setUserName(userName) }
                    />
                    <PasswordInput
                      label="Пароль:"
                      disabled={signInRequesting}
                      value={password}
                      onChange={(_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                        setPassword(newValue ? newValue : '');
                      }}
                    />
                    <div className="SignInText" style={{paddingTop: '4px', textAlign: 'right', width: '100%', textDecoration: 'underline', fontSize: '12px'}}>Забыли пароль?</div>
                    <div className="SignInButtons">
                      <PrimaryButton
                        text="Войти"
                        style={{marginTop: '8px', float: 'right'}}
                        disabled={signInRequesting}
                        onRenderIcon={
                          signInRequesting ? (_props, _defaultRenderer) => <Spinner size={SpinnerSize.xSmall} /> : undefined
                        }
                        onClick={() => {
                          onSignIn({ userName, password, fullName });
                        }}
                      />
                    </div>
                  </>
                :
                  <>
                    <TextField
                      label="Пользователь:"
                      disabled={signUpRequesting}
                      value={userName}
                      onChange={ (_, userName) => userName && setUserName(userName) }
                    />
                    <PasswordInput
                      label="Пароль:"
                      disabled={signUpRequesting}
                      value={password}
                      onChange={(_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                        setPassword(newValue ? newValue : '');
                        if (repeatPassword !== '') setPassword('');
                      }}
                    />
                    <PasswordInput
                      label="Повторите пароль:"
                      disabled={signUpRequesting}
                      value={repeatPassword}
                      onChange={(_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                        setRepeatPassword(newValue ? newValue : '');
                      }}
                      onGetErrorMessage={(value) => value === '' ? "Повторите пароль" : value === password ? "" : "Неправильный пароль"}
                    />
                    <TextField
                      label="ФИО:"
                      disabled={signUpRequesting}
                      value={fullName}
                      onChange={ (_, fullName) => fullName && setFullName(fullName) }
                    />
                    <TextField
                      label="Номер телефона:"
                      disabled={signUpRequesting}
                      value={phone}
                      onChange={ (_, phone) => phone && setPhone(phone) }
                    />
                    <div className="SignUpButtons">
                      <PrimaryButton
                        text="Регистрация"
                        style={{marginTop: '8px', float: 'right'}}
                        disabled={signUpRequesting || userName === '' || password === '' || repeatPassword === '' || password !== repeatPassword}
                        onRenderIcon={
                          signUpRequesting ? (_props, _defaultRenderer) => <Spinner size={SpinnerSize.xSmall} /> : undefined
                        }
                        onClick={() => {
                          onSignUp({ userName, password, fullName });
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