import { IUser } from "../types";
import React, { useState, useEffect } from "react";
import { Stack, TextField, Label, PrimaryButton, Link } from "office-ui-fabric-react";

interface ILoginProps {
  user?: IUser;
  querying: boolean;
  errorMessage?: string;
  onLogin: (login: string, password: string) => void;
  onSetSignUp: () => void;
  onClearError: () => void;
};

export const Login = ({ user, querying, errorMessage, onLogin, onSetSignUp, onClearError }: ILoginProps) => {

  const [login, setLogin] = useState(user?.login ? user.login : '');
  const [password, setPassword] = useState(user?.password ? user.password : '');

  return (
    <div>
      <Stack horizontalAlign='center'>
        <div style={{width: '250px'}}>
          {
            querying
            ?
              <Label>
                Идет запрос к серверу...
              </Label>
            :
              null
          }
          {
            errorMessage &&
            <Label>
              {`Ошибка при проверке пользователя на сервере: ${errorMessage}`}
            </Label>
          }
          <TextField
            label="User name:"
            value={login}
            onChange={ (_, login) => login !== undefined ? setLogin(login) : undefined }
          />
          <TextField
            label="Password:"
            value={password}
            onChange={ (_, password) => password !== undefined ? setPassword(password) : undefined }
          />
          <PrimaryButton
            text="Login"
            style={{float: 'right', margin: '8px 0'}}
            disabled={ !login || !password || querying }
            onClick={ () => {
              onClearError();
              onLogin(login, password);
            }}
          />
          <div onClick={ () => {
            onClearError();
            onSetSignUp();
            }}
            style={{width: '100%', float: 'right', textAlign: 'right', color: '#0366d6', textDecoration: 'underline', fontSize: '12px'}}
          >
            Зарегистрироваться
          </div>
        </div>
      </Stack>
    </div>
  );
};