import React, { useReducer, useCallback, useEffect } from 'react';
import { IUser, IUserCompany, IDevice } from './types';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Menu } from './components/Menu';
import { AdminBox } from './components/AdminBox';
import { SignUp } from './components/SignUp';
import { CompanyBox } from './components/CompanyBox';
import { Company } from './components/Company';
import { User } from './components/User';
import { ModalBox } from './components/ModalBox';
import { SystemUser } from './components/SystemUser';
import { queryServer } from './queryServer';

type AppState = 'LOGIN' | 'QUERY_LOGIN' |'QUERY_LOGOUT' | 'SIGNUP' | 'SIGNUP_CODE' | 'QUERY_SIGNUP' | 'PROFILE' | 'SAVED_PROFILE'
  | 'ADMIN' | 'CREATE_COMPANY' | 'UPDATE_COMPANY' | 'CREATE_USER' | 'ADD_USER_FROM_SYSTEM' | 'CREATE_CODE' | 'UPDATE_USER' ;

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

  activationCode?: string;
  company?: IUserCompany;
  companies?: IUserCompany[];
  devices?: IDevice[];
  currentUser?: IUser;
  currentCompanies?: IUserCompany[];
  currentDevices?: IDevice[];
  companyUsers?: IUser[];
  allUsers?: IUser[];
  errorMessage?: string;
  isAdmin?: boolean;
  needReReadCompanies?: boolean;
  needReReadUsers?: boolean;
  needReReadUserData?: boolean;
};

type Action = { type: 'SET_STATE', appState: AppState }
  | { type: 'SET_USER', user?: IUser, needReReadCompanies?: boolean, needReReadUserData?: boolean }
  | { type: 'SET_ACTIVATION_CODE', code?: string }
  | { type: 'SET_COMPANY_USERS', companyUsers?: IUser[] }
  | { type: 'SET_ALL_USERS', allUsers?: IUser[] }
  | { type: 'CREATE_COMPANY', company: IUserCompany }
  | { type: 'SET_COMPANY', company?: IUserCompany, needReReadUsers?: boolean }
  | { type: 'SET_COMPANIES', companies?: IUserCompany[] }
  | { type: 'SET_CURRENT_COMPANIES', companies?: IUserCompany[] }
  | { type: 'SET_CURRENT_USER', user?: IUser }
  | { type: 'SET_IS_ADMIN', isAdmin?: boolean }
  | { type: 'UPDATE_COMPANY', companyId: string, companyName: string }
  | { type: 'SET_DEVICES', devices?: IDevice[] }
  | { type: 'SET_CURRENT_DEVICES', devices?: IDevice[] }
  | { type: 'SET_ERROR', errorMessage?: string };

/*

    Когда нам надо с сервера получать список организаций?

    1. Сразу после успешного логина. Получаем список и храним его в стэйте App.
       Используем этот список при отрисовке на экране и прочих действиях.

    2. При переходе на страницу просмотр профиля мы перечитываем список организаций
       на случай, если он поменялся где-то еще (например, с другого компьютера).

    3. При переходе на страницу Администратор (там есть раздел мои организации).

    Все вышеперечисленные случаи обрабатываются в редусере и устанавливается
    соответстувующий флаг needReReadCompanies.

*/

/*
  Получить данные по пользователю надо:
  1. При открытии приложения, если раньше был совершен вход
  2. Если был совершен выход (user === undefined) и пользователь логинится
*/

const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case 'SET_STATE': {
      return {
        ...state,
        appState: action.appState,
      //  needReReadCompanies: state.needReReadCompanies || (state.appState !== action.appState && (action.appState === 'LOGIN' ))
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
      const { user, needReReadCompanies, needReReadUserData } = action;
      return {
        ...state,
        user,
        needReReadCompanies,
        needReReadUserData,
        currentUser: undefined
      }
    }
    case 'SET_ACTIVATION_CODE': {
      return {
        ...state,
        activationCode: action.code
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
      /**
       * При загрузке списка компаний, мы проверяем есть ли среди них
       * хотя бы одна, для которой текущий пользователь является администратором
       * и выставляем соответствующий флаг в стэйте.
       */

      const { companies } = action;
      const isAdmin = companies?.some( c => c.userRole === 'Admin' );
      return {
        ...state,
        companies,
        needReReadCompanies: false,
        isAdmin
      }
    }
    case 'SET_CURRENT_COMPANIES': {
      const { companies } = action;
      return {
        ...state,
        currentCompanies: companies
      }
    }
    case 'SET_COMPANY': {
      const { company, needReReadUsers } = action;
      return {
        ...state,
        company,
        needReReadUsers
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
        isAdmin
      }
    }

    case 'SET_DEVICES': {
      const { devices } = action;
      return {
        ...state,
        devices
      }
    }

    case 'SET_CURRENT_DEVICES': {
      const { devices } = action;
      return {
        ...state,
        currentDevices: devices
      }
    }

    default:
      return state;
  }
};

