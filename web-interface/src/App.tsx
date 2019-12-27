import React, { useReducer, useEffect } from 'react';
import { IUser, IUserCompany } from './types';
import { Login } from './components/Login';
import { useLogin } from './useLogin';
import { Profile } from './components/Profile';
import { Menu } from './components/Menu';
import { AdminBox } from './components/AdminBox';
import { SignUp } from './components/SignUp';
import { Company } from './components/Company';
import { useCompany } from './useCompany';
import { useUserParams } from './useUserParams';

type AppState = 'LOGIN' | 'QUERY_LOGIN' | 'QUERY_LOGOUT' | 'SIGNUP' | 'QUERY_SIGNUP' | 'PROFILE' | 'SAVED_PROFILE' | 'ADMIN' | 'CREATE_COMPANY';

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

  companies?: IUserCompany[];
  companyName?: string;
  users?: string[];
  errorMessage?: string;
};

type Action = { type: 'SET_STATE', appState: AppState }
  | { type: 'SET_USER', user?: IUser }
  | { type: 'ADD_COMPANY', company: IUserCompany }
  | { type: 'SET_COMPANY', companyName: string }
  | { type: 'SET_COMPANIES', companies?: IUserCompany[] }
  | { type: 'EDIT_COMPANY', oldName: string, newName: string }
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
    case 'ADD_COMPANY': {
      const { company } = action;
      return {
        ...state,
        companies: state.companies ? [...state.companies, company] : [company]
      }
    }
    case 'EDIT_COMPANY': {
      const { oldName, newName } = action;
      return {
        ...state,
        companies: state.companies?.map(comp => comp.name === oldName ? {...comp, name: newName} : comp)
      }
    }
    case 'SET_COMPANIES': {
      const { companies } = action;
      return {
        ...state,
        companies
      }
    }
    case 'SET_COMPANY': {
      const { companyName } = action;
      return {
        ...state,
        companyName
      }
    }
  }

  return state;
};

