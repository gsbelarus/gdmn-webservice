import React, { useReducer } from 'react';
import { IUser } from './types';
import { Login } from './components/Login';

interface IState {
  /**
   * Состояние нашего приложения. В зависимости
   * от него мы будем отрисовывать экран.
   */
  appState: 'LOGIN' | 'QUERY_LOGIN';
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

type Action = { type: 'TEST' };

const reducer = (state: IState, action: Action): IState => {
  return state;
};

const App: React.FC = () => {
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
        onLogin={...}
      />
    :
      <div>
        Hello!
      </div>
  );
};

export default App;
