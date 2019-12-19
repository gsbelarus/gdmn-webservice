import React from 'react';
import { useLogin } from './useLogin';
import { DefaultButton, Stack } from "office-ui-fabric-react";
import { LoginPage } from './LoginPage';
import { OurList } from './OurList';

const App: React.FC = () => {

  const [login, doLogin, doLogout] = useLogin();

  return (
    <div>
      {login.loginState}
      {
        login.loginState === 'LOGGED_OUT'
        ?
          <LoginPage
            onLogin={doLogin}
          />
        : login.loginState === 'LOGGED_IN'
        ?
          <Stack horizontal>
            <DefaultButton
              text="Logout"
              onClick={doLogout}
            />
          </Stack>
        :
          null
      }
      <div>
        <OurList loginState={login.loginState} />
      </div>
    </div>
  );
}

export default App;
