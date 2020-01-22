import { useState, useMemo, useCallback } from "react";
import { IUserCompany } from "./types";

export type LoginState = 'LOGGED_OUT' | 'LOGGED_IN' | 'LOGGING_IN' | 'LOGGING_OUT' | 'SIGNED_UP' | 'SIGNING_UP';

export interface ILogin {
  loginState: LoginState;
  userName?: string;
  userId?: string;
  code?: string;
  password?: string;
  companies?: IUserCompany[];
  errorMessage?: string;
};

export type LogInProc = (userName: string, password: string) => Promise<ILogin>;
export type LogOutProc = () => Promise<ILogin>;
export type SignUpProc = (userName: string, password: string) => Promise<ILogin>;

export type ILoginApi = {
  doLogIn: LogInProc,
  doLogOut: LogOutProc;
  doSignUp: SignUpProc;
};

let cnt = 0;

export const useLogin = (userName?: string, password?: string): [ILogin, ILoginApi] => {
  const [login, setLogin] = useState<ILogin>({ loginState: 'LOGGED_OUT', userName: userName, password });

  const doLogIn: LogInProc = useCallback(async (userName: string, password: string) => {
    setLogin({ loginState: 'LOGGING_IN' });
    console.log('doLogin', cnt);
    cnt++;

    const body = JSON.stringify({
      userName,
      password
    });

    try {
      const resFetch = await fetch("http://localhost:3649/api/login", { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body });
      const res = await resFetch.json();
      let newState: ILogin;
      if (res.status === 200) {
        newState = {
          loginState: 'LOGGED_IN',
          userName,
          userId: res.result,
          password
        };
      }
      else {
        newState = {
          loginState: 'LOGGING_OUT',
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setLogin(newState);
      return newState;
    }
    catch (err) {
      const newState: ILogin = {
        loginState: 'LOGGING_OUT',
        errorMessage: err
      };
      setLogin(newState);
      return newState;
    }

  }, []);

  const doSignUp: SignUpProc = useCallback(async (userName: string, password: string) => {
    setLogin({loginState: 'SIGNING_UP', userName, password});
    console.log('doSignUp');

    const body = JSON.stringify({
      userName,
      password
    });

    try {
      const resFetch = await fetch("http://localhost:3649/api/signup", { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body });
      const res = await resFetch.json();
      let newState: ILogin;
      console.log(res);
      if (res.status === 200) {
        newState = {
          userName,
          code: res.result,
          password,
          loginState: 'SIGNED_UP',
        };
      }
      else {
        newState = {
          loginState: 'LOGGED_OUT',
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setLogin(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: ILogin = {
        loginState: 'LOGGED_OUT',
        errorMessage: err
      };
      setLogin(newStateErr);
      return newStateErr;
    }
  }, []);

  const doLogOut: LogOutProc = useCallback(async () => {

    setLogin({loginState: 'LOGGING_OUT', userName: login.userName, password: login.password});
    console.log('doLogout');

    try {
      const resFetch = await fetch("http://localhost:3649/api/signout", { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      const res = await resFetch.json();
      let newState: ILogin;
      if (res.status === 200) {
        newState = {
          loginState: 'LOGGED_OUT',
        };
      }
      else {
        newState = {
          loginState: 'SIGNED_UP',
          userName: login.userName,
          password: login.password,
          errorMessage: `${res.status} - ${res.result}`
        };
      }
      setLogin(newState);
      return newState;
    }
    catch (err) {
      const newStateErr: ILogin = {
        loginState: 'SIGNED_UP',
        userName: login.userName,
        password: login.password,
        errorMessage: err
      };
      setLogin(newStateErr);
      return newStateErr;
    }
  }, [login.password, login.userName]);

  const loginApi = useMemo(
    () => ({
      doLogIn, doLogOut, doSignUp
    }),
    [doLogIn, doLogOut, doSignUp]
  );

  return [login, loginApi];
};