const App: React.FC = () => {
  const [{ appState, user, activationCode, companies, currentCompanies, company, companyUsers, allUsers, errorMessage, isAdmin, currentUser, devices, currentDevices, needReReadCompanies, needReReadUsers, needReReadUserData }, dispatch] = useReducer(reducer, {
    appState: 'LOGIN',
    needReReadUserData: true

  });

  console.log('appState: ' + appState);

  const handleSetError = useCallback((errorMessage?: string) => {
    dispatch({ type: 'SET_ERROR', errorMessage})
  }, [dispatch]);

  const handleSetAppState = useCallback((appState: AppState) => {
    dispatch({ type: 'SET_STATE', appState})
  }, [dispatch]);

  const handleLogin = (userName: string, password: string) => {
    console.log('handleLogin');
    queryServer({ command: 'LOGIN', userName, password })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'LOGIN') {
          dispatch({ type: 'SET_USER', needReReadUserData: true });
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  const handleSignUp = (userName: string, password: string) => {
    queryServer({ command: 'SIGNUP', userName, password })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'SIGNUP') {
          dispatch({ type: 'SET_USER', user: data.user });
          dispatch({ type: 'SET_STATE', appState: 'LOGIN' });
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  const handleLogOut = () => {
    queryServer({ command: 'LOGOUT' })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'LOGOUT') {
          dispatch({ type: 'SET_COMPANY', company: undefined});
          dispatch({ type: 'SET_USER', user: undefined});
          dispatch({ type: 'SET_IS_ADMIN', isAdmin: undefined});
          dispatch({ type: 'SET_STATE', appState: 'LOGIN' });
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  const handleGetAllUsers = () => {
    queryServer({ command: 'GET_ALL_USERS' })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'ALL_USERS') {
          dispatch({ type: 'SET_ALL_USERS', allUsers: data.users.filter(u => u.id !== user?.id) });
          dispatch({ type: 'SET_STATE', appState: 'ADD_USER_FROM_SYSTEM' })
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  const handleCreateCode = () => {
    if (currentUser?.id) {
      queryServer({ command: 'CREATE_CODE', userId: currentUser.id })
        .then( data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'USER_CODE') {
            dispatch({ type: 'SET_ACTIVATION_CODE', code: data.code });
            dispatch({ type: 'SET_STATE', appState: 'CREATE_CODE' })
          }
        })
        .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
    }
  };

  const handleSelectCompany = (companyId: string) => {
    queryServer({ command: 'GET_COMPANY', companyId })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'USER_COMPANY') {
          dispatch({ type: 'SET_COMPANY', company: data.company, needReReadUsers: true });
          dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  const handleCreateCompany = (companyName: string) => {
    queryServer({ command: 'CREATE_COMPANY', companyName })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'NEW_COMPANY') {
          const newCompany: IUserCompany = {companyName, companyId: companyName, userRole: 'Admin'}
          dispatch({ type: 'SET_COMPANY', company: newCompany });
          dispatch({ type: 'SET_COMPANIES', companies: (companies ? [...companies, newCompany] : [newCompany]).filter(c => c.userRole === 'Admin')  });
          dispatch({ type: 'SET_IS_ADMIN', isAdmin: true });
          dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  const handleCreateUser = (new_user: IUser) => {
    if (company?.companyId && user?.id) {
      queryServer({ command: 'SIGNUP', userName: new_user.userName, password: new_user.password?? '', companyId: company.companyId, creatorId: user.id })
        .then( data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'SIGNUP') {
            dispatch({ type: 'SET_CURRENT_USER', user: data.user });
            dispatch({ type: 'SET_COMPANY_USERS', companyUsers: companyUsers ? [...companyUsers, data.user] : [data.user]});
            dispatch({ type: 'SET_CURRENT_DEVICES', devices: [] });
            dispatch({ type: 'SET_COMPANIES', companies: companies?.filter(c => c.companyId === company.companyId) });
            dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
          }
        })
        .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
    }
  };

  const handleAddSystemUser = (userId: string) => {
    const systemUuser = allUsers?.find(item => item.id === userId);
    if (company?.companyId && systemUuser) {
      queryServer({ command: 'UPDATE_USER', user: { ...systemUuser, companies: systemUuser.companies ? [...systemUuser.companies, company?.companyId] : [company?.companyId] } })
        .then( data => {
          if (data.type === 'ERROR') {
            dispatch({ type: 'SET_ERROR', errorMessage: data.message });
          }
          else if (data.type === 'UPDATE_USER') {
            const addedUser = allUsers?.find(u => u.id === userId);
            if (addedUser) {
              dispatch({ type: 'SET_CURRENT_USER', user: {...addedUser} });
              dispatch({ type: 'SET_COMPANY_USERS', companyUsers: companyUsers ? [...companyUsers, addedUser] : [addedUser] });
              dispatch({ type: 'SET_STATE', appState: 'UPDATE_COMPANY' });
            }
          }
        })
        .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
    }
  };

  const handleUpdateCompany = (companyId: string, companyName: string) => {
    queryServer({ command: 'UPDATE_COMPANY', companyId, companyName })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'UPDATE_COMPANY') {
          dispatch({ type: 'UPDATE_COMPANY', companyId, companyName });
          dispatch({ type: 'SET_STATE', appState: 'ADMIN' });
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  const handleGetCompanies = (companies: string[], userId: string, type: 'SET_COMPANIES' | 'SET_CURRENT_COMPANIES') => {
    queryServer({ command: 'GET_COMPANIES' })
    .then( data => {
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      }
      else if (data.type === 'USER_COMPANIES') {
        const getCompanies = data.companies
          .filter(item => companies.some(company => company === item.id ))
          .map(item => {return {companyId: item.id, companyName: item.title, userRole: item.admin === userId ? 'Admin' : undefined} as IUserCompany});
          dispatch({ type: type, companies: getCompanies });
        }
    })
    .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  const handleGetUserDevices = (userId: string, type: 'SET_DEVICES' | 'SET_CURRENT_DEVICES') => {
    queryServer({ command: 'GET_USER_DEVICES', userId })
    .then( data => {
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      }
      else if (data.type === 'USER_DEVICES') {
        dispatch({ type, devices: data.devices })
      }
    })
    .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };

  // const handleGetUserNoActivatedDevices = (userId: string, type: 'SET_DEVICES' | 'SET_CURRENT_DEVICES') => {
  //   queryServer({ command: 'GET_USER_DEVICES', userId })
  //   .then( data => {
  //     if (data.type === 'ERROR') {
  //       dispatch({ type: 'SET_ERROR', errorMessage: data.message });
  //     }
  //     else if (data.type === 'USER_DEVICES') {
  //       // let codes: IDevice[] | undefined = companyUsers?.filter(u => u.code && u.userId === userId).map(u => ({uid: 'Неактивированное устройство', state: 'Awaiting activation'}));
  //       // codes = codes && data.devices.concat(codes);
  //       // console.log(codes);
  //       if (data.devices) {
  //         dispatch({ type, devices: data.devices })
  //       }
  //     }
  //   })
  //   .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  // };

  const handleUpdateUser = (updateUser: IUser, type: 'SET_USER' | 'SET_CURRENT_USER') => {
    queryServer({ command: 'UPDATE_USER', user: updateUser })
    .then( data => {
      if (data.type === 'ERROR') {
        dispatch({ type: 'SET_ERROR', errorMessage: data.message });
      }
      else if (data.type === 'UPDATE_USER') {
        dispatch({ type, user: updateUser});
        dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
      }
    })
    .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
  };


  const handleRemoveCompanyUsers = (userIds: string[]) => {
    if (company?.companyId) {
      const uIds = userIds.filter(u => u !== user?.id);
      uIds.forEach(uId => {
        queryServer({ command: 'GET_USER', userId: uId })
          .then( data => {
            if (data.type === 'ERROR') {
              dispatch({ type: 'SET_ERROR', errorMessage: data.message });
            }
            else if (data.type === 'GET_USER') {
              if(data.user && data.user.companies) {
                queryServer({
                  command: 'UPDATE_USER',
                  user: {...data.user,  companies: data.user.companies.filter((item) => item !== company?.companyId)}
                })
                .then( data => {
                  if (data.type === 'ERROR') {
                    dispatch({ type: 'SET_ERROR', errorMessage: data.message });
                  }
                  else if (data.type === 'UPDATE_USER') {
                    dispatch({ type: 'SET_USER', user});
                    dispatch({ type: 'SET_STATE', appState: 'SAVED_PROFILE' });
                  }
                })
                .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
              }
            }
          })
          .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
      });
    }
  };

  const handleRemoveDevices = (uIds: string[]) => {
    if (currentUser?.id) {
      queryServer({ command: 'REMOVE_DEVICES', uIds, userId: currentUser?.id })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'REMOVE_DEVICES') {
          dispatch({ type: 'SET_CURRENT_DEVICES', devices: currentDevices?.filter(c => uIds.findIndex(u => u === c.uid) === -1)});
          dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
    }
  };

  const handleBlockDevices = (uIds: string[], isUnBlock?: boolean) => {
    if (currentUser?.id) {
      queryServer({ command: 'BLOCK_DEVICES', uIds, userId: currentUser?.id, isBlock: isUnBlock?? true })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'BLOCK_DEVICES') {
          dispatch({ type: 'SET_CURRENT_DEVICES', devices: currentDevices?.map(c => uIds.findIndex(u => u === c.uid) > -1 ? {...c, state: !isUnBlock ? 'blocked' : 'active'} : c)});
          dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
    }
  };

  const handleGetCurrentUser = (userId: string) => {
    dispatch({ type: 'SET_CURRENT_USER', user: companyUsers?.find(u => u.id === userId) });
    dispatch({ type: 'SET_STATE', appState: 'UPDATE_USER' });
  };

  useEffect( () => {
    if (needReReadCompanies && user?.id) {
      console.log('useEffect: needReReadCompanies');
      handleGetCompanies(user.companies?? [], user.id, 'SET_COMPANIES');
      handleGetUserDevices(user.id, 'SET_DEVICES');
    }
  }, [needReReadCompanies, user]);

  useEffect( () => {
    if (currentUser?.id) {
      console.log('useEffect: currentUser');
      handleGetCompanies(currentUser.companies?? [], currentUser.id, 'SET_CURRENT_COMPANIES');
      handleGetUserDevices(currentUser.id, 'SET_CURRENT_DEVICES');
    }
  }, [currentUser]);

  useEffect( () => {
    console.log('useEffect: isAdmin = ' + isAdmin);
    if (isAdmin !== undefined) {
      dispatch({ type: 'SET_STATE', appState: isAdmin ? 'ADMIN' : 'PROFILE' });
    }
  }, [isAdmin]);

  useEffect(() => {
    if (needReReadUserData) {
      console.log('useEffect: needReReadUserData');
      queryServer({ command: 'GET_USER_DATA' })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'USER') {
          dispatch({ type: 'SET_USER', user: data.user, needReReadCompanies: true});
        } else if (data.type === 'USER_NOT_AUTHENTICATED') {
          dispatch({ type: 'SET_STATE', appState: 'LOGIN'});
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
    }
  }, [needReReadUserData])


  /**
   * Получить пользователей компании надо, когда
   * 1. Выбираем компанию для просмотра\редактирования
   */
  useEffect(() => {
    if (company?.companyId && needReReadUsers && user) {
      console.log('useEffect: company');
      queryServer({ command: 'GET_COMPANY_USERS', companyId: company.companyId })
      .then( data => {
        if (data.type === 'ERROR') {
          dispatch({ type: 'SET_ERROR', errorMessage: data.message });
        }
        else if (data.type === 'COMPANY_USERS') {
          dispatch({ type: 'SET_COMPANY_USERS', companyUsers: data.users.map(u => u.id === user?.id ? {...u, isAdmin: true} : u)});
        }
      })
      .catch( error => dispatch({ type: 'SET_ERROR', errorMessage: JSON.stringify(error) }) );
    } else {
      dispatch({ type: 'SET_COMPANY_USERS', companyUsers: undefined});
    }
  }, [company, needReReadUsers, user])

  return (
    appState === 'LOGIN' || appState === 'QUERY_LOGIN'
    ?
      <Login
        userName={user?.userName}
        password={user?.password}
        querying={appState === 'QUERY_LOGIN'}
        errorMessage={errorMessage}
        onLogin={handleLogin}
        onSetSignUp={() => handleSetAppState('SIGNUP')}
        onClearError={handleSetError}
      />
    :
      appState === 'SIGNUP' || appState === 'QUERY_SIGNUP'
      ?
        <SignUp
          querying={appState === 'QUERY_SIGNUP'}
          errorMessage={errorMessage}
          onSignUp={handleSignUp}
          onClearError={handleSetError}
        />
      :  appState === 'SIGNUP_CODE' && activationCode
        ?
          <ModalBox
            title={'Код для активации устройства'}
            text={activationCode}
            onClose={() => {
              dispatch({ type: 'SET_ACTIVATION_CODE' });
              handleSetAppState('LOGIN');
            }}
          />
      : user
        ?
        <div>
          <Menu
            userName={user.userName}
            querying={appState === 'QUERY_LOGOUT'}
            errorMessage={errorMessage}
            onEditProfile={() => handleSetAppState('PROFILE')}
            onLogOut={handleLogOut}
            onClearError={handleSetError}
            onCreateCompany={() => handleSetAppState('CREATE_COMPANY')}
            onGetCompanies={() => handleSetAppState('ADMIN')}
            onCreateUser={appState === 'UPDATE_COMPANY' ? () => handleSetAppState('CREATE_USER') : undefined}
            onAddUserFromSystem={appState === 'UPDATE_COMPANY' ? handleGetAllUsers : undefined}
            onCreateCode={(appState === 'UPDATE_USER' || appState === 'SAVED_PROFILE') ? handleCreateCode : undefined}
            isAdmin={isAdmin}
          />
          { appState === 'ADMIN' && companies
            ?
             <AdminBox
                companies={companies?.filter(comp => comp.userRole)}
                onClearError={handleSetError}
                onSelectCompany={handleSelectCompany}
              />

            : appState === 'CREATE_COMPANY'
              ?
                <Company
                  onUpdateCompany={handleCreateCompany}
                  onClearError={handleSetError}
                />
                : appState === 'CREATE_USER' && user?.id
                  ?
                    <User
                      user={{userName: '', creatorId: user.id}}
                      onEditProfile={handleCreateUser}
                      onClearError={handleSetError}
                      isCanEditUser={true}
                    />
                    : appState === 'ADD_USER_FROM_SYSTEM'
                    ?
                      <SystemUser
                        allUsers={allUsers}
                        companyUsers={companyUsers}
                        onAddUser={handleAddSystemUser}
                        onClearError={handleSetError}
                      />
                     : appState === 'UPDATE_COMPANY' && company
                    ?
                      <CompanyBox
                        companyName={company.companyName}
                        companyId={company.companyId}
                        users={companyUsers}
                        allUsers={allUsers}
                        onUpdateCompany={handleUpdateCompany}
                        onClearError={handleSetError}
                        onSelectUser={handleGetCurrentUser}
                        onRemoveUsersFromCompany={handleRemoveCompanyUsers}
                      />
                    : (appState === 'UPDATE_USER' || appState === 'SAVED_PROFILE') && currentUser
                      ?
                      <Profile
                        user={currentUser}
                        companies={currentCompanies}
                        devices={currentDevices}
                        onClearEditOK={() => handleSetAppState('PROFILE')}
                        onEditProfile={(user: IUser) => handleUpdateUser(user, 'SET_CURRENT_USER')}
                        onClearError={handleSetError}
                        isCanEditUser={currentUser.creatorId === user.id}
                        onRemoveDevices={handleRemoveDevices}
                        onBlockDevices={handleBlockDevices}
                      />
                      : appState === 'CREATE_CODE' && activationCode
                      ?
                        <ModalBox
                          title={'Код для активации устройства'}
                          text={activationCode}
                          onClose={() => {
                            dispatch({ type: 'SET_ACTIVATION_CODE' });
                            handleSetAppState('UPDATE_COMPANY');
                          }}
                        />
                      :
                        <Profile
                          user={user}
                          companies={companies}
                          devices={devices}
                          isEditOK={appState === 'SAVED_PROFILE'}
                          onClearEditOK={() => handleSetAppState('PROFILE')}
                          onEditProfile={(user: IUser) => handleUpdateUser(user, 'SET_USER')}
                          onClearError={handleSetError}
                          isCanEditUser={true}
                          // onRemoveDevices={handleRemoveDevices}
                          // onBlockDevices={handleBlockDevices}
                        />
          }

        </div>
      :
        <div>Тест</div>
  );
};

export default App;
