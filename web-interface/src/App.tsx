import React, { useReducer } from 'react';
import { IUser } from './types';
import { Login } from './components/Login';
import { useLogin } from './useLogin';

type AppState = 'LOGIN' | 'QUERY_LOGIN' | 'PROFILE';

interface IState {
  /**
   * Состояние нашего приложения. В зависимости
   * от него мы будем отрисовывать экран.
   */
  appState: AppState;
  /**
   * Наличие данных о пользователе будет для
   * нас сигналом, что успешно прошла авторизация
   * на сервере.
   */
  user?: IUser;

  /**
   *
   */
  errorMessage?: string;
};

type Action = { type: 'SET_STATE', appState: AppState } |
  { type: 'SET_USER', user: IUser };

const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case 'SET_STATE': {
      const { appState } = action;
      return {
        ...state,
        appState
      }
    }
  }

  return state;
};

const App: React.FC = () => {
  const [login, doLogin, doLogout] = useLogin('test@gmail.com', '1');
  const [{ appState, user, errorMessage }, dispatch] = useReducer(reducer, {
    appState: 'LOGIN'
  });

  return (
    appState === 'LOGIN' || appState === 'QUERY_LOGIN'
    ?
      <Login
        user={user}
        querying={appState === 'QUERY_LOGIN'}
        errorMessage={errorMessage}
        onLogin={ async (login, password) => {
          const loginData = await doLogin(login, password);
          if (loginData.loginState === 'LOGGED_IN') {
            dispatch({ type: 'SET_USER', user: {login, password} })
          }
        }}
      //onLogUp={ () => {} }
      />
    :
      <div>
        Hello!
      </div>
  );
};

export default App;
