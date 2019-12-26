import React, { useReducer, useEffect } from 'react';
import { IUser } from './types';
import { Login } from './components/Login';
import { useLogin } from './useLogin';
import { Profile } from './components/Profile';
import { Menu } from './components/Menu';
import { AdminBox } from './components/AdminBox';
import { SignUp } from './components/SignUp';

type AppState = 'LOGIN' | 'QUERY_LOGIN' | 'QUERY_LOGOUT' | 'SIGNUP' | 'QUERY_SIGNUP' | 'PROFILE';

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

type Action = { type: 'SET_STATE', appState: AppState }
  | { type: 'SET_USER', user?: IUser }
  | { type: 'SET_ERROR', errorMessage?: string };

const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case 'SET_STATE': {
      const { appState } = action;
      return {
        ...state,
        appState
      }
    }
    case 'SET_ERROR': {
      const { errorMessage } = action;
      return {
        ...state,
        errorMessage
      }
    }
    case 'SET_USER': {
      const { user } = action;
      return {
        ...state,
        user
      }
    }
  }

  return state;
};

const App: React.FC = () => {
  const [login, doLogIn, doLogOut, doSignUp] = useLogin();
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
          const loginData = await doLogIn(login, password);
          if (loginData.loginState === 'LOGGED_IN') {
            dispatch({ type: 'SET_USER', user: {login, password} });
            dispatch({ type: 'SET_STATE', appState: 'PROFILE' })
          } else {
            dispatch({ type: 'SET_ERROR', errorMessage: loginData.errorMessage })
          }
          //Добавить проверку, если пользователь не смог вылогиниться
        }}
        onSetSignUp={() => dispatch({ type: 'SET_STATE', appState: 'SIGNUP'})}
        onClearError={() => dispatch({ type: 'SET_ERROR', errorMessage: undefined})}
      />
    :
      appState === 'SIGNUP' || appState === 'QUERY_SIGNUP'
      ?
        <SignUp
          querying={appState === 'QUERY_SIGNUP'}
          errorMessage={errorMessage}
          onSignUp={ async (login, password) => {
            const signUpData = await doSignUp(login, password);
            if (signUpData.loginState === 'SIGNED_UP') {
              dispatch({ type: 'SET_USER', user: {login, password} });
              dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
            } else {
              dispatch({ type: 'SET_ERROR', errorMessage: signUpData.errorMessage })
            }
          }}
          onClearError={() => dispatch({ type: 'SET_ERROR', errorMessage: undefined})}
        />
      : user
        ?
        <div>
          <Menu
            login={user.login}
            querying={appState === 'QUERY_LOGOUT'}
            errorMessage={errorMessage}
            onEditProfile={() => dispatch({ type: 'SET_STATE', appState: 'PROFILE' }) }
            onLogOut={ async () => {
              const logOutData = await doLogOut();
              if (logOutData.loginState === 'LOGGED_OUT') {
                dispatch({ type: 'SET_USER', user: undefined});
                dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
              } else {
                dispatch({ type: 'SET_ERROR', errorMessage: logOutData.errorMessage })
              }
            }}
            onClearError={() => dispatch({ type: 'SET_ERROR', errorMessage: undefined})}
          />
          { user.organizations
            ?
            <AdminBox
              user={user}
            />
            :
            <Profile
              user={user}
              onEditProfile={(user) => { dispatch({ type: 'SET_USER', user })}}
            />
          }
        </div>
      :
        <div>Тест</div>
  );
};

export default App;
