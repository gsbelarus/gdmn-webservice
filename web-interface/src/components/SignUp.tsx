import { IUser } from "../types";
import React, { useState, useEffect } from "react";
import { Stack, TextField, Label, PrimaryButton, Link } from "office-ui-fabric-react";

interface ISignUpProps {
  user?: IUser;
  querying: boolean;
  errorMessage?: string;
  onSignUp: (login: string, password: string, ) => void;
  onClearError: () => void;
};

export const SignUp = ({ user, querying, errorMessage, onSignUp, onClearError }: ISignUpProps) => {

  const [login, setLogin] = useState(user?.login ? user.login : '');
  const [password, setPassword] = useState(user?.password ? user.password : '');
  const [repeatPassword, setRepeatPassword] = useState();

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
              {`Ошибка при регистрации пользователя на сервере: ${errorMessage}`}
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
          <TextField
            label="Repeat password:"
            value={repeatPassword}
            onChange={ (_, repeatPassword) => repeatPassword !== undefined ? setRepeatPassword(repeatPassword) : undefined }
          />
          <PrimaryButton
            text="Signup"
            style={{float: 'right', marginTop: '8px'}}
            disabled={ !login || !password || querying || repeatPassword !== password}
            onClick={ () => {
              onClearError();
              onSignUp(login, password)
            }}
          />
        </div>
      </Stack>
    </div>
  );
};