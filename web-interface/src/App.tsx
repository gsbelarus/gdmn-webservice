import React, { useReducer, useCallback, useEffect } from 'react';
import { IUser, IUserCompany, IDevice } from './types';
import { Login } from './components/Login';
import { useLogin } from './useLogin';
import { Profile } from './components/Profile';
import { Menu } from './components/Menu';
import { AdminBox } from './components/AdminBox';
import { SignUp } from './components/SignUp';
import { CompanyBox } from './components/CompanyBox';
import { useCompany } from './useCompany';
import { useUserParams } from './useUserParams';
import { useAdmin } from './useAdmin';
import { Company } from './components/Company';
import { User } from './components/User';
import { ModalBox } from './components/ModalBox';

type AppState = 'LOGIN' | 'QUERY_LOGIN' | 'QUERY_LOGOUT' | 'SIGNUP' | 'SIGNUP_CODE' | 'QUERY_SIGNUP' | 'PROFILE' | 'SAVED_PROFILE'
  | 'ADMIN' | 'CREATE_COMPANY' | 'UPDATE_COMPANY' | 'CREATE_USER' | 'CREATE_CODE' | 'UPDATE_USER' ;

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
  currentCompany?: IUserCompany;
  currentUser?: IUser;
  currentCompanies?: IUserCompany[];
  devices?: IDevice[];
  companyUsers?: IUser[];
  allUsers?: IUser[];
  errorMessage?: string;
  isAdmin?: boolean;
};