const App: React.FC = () => {
  const [login, doLogIn, doLogOut, doSignUp] = useLogin();
  const [company, doCreateCompany] = useCompany();
  const [userParams, doGetCompanies, doEditUser] = useUserParams();
  const [{ appState, user, companies, companyName, users, errorMessage }, dispatch] = useReducer(reducer, {
    appState: 'LOGIN'
  });
  console.log(appState);

  return (
    appState === 'LOGIN' || appState === 'QUERY_LOGIN'
    ?
      <Login
        user={user}
        querying={appState === 'QUERY_LOGIN'}
        errorMessage={errorMessage}
        onLogin={ async (userName, password) => {
          const loginData = await doLogIn(userName, password);
          if (loginData.loginState === 'LOGGED_IN') {
            dispatch({ type: 'SET_USER', user: {userName, password} });
            //1. получить все организации с ролью в этой организации
            //если есть, где я админ, выводить список организаций для редактирования
            //иначе - profile со списком организаций, где я пользователь, и информацией по пользователю
            const userParams = await doGetCompanies();
            if (userParams.state === 'RECEIVED_COMPANIES') {
              dispatch({ type: 'SET_COMPANIES', companies: userParams.companies });
              dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
            } else {
              dispatch({ type: 'SET_ERROR', errorMessage: userParams.errorMessage })
            }
            const adminCompanies = userParams.companies?.filter(comp => comp.userRole === 'Admin')
            console.log(adminCompanies);
            if (adminCompanies?.length)
              dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
            else
              dispatch({ type: 'SET_STATE', appState: 'PROFILE' });
          } else {
            dispatch({ type: 'SET_ERROR', errorMessage: loginData.errorMessage })
          }
        }}
        onSetSignUp={ () => dispatch({ type: 'SET_STATE', appState: 'SIGNUP'}) }
        onClearError={ () => dispatch({ type: 'SET_ERROR', errorMessage: undefined}) }
      />
    :
      appState === 'SIGNUP' || appState === 'QUERY_SIGNUP'
      ?
        <SignUp
          querying={appState === 'QUERY_SIGNUP'}
          errorMessage={errorMessage}
          onSignUp={ async (userName, password) => {
            const signUpData = await doSignUp(userName, password);
            if (signUpData.loginState === 'SIGNED_UP') {
              dispatch({ type: 'SET_USER', user: {userName, password} });
              dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
            } else {
              dispatch({ type: 'SET_ERROR', errorMessage: signUpData.errorMessage })
            }
          }}
          onClearError={ () => dispatch({ type: 'SET_ERROR', errorMessage: undefined}) }
        />
      : user
        ?
        <div>
          <Menu
            userName={user.userName}
            querying={appState === 'QUERY_LOGOUT'}
            errorMessage={errorMessage}
            onEditProfile={ () => dispatch({ type: 'SET_STATE', appState: 'PROFILE' }) }
            onLogOut={ async () => {
              const logOutData = await doLogOut();
              if (logOutData.loginState === 'LOGGED_OUT') {
                dispatch({ type: 'SET_USER', user: undefined});
                dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
              } else {
                dispatch({ type: 'SET_ERROR', errorMessage: logOutData.errorMessage })
              }
            }}
            onClearError={ () => dispatch({ type: 'SET_ERROR', errorMessage: undefined}) }
            onEditCompany={ () => dispatch({ type: 'SET_STATE', appState: 'CREATE_COMPANY'}) }
          />
          { appState === 'ADMIN'
            ?
              <AdminBox
                onCreateCompany={ () => dispatch({ type: 'SET_STATE', appState: 'CREATE_COMPANY'}) }
                companies={companies?.filter(comp => comp.userRole === 'Admin').map(comp => comp.name)}
                onClearError={ () => dispatch({ type: 'SET_ERROR', errorMessage: undefined}) }
                onSelectCompany={ (companyName) => {
                  dispatch({ type: 'SET_STATE', appState: 'CREATE_COMPANY'});
                  dispatch({ type: 'SET_COMPANY', companyName})
                }}
              />
            : appState === 'CREATE_COMPANY'
              ?
                <Company
                  isCreate={appState === 'CREATE_COMPANY'}
                  companyName={companyName}
                  users={users}
                  onCreateCompany={ async (name) => {
                    const companyData = await doCreateCompany(name);
                    if (companyData.CompanyState === 'CREATED') {
                      dispatch({ type: 'ADD_COMPANY', company: {name, userRole: 'Admin'} });
                      dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
                    } else {
                      dispatch({ type: 'SET_ERROR', errorMessage: companyData.errorMessage })
                    }
                  }}
                   onEditCompany={ () =>{ //async (oldName, newName) => {
                  //   const orgData = await doCreateCompany(oldName, newName);
                  //   if (orgData.CompanyState === 'EDITED') {
                  //     dispatch({ type: 'EDIT_Company', oldName, newName });
                  //     dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
                  //   } else {
                  //     dispatch({ type: 'SET_ERROR', errorMessage: orgData.errorMessage })
                  //   }
                  }}
                />
              :
                <Profile
                  user={user}
                  isEditOK={appState === 'SAVED_PROFILE'}
                  onClearEditOK={ () => dispatch({ type: 'SET_STATE', appState: 'PROFILE' }) }
                  onEditProfile={async (user) => {
                    const userParamsData = await doEditUser(user);
                    if (userParamsData.state === 'EDITED_USER') {
                      dispatch({ type: 'SET_USER', user});
                      dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
                    } else {
                      dispatch({ type: 'SET_ERROR', errorMessage: userParamsData.errorMessage });
                      dispatch({ type: 'SET_STATE', appState: 'PROFILE' });
                    }
                  }}
                  onClearError={ () => dispatch({ type: 'SET_ERROR', errorMessage: undefined}) }
                />
          }

        </div>
      :
        <div>Тест</div>
  );
};

export default App;
