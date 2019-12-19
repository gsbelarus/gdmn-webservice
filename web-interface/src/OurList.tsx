import React from "react";
import { LoginState } from "./useLogin";

export const OurList = ({ loginState }: { loginState: LoginState }) => {
  return (
    loginState === 'LOGGED_IN'
    ?
      <div>
        List...
      </div>
    :
      <div>
        Sorry, you are not logged in yet...
      </div>
  );
};