import { useState } from "react";

export type LoginState = 'LOGGED_OUT' | 'LOGGED_IN' | 'LOGGING_IN' | 'LOGGING_OUT';

export interface ILogin {
  loginState: LoginState;
  user?: string;
  password?: string;
  errorMessage?: string;
};

export type LoginProc = (user: string, password: string) => void;
export type LogoutProc = () => void;

export const useLogin = (): [ILogin, LoginProc, LogoutProc] => {
  const [login, setLogin] = useState<ILogin>({ loginState: 'LOGGED_OUT' });

  const doLogin = (user: string, password: string) => {
    setLogin({ loginState: 'LOGGING_IN' });
    setTimeout( () => setLogin({
      loginState: 'LOGGED_IN',
      user,
      password
    }), 2000 );
  };

  const doLogout = () => {
    setLogin({ loginState: 'LOGGING_OUT' });
    setTimeout( () => setLogin({
      loginState: 'LOGGED_OUT'
    }), 2000 );
  };

  return [login, doLogin, doLogout];
};