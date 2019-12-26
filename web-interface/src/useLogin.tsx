import { useState } from "react";

export type LoginState = 'LOGGED_OUT' | 'LOGGED_IN' | 'LOGGING_IN' | 'LOGGING_OUT' | 'SIGNED_UP' | 'SIGNING_UP';

export interface ILogin {
  loginState: LoginState;
  user?: string;
  password?: string;
  errorMessage?: string;
};

export type LogInProc = (user: string, password: string) => Promise<ILogin>;
export type LogoutProc = () => Promise<ILogin>;
export type SignUpProc = (user: string, password: string) => Promise<ILogin>;

export const useLogin = (user?: string, password?: string): [ILogin, LogInProc, LogoutProc, SignUpProc] => {
  const [login, setLogin] = useState<ILogin>({ loginState: 'LOGGED_OUT', user, password });

  const doLogin: LogInProc = (user: string, password: string) => {
    setLogin({ loginState: 'LOGGING_IN' });
    console.log('doLogin');

    const body = JSON.stringify({
      userName: user,
      password,
    });

    return fetch("http://localhost:3649/api/login", {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body})
    .then ( res => res.json() )
    .then ( res => {
      let newState: ILogin;

      if (res.status === 200) {
        newState = {
          loginState: 'LOGGED_IN',
          user,
          password
        };
       } else {
        newState = {
          loginState: 'LOGGING_OUT',
          errorMessage: `${res.status} - ${res.result}`
        };
      }

      setLogin(newState);
      return newState;
    })
    .catch( err => {
      const newState: ILogin = {
        loginState: 'LOGGING_OUT',
        errorMessage: err
      };

      setLogin(newState);
      return newState;
    });

  };

  const doSignUp: SignUpProc = (user: string, password: string) => {
    setLogin({loginState: 'SIGNING_UP', user, password});
    console.log('doSignUp');

    const body = JSON.stringify({
      userName: user,
      password
    });

    return fetch("http://localhost:3649/api/signup", {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body})
      .then ( res => res.json() )
      .then ( res => {
        let newState: ILogin;

        if (res.status === 200) {
          newState = {
            user,
            password,
            loginState: 'SIGNED_UP',
          };
         } else {
          newState = {
            loginState: 'LOGGED_OUT',
            errorMessage: `${res.status} - ${res.result}`
          };
        }

        setLogin(newState);
        return newState;
      })
      .catch( err => {
        const newState: ILogin = {
          loginState: 'LOGGED_OUT',
          errorMessage: err
        };

        setLogin(newState);
        return newState;
      });
  };

  const doLogOut = () => {

    setLogin({loginState: 'LOGGING_OUT', user: login.user, password: login.password});
    console.log('doLogout');

    return fetch("http://localhost:3649/api/signout", {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'})
      .then ( res => res.json() )
      .then ( res => {
        let newState: ILogin;

        if (res.status === 200) {
          newState = {
            loginState: 'LOGGED_OUT',
          };
         } else {
          newState = {
            loginState: 'SIGNED_UP',
            user: login.user,
            password: login.password,
            errorMessage: `${res.status} - ${res.result}`
          };
        }

        setLogin(newState);
        return newState;
      })
      .catch( err => {
        const newState: ILogin = {
          loginState: 'SIGNED_UP',
          user: login.user,
          password: login.password,
          errorMessage: err
        };

        setLogin(newState);
        return newState;
      });
  };

  return [login, doLogin, doLogOut, doSignUp];
};