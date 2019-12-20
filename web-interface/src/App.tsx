<<<<<<< HEAD
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
=======
import React, { useReducer, useState, useEffect } from 'react';
import { LoginPage as LoginPage, IUserParams } from './LoginPage';
import { AdminBox } from './AdminBox';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { Menu } from './Menu';
import { Profile } from './Profile';
import { useLogin } from './useLogin';

type ModeState = 'LOG_IN' | 'ADMIN' | 'PROFILE';

type Action = { type: 'SET_STATE', appState: ModeState }


interface IAppState {
  appState: ModeState;
};


function reducer(state: IAppState, action: Action): IAppState {
>>>>>>> master
  switch (action.type) {
    case 'SET_STATE': {
      const { appState } = action;
      return {
        ...state,
        appState
      }
    }
  }
<<<<<<< HEAD

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
=======
}

const App: React.FC = () => {
  const [login, doLogin, doLogout] = useLogin('test@gmail.com', '1');
  const [{ appState }, viewDispatch] = useReducer(reducer, { appState: 'LOG_IN' });
  const [ user, setUser ] = useState({
    user: 'test@gmail.com',
    fullName: 'Тест Т.Т.',
    phone: '+375(29)11-11-111',
    //organizations: ['GS', 'Ampersant'],
    //devices: ['samsungJ5']
  } as IUserParams);


  useEffect(() => {
    // if (login.loginState === 'LOGGED_IN') {
    //   switch (appState) {
    //     case 'ADMIN':
    //       history.push(`/admin`);
    //     case 'PROFILE':
    //       history.push(`/profile`);
    //   }
    // }
  }, [appState])

  console.log(appState);

  return (
      <>
        <div className="">
          {appState !== 'LOG_IN' &&
            <Menu
              login={user.user}
              onEditProfile={() => { viewDispatch({ type: 'SET_STATE', appState: 'PROFILE' }) }}
            />
          }
        </div>

        {appState === 'LOG_IN'
          ?
            <LoginPage
              logInInitialValues={{...user, password: '1'}}
              logInRequesting={login.loginState === 'LOGGING_IN'}
              logUpRequesting={false}
              onLogIn={
                async ({user, password}) => {
                  const loginData = await doLogin(user, password);
                  if (loginData.loginState === 'LOGGED_IN') {
                    if (loginData.isAdmin)
                      viewDispatch({ type: 'SET_STATE', appState: 'ADMIN' })
                    else
                      viewDispatch({ type: 'SET_STATE', appState: 'PROFILE' });
                  }
                }}
              onLogUp={ () => {} }
            />
          : appState === 'ADMIN'
            ?
              <AdminBox
                userParams={user}
              />
            :
              <Profile
                userParams={user}
                onSave={(user) => {
                  setUser(user);
                }}
              />
        }
      </>
>>>>>>> master
  );
};

// import React, { useReducer, useState, useEffect } from 'react';
// import { LoginPage as LoginPage, IUserParams } from './LoginPage';
// import { AdminBox } from './AdminBox';
// import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
// import { Menu } from './Menu';
// import { Profile } from './Profile';
// import { useLogin } from './useLogin';

// type ModeState = 'LOG_IN' | 'ADMIN' | 'PROFILE';

// type Action = { type: 'SET_STATE', appState: ModeState }


// interface IAppState {
//   appState: ModeState;
//   isAdmin?: boolean;
// };


// function reducer(state: IAppState, action: Action): IAppState {
//   switch (action.type) {
//     case 'SET_STATE': {
//       const { appState } = action;
//       return {
//         ...state,
//         appState
//       }
//     }
//   }
// }

// const App: React.FC = () => {
//   const [login, doLogin, doLogout] = useLogin('test@gmail.com', '1');
//   const [{ appState }, viewDispatch] = useReducer(reducer, { appState: 'LOG_IN' });
//   const [ user, setUser ] = useState({
//     user: 'test@gmail.com',
//     fullName: 'Тест Т.Т.',
//     phone: '+375(29)11-11-111',
//     //organizations: ['GS', 'Ampersant'],
//     //devices: ['samsungJ5']
//   } as IUserParams);


//   useEffect(() => {
//     // if (login.loginState === 'LOGGED_IN') {
//     //   switch (appState) {
//     //     case 'ADMIN':
//     //       history.push(`/admin`);
//     //     case 'PROFILE':
//     //       history.push(`/profile`);
//     //   }
//     // }
//   }, [appState])

//   console.log(appState);

//   return (
//     <BrowserRouter>
//       <>
//         <div className="">
//           {appState !== 'LOG_IN' &&
//             <Menu
//               login={user.user}
//               onEditProfile={() => { viewDispatch({ type: 'SET_STATE', appState: 'PROFILE' }) }}
//             />
//           }
//           <Switch>
//             <Redirect exact={true} from={`/`} to={`/signIn`} />
//             <Route
//               exact={false}
//               path={`/signIn`}
//               render={ (match)  => {
//                 return (
//                   <LoginPage
//                     logInInitialValues={{...user, password: '1'}}
//                     logInRequesting={login.loginState === 'LOGGING_IN'}
//                     logUpRequesting={false}
//                     onLogIn={
//                       async ({user, password}) => {
//                         const loginData = await doLogin(user, password);
//                         if (loginData.loginState === 'LOGGED_IN') {
//                           // viewDispatch({ type: 'SET_STATE', appState: 'PROFILE' });
//                           // match.history.push(`/profile`);
//                           viewDispatch({ type: 'SET_STATE', appState: 'ADMIN' });
//                           match.history.push(`/admin`);
//                         }
//                       }}
//                     onLogUp={ () => {} }
//                   />
//                 )
//               }}
//             />
//             <Route
//               exact={false}
//               path={`/admin`}
//               render={ () => {
//                 return (
//                   <AdminBox
//                     userParams={user}
//                   />
//                 )
//               }}
//             />
//             <Route
//               exact={false}
//               path={`/profile`}
//               render={ () => {
//                 return (
//                   <Profile
//                     userParams={user}
//                     onSaveProfile={(user) => {
//                       setUser(user);
//                     }}
//                   />
//                 )
//               }}
//             />
//           </Switch>
//         </div>
//       </>
//     </BrowserRouter>
//   );
// }

export default App;
