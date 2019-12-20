import { IUser } from "../types";
import React, { useState } from "react";
import { Stack, TextField, Label, PrimaryButton } from "office-ui-fabric-react";

interface ILoginProps {
  user?: IUser;
  querying: boolean;
  errorMessage?: string;
  onLogin: (login: string, password: string) => void;
};

export const Login = ({ user, querying, errorMessage, onLogin }: ILoginProps) => {

  const [login, setLogin] = useState(user?.login ? user.login : '');
  const [password, setPassword] = useState(user?.password ? user.password : '');

  return (
    <div>
      <Stack>
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
          disabled={ !login || !password || querying }
          onClick={ () => onLogin(login, password) }
        />
      </Stack>
    </div>
  );
};