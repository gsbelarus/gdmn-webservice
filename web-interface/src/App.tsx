import React, { useReducer, useCallback, useEffect } from 'react';
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
import { useAdmin } from './useAdmin';

type AppState = 'LOGIN' | 'QUERY_LOGIN' | 'QUERY_LOGOUT' | 'SIGNUP' | 'QUERY_SIGNUP' | 'PROFILE' | 'SAVED_PROFILE' | 'ADMIN' | 'CREATE_COMPANY' | 'UPDATE_COMPANY';

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
  companyUsers?: IUser[];
  allUsers?: IUser[];
  errorMessage?: string;
};

type Action = { type: 'SET_STATE', appState: AppState }
  | { type: 'SET_USER', user?: IUser }
  | { type: 'SET_COMPANY_USERS', companyUsers?: IUser[] }
  | { type: 'SET_ALL_USERS', allUsers?: IUser[] }
  | { type: 'ADD_COMPANY', company: IUserCompany }
  | { type: 'SET_COMPANY', companyName: string }
  | { type: 'SET_COMPANIES', companies?: IUserCompany[] }
  | { type: 'UPDATE_COMPANY', oldName: string, newName: string }
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
    case 'SET_COMPANY_USERS': {
      const { companyUsers } = action;
      return {
        ...state,
        companyUsers
      }
    }
    case 'SET_ALL_USERS': {
      const { allUsers } = action;
      return {
        ...state,
        allUsers
      }
    }
    case 'ADD_COMPANY': {
      const { company } = action;
      return {
        ...state,
        companies: state.companies ? [...state.companies, company] : [company]
      }
    }
    case 'UPDATE_COMPANY': {
      const { oldName, newName } = action;
      return {
        ...state,
        companies: state.companies?.map(comp => comp.companyName === oldName ? {...comp, companyName: newName} : comp)
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
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [login, loginApi] = useLogin();
  const [company, doCreateCompany, doUpdateCompany] = useCompany();
  const [userParams, doGetCompanies, doEditUser] = useUserParams();
  const [admin, doGetUsers, doGetUsersByCompany] = useAdmin();
  const [{ appState, user, companies, companyName, companyUsers, allUsers, errorMessage }, dispatch] = useReducer(reducer, {
    appState: 'LOGIN'
  });
  console.log(appState);
  console.log(companies);

  const handleSetError = useCallback((errorMessage) => {
    dispatch({ type: 'SET_ERROR', errorMessage})
  }, [dispatch]);

  const handleGetComanies = useCallback((userName: string) => {
    //if (user) {
      const func = async (userName: string) => {
        const userParams = await doGetCompanies(userName);
        console.log(userParams);
        if (userParams.state === 'RECEIVED_COMPANIES') {
          dispatch({ type: 'SET_COMPANIES', companies: userParams.companies });
          dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
        } else {
          dispatch({ type: 'SET_ERROR', errorMessage: userParams.errorMessage })
        }
        const adminCompanies = userParams.companies?.filter(comp => comp.userRole)
        console.log(adminCompanies);
        if (adminCompanies?.length)
          dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
        else
          dispatch({ type: 'SET_STATE', appState: 'PROFILE' });
      };
      func(userName);
  //  }
  }, [dispatch, doGetCompanies]);

  useEffect(() => {
    if (!user) {
      const func = async () => {
        const userParams = await loginApi.doGetMe();
        console.log(userParams);
        if (userParams.loginState === 'GOT_ME') {
          if (userParams.userName) {
          //  console.log('SET_USER');
            dispatch({ type: 'SET_USER', user: {userName: userParams.userName}});
          //  dispatch({ type: 'SET_COMPANIES', companies: userParams.companies});
            handleGetComanies(userParams.userName);
          //  const adminCompanies = userParams.companies?.filter(comp => comp.userRole === 'Admin')
          //  if (adminCompanies?.length)
          //    dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
          //  else
          //    dispatch({ type: 'SET_STATE', appState: 'PROFILE' });
          }
        } else {
          //handleSetError(userParamsData.errorMessage);
          //dispatch({ type: 'SET_STATE', appState: 'PROFILE' });
        }
      };
      func();
    }
  }, [dispatch, loginApi, handleGetComanies, user])

  const handleClearEditOK = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'PROFILE' })
  }, [dispatch]);

  const handleEditUserProfile = useCallback((user: IUser) => {
    const func = async (user: IUser) => {
      const userParamsData = await doEditUser(user);
      if (userParamsData.state === 'EDITED_USER') {
        dispatch({ type: 'SET_USER', user});
        dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
      } else {
        handleSetError(userParamsData.errorMessage);
        dispatch({ type: 'SET_STATE', appState: 'PROFILE' });
      }
    };
    func(user);
  }, [dispatch, doEditUser, handleSetError]);

  const handleClearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', errorMessage: undefined})
  }, [dispatch]);

  const handleLogin = useCallback((userName: string, password: string) => {
    const func = async (userName: string, password: string) => {
      const loginData = await loginApi.doLogIn(userName, password);
      if (loginData.loginState === 'LOGGED_IN') {
        dispatch({ type: 'SET_USER', user: {userName, password}});
        //1. получить все организации с ролью в этой организации
        //если есть, где я админ, выводить список организаций для редактирования
        //иначе - profile со списком организаций, где я пользователь, и информацией по пользователю
        handleGetComanies(userName);
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: loginData.errorMessage })
      }
    };
    func(userName, password);
  }, [dispatch, loginApi, handleGetComanies]);

  const handleSignUp = useCallback((userName: string, password: string) => {
    const func = async (userName: string, password: string) => {
      const signUpData = await loginApi.doSignUp(userName, password);
      if (signUpData.loginState === 'SIGNED_UP') {
        dispatch({ type: 'SET_USER', user: {userName, password} });
        dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: signUpData.errorMessage })
      }
    }
    func(userName, password);
  }, [dispatch, loginApi]);

  const handleSetSignUp = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'SIGNUP'})
  }, []);

  const handleLogOut = useCallback(() => {
    const func = async () => {
      const logOutData = await loginApi.doLogOut();
      if (logOutData.loginState === 'LOGGED_OUT') {
        dispatch({ type: 'SET_USER', user: undefined});
        dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: logOutData.errorMessage })
      }
    };
    func();
  }, [dispatch, loginApi]);

  const handleEditProfile = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'PROFILE' })
  }, []);

  const handleSetCreateCompany = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'CREATE_COMPANY'})
  }, []);

  const handleSelectCompany = useCallback((companyName: string) => {
    const func = async (companyName: string) => {
      dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY'});
      dispatch({ type: 'SET_COMPANY', companyName});
      const adminData = await doGetUsersByCompany(companyName);
      if (adminData.adminState === 'RECEIVED_USERS_BY_COMPANY') {
        dispatch({ type: 'SET_COMPANY_USERS', companyUsers: adminData.users});
        //dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: adminData.errorMessage })
      }
    };
    func(companyName);
  }, [dispatch, doGetUsersByCompany]);

  const handleCreateCompany = useCallback((companyName: string) => {
    const func = async (companyName: string) => {
      const companyData = await doCreateCompany(companyName);
      if (companyData.companyState === 'CREATED') {
        dispatch({ type: 'ADD_COMPANY', company: {companyName, userRole: 'Admin'} });
        dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: companyData.errorMessage })
      }
    };
    func(companyName);
  }, [dispatch, doCreateCompany]);

  const handleUpdateCompany = useCallback((companyName: string) => {
    const func = async (companyName: string) => {
      const companyData = await doUpdateCompany(companyName);
      if (companyData.companyState === 'CREATED') {
        dispatch({ type: 'ADD_COMPANY', company: {companyName, userRole: 'Admin'} });
        dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: companyData.errorMessage })
      }
    };
    func(companyName);
  }, [dispatch, doCreateCompany]);

  const handleGetAllUsers = useCallback(() => {
    const func = async () => {
      const adminData = await doGetUsers();
      if (adminData.adminState === 'RECEIVED_USERS') {
        dispatch({ type: 'SET_ALL_USERS', allUsers: adminData.users});
        //dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: adminData.errorMessage })
      }
    };
    func();
  }, [dispatch, doGetUsers]);

  return (
    appState === 'LOGIN' || appState === 'QUERY_LOGIN'
    ?
      <Login
        user={user}
        querying={appState === 'QUERY_LOGIN'}
        errorMessage={errorMessage}
        onLogin={handleLogin}
        onSetSignUp={handleSetSignUp}
        onClearError={handleClearError}
      />
    :
      appState === 'SIGNUP' || appState === 'QUERY_SIGNUP'
      ?
        <SignUp
          querying={appState === 'QUERY_SIGNUP'}
          errorMessage={errorMessage}
          onSignUp={handleSignUp}
          onClearError={handleClearError}
        />
      : user
        ?
        <div>
          <Menu
            userName={user.userName}
            querying={appState === 'QUERY_LOGOUT'}
            errorMessage={errorMessage}
            onEditProfile={handleEditProfile}
            onLogOut={handleLogOut}
            onClearError={handleClearError}
            onCreateCompany={handleSetCreateCompany}
          />
          { appState === 'ADMIN' && companies
            ?
              <AdminBox
                onCreateCompany={handleSetCreateCompany}
                companies={companies?.filter(comp => comp.userRole).map(comp => comp.companyName)}
                onClearError={handleClearError}
                onSelectCompany={handleSelectCompany}
              />
            : (appState === 'CREATE_COMPANY' || appState === 'UPDATE_COMPANY')
              ?
                <Company
                  isCreate={appState === 'CREATE_COMPANY'}
                  companyName={companyName}
                  users={companyUsers}
                  onCreateCompany={handleCreateCompany}
                  onEditCompany={ () =>{ //async (oldName, newName) => {
                  //   const orgData = await doCreateCompany(oldName, newName);
                  //   if (orgData.CompanyState === 'EDITED') {
                  //     dispatch({ type: 'UPDATE_COMPANY', oldName: '', newName: '' });
                  //     dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
                  //   } else {
                  //     dispatch({ type: 'SET_ERROR', errorMessage: orgData.errorMessage })
                  //   }
                  }}
                  onGetAllUsers={handleGetAllUsers}
                />
              :
                <Profile
                  user={user}
                  companies={companies}
                  isEditOK={appState === 'SAVED_PROFILE'}
                  onClearEditOK={handleClearEditOK}
                  onEditProfile={handleEditUserProfile}
                  onClearError={handleClearError}
                />
          }

        </div>
      :
        <div>Тест</div>
  );
};

export default App;
