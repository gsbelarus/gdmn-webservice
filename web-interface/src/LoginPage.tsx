import { useState } from "react";
import { Stack, TextField, DefaultButton } from "office-ui-fabric-react";
import React from "react";

interface ILoginPageProps {
  onLogin: (user: string, password: string) => void;
};

interface ILoginPageState {
  user: string;
  password: string;
}

export const LoginPage = ({ onLogin }: ILoginPageProps) => {
  const [state, setState] = useState<ILoginPageState>({ user: '', password: '' });

  return (
    <Stack>
      <TextField
        label="User name:"
        value={state.user}
        onChange={ (_, user) => user && setState({...state, user}) }
      />
      <TextField
        label="Password:"
        value={state.password}
        onChange={ (_, password) => password && setState({...state, password}) }
      />
      <DefaultButton
        text="Login"
        onClick={ () => onLogin(state.user, state.password) }
      />
    </Stack>
  );
}