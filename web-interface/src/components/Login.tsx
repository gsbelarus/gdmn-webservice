import { IUser } from "../types";
import React, { useState, useEffect } from "react";
import { Stack, TextField, Label, PrimaryButton, Link } from "office-ui-fabric-react";

interface ILoginProps {
  user?: IUser;
  querying: boolean;
  errorMessage?: string;
  onLogin: (userName: string, password: string) => void;
  onSetSignUp: () => void;
  onClearError: () => void;
};

export const Login = ({ user, querying, errorMessage, onLogin, onSetSignUp, onClearError }: ILoginProps) => {

  const [userName, setLogin] = useState(user?.userName ? user.userName : '');
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
            label="Имя пользователя:"
            value={userName}
            onChange={ (_, userName) => userName !== undefined ? setLogin(userName) : undefined }
          />
          <TextField
            label="Пароль:"
            value={password}
            onChange={ (_, password) => password !== undefined ? setPassword(password) : undefined }
          />
          <PrimaryButton
            text="Войти"
            style={{float: 'right', margin: '8px 0'}}
            disabled={ !userName || !password || querying }
            onClick={ () => {
              onClearError();
              onLogin(userName, password);
            }}
          />
          <div
            onClick={ () => {
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