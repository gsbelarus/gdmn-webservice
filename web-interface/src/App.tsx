import React, { useReducer, useState, useEffect } from 'react';
import { SignInBox, IUser, IUserSign, IUserParams } from './SignInBox';
import { AdminBox } from './AdminBox';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';

type AppState = 'SIGNIN' | 'ADMIN';

 type Action = { type: 'SET_STATE', appState: AppState }

interface IAppState {
  appState: AppState;
};


function reducer(state: IAppState, action: Action): IAppState {
  switch (action.type) {
    case 'SET_STATE': {
      const { appState } = action;

      return {
        ...state,
        appState
      }
    }
  }
}

const App: React.FC = () => {
  const [{ appState }, viewDispatch] = useReducer(reducer, { appState: 'SIGNIN' });
  const [ signInRequesting, setSignInRequesting ] = useState(false);
  const [ signUpRequesting, setSignUpRequesting ] = useState(false);
  const [ user, setUser ] = useState({
    name: 'test@gmail.com',
    fullName: 'Тест Т.Т.',
    phone: '+375(29)11-11-111',
    organizations: ['GS', 'Ampersant'],
    devices: ['samsungJ5']
  } as IUserParams);

  useEffect( () => {
    if (signInRequesting) {
      viewDispatch({ type: 'SET_STATE', appState: 'ADMIN' });
    }
  }
  , [signInRequesting]
  )
  console.log(appState);

  return (
    <BrowserRouter>
      <>
        <div className="">
          <Switch>
            {appState === 'SIGNIN'
              ? <Redirect exact={true} from={`/`} to={`/signIn`} />
              : <Redirect exact={true} from={`/signIn`} to={`/admin`} />}
            <Route
              exact={false}
              path={`/signIn`}
              render={props => {
                return(
                  <SignInBox
                    signInInitialValues={{...user, password: '1'}}
                    signInRequesting={signInRequesting}
                    signUpRequesting={signUpRequesting}
                    onSignIn={() => {setSignInRequesting(true); console.log(appState);}}
                    onSignUp={() => {}}
                  />
                )
              }}
            />}
            <Route
              exact={false}
              path={`/admin`}
              render={props => {
                return(
                  <AdminBox
                    userParams={user}
                    onSaveProfile={(user) => {
                      setUser(user);
                    }}
                  />
                )
              }}
            />}
          </Switch>
        </div>
      </>
    </BrowserRouter>
  );


  // return (
  //   <div>
  //     {
  //       appState === 'REGISTRATION'
  //       ?
  //         <SignInBox
  //           signInInitialValues={{
  //             userName: 'sunnycreature@gmail.com',
  //             password: '1',
  //             fullName: 'Дзядевич И.В.'
  //           }}
  //           signInRequesting={signInRequesting}
  //           signUpRequesting={signUpRequesting}
  //           onSignIn={() => {setSignInRequesting(true); console.log(appState);}}
  //           onSignUp={() => {}}
  //         />
  //       : appState === 'ADMINISTRATION'
  //         ?
  //           <AdminBox
  //             userName={'sunnycreature@gmail.com'}
  //             organizations={['GS', 'Ampersant']}
  //             onClickEditProfile={() => {}}
  //           />
  //         :
  //           <></>
  //     }

  //   </div>
  // );
}

export default App;