type Action = { type: 'SET_STATE', appState: AppState }
  | { type: 'SET_USER', user?: IUser }
  | { type: 'SET_COMPANY_USERS', companyUsers?: IUser[] }
  | { type: 'SET_ALL_USERS', allUsers?: IUser[] }
  | { type: 'CREATE_COMPANY', company: IUserCompany }
  | { type: 'SET_CURRENT_COMPANY', company?: IUserCompany }
  | { type: 'SET_COMPANIES', companies?: IUserCompany[] }
  | { type: 'SET_CURRENT_USER', user?: IUser }
  | { type: 'SET_IS_ADMIN', isAdmin?: boolean }
  | { type: 'UPDATE_COMPANY', companyId: string, companyName: string }
  | { type: 'SET_CURRENT_COMPANIES', companies?: IUserCompany[] }
  | { type: 'SET_DEVICES', devices?: IDevice[] }
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
    case 'CREATE_COMPANY': {
      const { company } = action;
      return {
        ...state,
        companies: state.companies ? [...state.companies, company] : [company]
      }
    }
    case 'UPDATE_COMPANY': {
      const { companyId, companyName } = action;
      return {
        ...state,
        companies: state.companies?.map(comp => comp.companyId === companyId ? {...comp, companyName} : comp)
      }
    }
    case 'SET_COMPANIES': {
      const { companies } = action;
      return {
        ...state,
        companies
      }
    }
    case 'SET_CURRENT_COMPANY': {
      const { company } = action;
      return {
        ...state,
        currentCompany: company
      }
    }
    case 'SET_CURRENT_USER': {
      const { user } = action;
      return {
        ...state,
        currentUser: user
      }
    }
    case 'SET_IS_ADMIN': {
      const { isAdmin } = action;
      return {
        ...state,
        isAdmin: isAdmin
      }
    }
    case 'SET_CURRENT_COMPANIES': {
      const { companies } = action;
      return {
        ...state,
        currentCompanies: companies
      }
    }
    case 'SET_DEVICES': {
      const { devices } = action;
      return {
        ...state,
        devices
      }
    }
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [login, loginApi] = useLogin();
  const [company, doCreateCompany, doUpdateCompany] = useCompany();
  const [userParams, doGetCompanies, doUpdateUser] = useUserParams();
  const [admin, doGetUsers, doGetUsersByCompany, doGetCompany, doCreateCode, doCreateUser, doGetDevicesByUser] = useAdmin();
  const [{ appState, user, companies, currentCompany, companyUsers, allUsers, errorMessage, isAdmin, currentUser, currentCompanies, devices }, dispatch] = useReducer(reducer, {
    appState: 'LOGIN'
  });
  console.log(user);
  console.log(currentUser);
  console.log(appState);

  const handleSetError = useCallback((errorMessage) => {
    dispatch({ type: 'SET_ERROR', errorMessage})
  }, [dispatch]);

  const handleSetAdmin = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
  }, [dispatch]);

  const handleGetComanies = useCallback((userId: string) => {
    //if (user) {
      const func = async (userId: string) => {
        const userParams = await doGetCompanies(userId);
        console.log(userParams);
        if (userParams.state === 'RECEIVED_COMPANIES') {
          dispatch({ type: 'SET_COMPANIES', companies: userParams.companies });
          dispatch({ type: 'SET_STATE', appState: 'LOGIN' })
        } else {
          dispatch({ type: 'SET_ERROR', errorMessage: userParams.errorMessage })
        }
        const adminCompanies = userParams.companies?.filter(comp => comp.userRole)
        console.log(adminCompanies);
        if (adminCompanies?.length) {
          dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
          dispatch({ type: 'SET_IS_ADMIN', isAdmin: true });
        } else
          dispatch({ type: 'SET_STATE', appState: 'PROFILE' });
      };
      func(userId);
  //  }
  }, [dispatch, doGetCompanies]);

  useEffect(() => {
    if (!user) {
      const func = async () => {
        const userParams = await loginApi.doGetMe();
        console.log(userParams);
        if (userParams.loginState === 'GOT_ME') {
          if (userParams.userName && userParams.userId) {
            dispatch({ type: 'SET_USER', user: {userName: userParams.userName, userId: userParams.userId}});
            handleGetComanies(userParams.userId);
          }
        } else {
        }
      };
      func();
    }
  }, [dispatch, loginApi, handleGetComanies, user])

  const handleClearEditOK = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'PROFILE' })
  }, [dispatch]);

  const handleUpdateUserProfile = useCallback((user: IUser) => {
    const func = async (user: IUser) => {
      const userParamsData = await doUpdateUser(user);
      if (userParamsData.state === 'EDITED_USER') {
        dispatch({ type: 'SET_USER', user});
        dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
      } else {
        handleSetError(userParamsData.errorMessage);
        dispatch({ type: 'SET_STATE', appState: 'PROFILE' });
      }
    };
    func(user);
  }, [dispatch, doUpdateUser, handleSetError]);

  const handleUpdateCurrentUserProfile = useCallback((cur_user: IUser) => {
    const func = async (cur_user: IUser) => {
      const userParamsData = await doUpdateUser(cur_user);
      if (userParamsData.state === 'EDITED_USER') {
        dispatch({ type: 'SET_CURRENT_USER', user: cur_user});
        dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
      } else {
        handleSetError(userParamsData.errorMessage);
        dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
      }
    };
    func(cur_user);
  }, [dispatch, doUpdateUser, handleSetError]);

  const handleClearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', errorMessage: undefined})
  }, [dispatch]);

  const handleLogin = useCallback((userName: string, password: string) => {
    const func = async (userName: string, password: string) => {
      const loginData = await loginApi.doLogIn(userName, password);
      if (loginData.loginState === 'LOGGED_IN' && loginData.userId) {
        dispatch({ type: 'SET_USER', user: {userName, password, userId: loginData.userId}});
        //1. получить все организации с ролью в этой организации
        //если есть, где я админ, выводить список организаций для редактирования
        //иначе - profile со списком организаций, где я пользователь, и информацией по пользователю
        handleGetComanies(loginData.userId);
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: loginData.errorMessage })
      }
    };
    func(userName, password);
  }, [dispatch, loginApi, handleGetComanies]);

  const handleSignUp = useCallback((userName: string, password: string) => {
    const func = async (userName: string, password: string) => {
      const signUpData = await loginApi.doSignUp(userName, password);
      if (signUpData.loginState === 'SIGNED_UP' && signUpData.code) {
        dispatch({ type: 'SET_USER', user: {userName, password, code: signUpData.code} });
        dispatch({ type: 'SET_STATE', appState: 'SIGNUP_CODE' })
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

  const handleGetUsersByCompany = useCallback((companyId: string) => {
    const func = async (companyId: string) => {
      dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY'});
      const usersData = await doGetUsersByCompany(companyId);
      if (usersData.adminState === 'RECEIVED_USERS_BY_COMPANY') {
        dispatch({ type: 'SET_COMPANY_USERS', companyUsers: usersData.users});
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: usersData.errorMessage })
      }
    };
    func(companyId);
  }, [dispatch, doGetUsersByCompany]);

  const handleSelectCompany = useCallback((companyId: string) => {
    const func = async (companyId: string) => {
      const companyData = await doGetCompany(companyId);
      if (companyData.adminState === 'RECEIVED_COMPANY') {
        dispatch({ type: 'SET_CURRENT_COMPANY', company: companyData.company});
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: companyData.errorMessage })
      };
      handleGetUsersByCompany(companyId);
      dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY'});
    };
    func(companyId);
  }, [dispatch, doGetCompany, handleGetUsersByCompany]);


  const handleCreateCompany = useCallback((companyName: string) => {
    const func = async (companyName: string) => {
      const companyData = await doCreateCompany(companyName);
      if (companyData.companyState === 'CREATED') {
        dispatch({ type: 'CREATE_COMPANY', company: {companyName, companyId: companyName, userRole: 'Admin'} });
        dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
        dispatch({ type: 'SET_IS_ADMIN', isAdmin: true });
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: companyData.errorMessage })
      }
    };
    func(companyName);
  }, [dispatch, doCreateCompany]);

  const handleUpdateCompany = useCallback((companyId: string, companyName: string) => {
    const func = async (companyId: string, companyName: string) => {
      const companyData = await doUpdateCompany(companyId, companyName);
      if (companyData.companyState === 'UPDATED') {
        dispatch({ type: 'UPDATE_COMPANY', companyId, companyName });
        user?.userId && handleGetComanies(user.userId);
        dispatch({ type: 'SET_STATE', appState: 'ADMIN' })
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: companyData.errorMessage })
      }
    };
    func(companyId, companyName);
  }, [dispatch, doUpdateCompany, user, handleGetComanies]);

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

  const handleCreateUser = useCallback((new_user: IUser) => {
    if (currentCompany?.companyId) {
      const func = async (new_user: IUser, companyId: string) => {
        const adminData = await doCreateUser(new_user, companyId);
        if (adminData.adminState === 'CREATED_USER') {
          dispatch({ type: 'SET_CURRENT_USER', user: {...new_user, code: adminData.code} });
          dispatch({ type: 'SET_COMPANY_USERS', companyUsers: companyUsers ? [...companyUsers, {...new_user, code: adminData.code}] : [{...new_user, code: adminData.code}]});
          dispatch({ type: 'SET_STATE', appState: 'CREATE_CODE' });
        } else {
          dispatch({ type: 'SET_ERROR', errorMessage: adminData.errorMessage })
        }
      };
      func(new_user, currentCompany.companyId);
    }
  }, [dispatch, doCreateUser, companyUsers, currentCompany]);

  const handleCreateCode = useCallback(() => {
    if (currentUser?.userId) {
      const func = async (userId: string) => {
        const adminData = await doCreateCode(userId);
        if (adminData.adminState === 'CREATED_CODE') {
          dispatch({ type: 'SET_CURRENT_USER', user: {...currentUser, code: adminData.code} });
          dispatch({ type: 'SET_STATE', appState: 'CREATE_CODE' })
        } else {
          dispatch({ type: 'SET_ERROR', errorMessage: adminData.errorMessage })
        }
      };
      func(currentUser.userId);
    }
  }, [dispatch, doCreateCode, currentUser]);

  const handleSetCreateUser = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'CREATE_USER' })
  }, [dispatch]);

  const handleSetCurrentUser = useCallback((userId: string) => {
    const func = async (userId: string) => {
      const userParams = await doGetCompanies(userId);
      if (userParams.state === 'RECEIVED_COMPANIES') {
        dispatch({ type: 'SET_CURRENT_COMPANIES', companies: userParams.companies });
        dispatch({ type: 'SET_CURRENT_USER', user: companyUsers?.find(u => u.userId === userId) });
        dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: userParams.errorMessage })
      }
    };
    func(userId);
    console.log('111111');
    handleGetDevicesByUser(userId);

  }, [dispatch, companyUsers, doGetCompanies]);

  const handleGetDevicesByUser = useCallback((userId: string) => {
    const func = async (userId: string) => {
      const adminParams = await doGetDevicesByUser(userId);
      if (adminParams.adminState === 'RECEIVED_DEVICES_BY_USER') {
        console.log(22222);
        dispatch({ type: 'SET_DEVICES', devices: adminParams.devices });
        dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
      } else {
        dispatch({ type: 'SET_ERROR', errorMessage: adminParams.errorMessage })
      }
    };
    func(userId);
  }, [dispatch, doGetDevicesByUser]);

  const handleSetUpdateUser = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
  }, [dispatch]);

  const handleSetLogin = useCallback(() => {
    dispatch({ type: 'SET_STATE', appState: 'LOGIN' });
  }, [dispatch]);

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
      :  user?.code && appState === 'SIGNUP_CODE'
        ?
          <ModalBox
            title={'Код для активации устройства'}
            text={user.code}
            onClose={handleSetLogin}
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
            onGetCompanies={handleSetAdmin}
            onCreateUser={appState === 'UPDATE_COMPANY' ? handleSetCreateUser : undefined}
            onCreateCode={appState === 'UPDATE_USER' ? handleCreateCode : undefined}
            isAdmin={isAdmin}
          />
          { appState === 'ADMIN' && companies
            ?
             <AdminBox
                onCreateCompany={handleSetCreateCompany}
                companies={companies?.filter(comp => comp.userRole)}
                onClearError={handleClearError}
                onSelectCompany={handleSelectCompany}
              />

            : appState === 'CREATE_COMPANY'
              ?
                <Company
                  onEditCompany={handleCreateCompany}
                  onClearError={handleClearError}
                />
                : appState === 'CREATE_USER'
                  ?
                    <User
                      onEditProfile={handleCreateUser}
                      onClearError={handleClearError}
                    />
                  : appState === 'UPDATE_COMPANY' && currentCompany
                    ?
                      <CompanyBox
                        companyName={currentCompany.companyName}
                        companyId={currentCompany.companyId}
                        users={companyUsers}
                        allUsers={allUsers}
                        onUpdateCompany={handleUpdateCompany}
                        onGetAllUsers={handleGetAllUsers}
                        onClearError={handleClearError}
                        onSelectUser={handleSetCurrentUser}
                      />
                    : appState === 'UPDATE_USER' && currentUser
                      ?
                      <Profile
                        user={currentUser}
                        companies={currentCompanies}
                        devices={devices}
                        onClearEditOK={handleClearEditOK}
                        onEditProfile={handleUpdateCurrentUserProfile}
                        onClearError={handleClearError}
                      />
                      : appState === 'CREATE_CODE' && currentUser?.code
                      ?
                        <ModalBox
                          title={'Код для активации устройства'}
                          text={currentUser.code}
                          onClose={handleSetUpdateUser}
                        />
                      :
                        <Profile
                          user={user}
                          companies={companies}
                          isEditOK={appState === 'SAVED_PROFILE'}
                          onClearEditOK={handleClearEditOK}
                          onEditProfile={handleUpdateUserProfile}
                          onClearError={handleClearError}
                        />
          }

        </div>
      :
        <div>Тест</div>
  );
};

export default App;
