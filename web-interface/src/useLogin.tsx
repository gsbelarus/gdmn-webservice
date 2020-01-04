import { useState } from "react";
import { IUserCompany } from "./types";

export type LoginState = 'LOGGED_OUT' | 'LOGGED_IN' | 'LOGGING_IN' | 'LOGGING_OUT' | 'SIGNED_UP' | 'SIGNING_UP' | 'GETTING_ME' | 'GOT_ME';

export interface ILogin {
  loginState: LoginState;
  userName?: string;
  password?: string;
  companies?: IUserCompany[];
  errorMessage?: string;
};

export type LogInProc = (userName: string, password: string) => Promise<ILogin>;
export type LogGetMe = () => Promise<ILogin>;
export type LogOutProc = () => Promise<ILogin>;
export type SignUpProc = (userName: string, password: string) => Promise<ILogin>;

export const useLogin = (userName?: string, password?: string): [ILogin, LogInProc, LogGetMe, LogOutProc, SignUpProc] => {
  const [login, setLogin] = useState<ILogin>({ loginState: 'LOGGED_OUT', userName: userName, password });

  const doLogin: LogInProc = (userName: string, password: string) => {
    setLogin({ loginState: 'LOGGING_IN' });
    console.log('doLogin');

    const body = JSON.stringify({
      userName,
      password
    });

    return fetch("http://localhost:3649/api/login", {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body})
    .then ( res => res.json() )
    .then ( res => {
      let newState: ILogin;

      if (res.status === 200) {
        newState = {
          loginState: 'LOGGED_IN',
          userName,
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

  const doGetMe: LogGetMe = () => {
    setLogin({ loginState: 'GETTING_ME' });
    console.log('doGetMe');

    return fetch("http://localhost:3649/api/me", {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'})
    .then ( res => res.json() )
    .then ( res => {
      let newState: ILogin;
      console.log(res);
      if (res.status === 200) {
        newState = {
          loginState: 'GOT_ME',
          userName: res.result.userName,
          companies: res.result.organisations?.map((org: IUserCompany) => {return {companyName: org}})
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

  const doSignUp: SignUpProc = (userName: string, password: string) => {
    setLogin({loginState: 'SIGNING_UP', userName, password});
    console.log('doSignUp');

    const body = JSON.stringify({
      userName,
      password
    });

    return fetch("http://localhost:3649/api/signup", {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body})
      .then ( res => res.json() )
      .then ( res => {
        let newState: ILogin;

        if (res.status === 200) {
          newState = {
            userName,
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

    setLogin({loginState: 'LOGGING_OUT', userName: login.userName, password: login.password});
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
            userName: login.userName,
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
          userName: login.userName,
          password: login.password,
          errorMessage: err
        };

        setLogin(newState);
        return newState;
      });
  };
  console.log(login);
  return [login, doLogin, doGetMe, doLogOut, doSignUp];
};