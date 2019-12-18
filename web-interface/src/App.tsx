import React, { useReducer, useState, useEffect } from 'react';
import { SignInBox } from './SignInBox';
import { AdminBox } from './AdminBox';
import { Link, Redirect, Route, BrowserRouter, Switch } from 'react-router-dom';

type AppState = 'REGISTRATION' | 'ADMINISTRATION';

 type Action = { type: 'SET_STATE', appState: AppState }
//   | { type: 'SET_SHOW_SQL', showSQL: boolean }
//   | { type: 'SET_QUERY_STATE', queryState: QueryState };

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
  const [{ appState }, viewDispatch] = useReducer(reducer, { appState: 'REGISTRATION' });
  const [ signInRequesting, setSignInRequesting ] = useState(false);
  const [ signUpRequesting, setSignUpRequesting ] = useState(false);

  useEffect( () => {
    if (signInRequesting) {
      console.log(signInRequesting);

      viewDispatch({ type: 'SET_STATE', appState: 'ADMINISTRATION' });
      console.log(appState);
    }
  }
  , [signInRequesting]
  )
  console.log(appState);

  return (
    <BrowserRouter basename={window.location.href}>
      <>
      {/* <div>
      {
        appState === 'REGISTRATION'
        ?
          <SignInBox
            signInInitialValues={{
              userName: 'sunnycreature@gmail.com',
              password: '1',
              fullName: 'Дзядевич И.В.'
            }}
            signInRequesting={signInRequesting}
            signUpRequesting={signUpRequesting}
            onSignIn={() => {setSignInRequesting(true); console.log(appState);}}
            onSignUp={() => {}}
          />
        : appState === 'ADMINISTRATION'
          ?
            <AdminBox
              userName={'sunnycreature@gmail.com'}
              organizations={['GS', 'Ampersant']}
              onClickEditProfile={() => {}}
            />
          :
            <></>
      }

    </div> */}
        <div className="">
          <Switch>
            <Route
              exact={false}
              path={`/morphology`}
              render={<SignInBox
                signInInitialValues={{
                  userName: 'sunnycreature@gmail.com',
                  password: '1',
                  fullName: 'Дзядевич И.В.'
                }}
                signInRequesting={signInRequesting}
                signUpRequesting={signUpRequesting}
                onSignIn={() => {setSignInRequesting(true); console.log(appState);}}
                onSignUp={() => {}}
              />}
            />}
            <Route
              exact={false}
              path={`/morphology`}
              render={            <AdminBox
                userName={'sunnycreature@gmail.com'}
                organizations={['GS', 'Ampersant']}
                onClickEditProfile={() => {}}
              />}
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
