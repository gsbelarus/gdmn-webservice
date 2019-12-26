import { useState } from "react";

export type SignUpState = 'SIGNED_UP' | 'SIGNING_UP' | 'SIGNED_OUT';

export interface ISignUp {
  signUpState: SignUpState;
  user?: string;
  password?: string;
  // fullName?: string;
  // phone?: string;
  // isAdmin?: boolean;
  errorMessage?: string;
};

export type SignUpProc = (user: string, password: string) => Promise<ISignUp>;

export const useSignUp = (user?: string, password?: string): [ISignUp, SignUpProc] => {
  const [signUp, setSignUp] = useState<ISignUp>({ signUpState: 'SIGNED_OUT', user, password });

  const doSignUp: SignUpProc = (user: string, password: string) => {
    setSignUp({ signUpState: 'SIGNING_UP' });

    const body = JSON.stringify({
      userName: user,
      password
    });
    console.log({method: 'POST', body});
    return fetch("http://localhost:3649/api/signup", {method: 'POST', headers: {'Content-Type': 'application/json'}, body})
      .then ( res => res.json() )
      .then ( res => {
        let newState: ISignUp;

        if (res.status === 200) {
          console.log('set');
          newState = {
            signUpState: 'SIGNED_UP',
            user,
            password
          };
         } else {
          console.log('else');
          console.log(res.status);
          newState = {
            signUpState: 'SIGNED_OUT',
            user: undefined,
            password: undefined,
            errorMessage: res.status
          };
        }

        setSignUp(newState);
        return newState;
      })
      .catch( err => {
        console.log('catch');
        console.log(err);
        const newState: ISignUp = {
          signUpState: 'SIGNED_OUT',
          user: undefined,
          password: undefined,
          errorMessage: 'err'
        };
        setSignUp(newState);
        return newState;
      });
  };

  return [signUp, doSignUp];
};