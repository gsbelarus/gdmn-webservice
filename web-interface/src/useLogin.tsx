import { useState } from "react";

export type LoginState = 'LOGGED_OUT' | 'LOGGED_IN' | 'LOGGING_IN' | 'LOGGING_OUT';

export interface ILogin {
  loginState: LoginState;
  user?: string;
  password?: string;
<<<<<<< HEAD
  // fullName?: string;
  // phone?: string;
  // isAdmin?: boolean;
=======
  fullName?: string;
  phone?: string;
  isAdmin?: boolean;
>>>>>>> master
  errorMessage?: string;
};

export type LoginProc = (user: string, password: string) => Promise<ILogin>;
export type LogoutProc = () => void;

export const useLogin = (user?: string, password?: string): [ILogin, LoginProc, LogoutProc] => {
  const [login, setLogin] = useState<ILogin>({ loginState: 'LOGGED_OUT', user, password });

  const doLogin: LoginProc = (user: string, password: string) => {
    setLogin({ loginState: 'LOGGING_IN' });
    return new Promise(
      resolve => {
        setTimeout( () => {

          const newState: ILogin = {
            loginState: 'LOGGED_IN',
            user,
            password
          };

          setLogin(newState);

          resolve(newState);

        }, 2000 );
      }
    );
  };

  const doLogout = () => {
    setLogin({ loginState: 'LOGGING_OUT' });
    setTimeout( () => setLogin({
      loginState: 'LOGGED_OUT'
    }), 2000 );
  };

  return [login, doLogin, doLogout];
};