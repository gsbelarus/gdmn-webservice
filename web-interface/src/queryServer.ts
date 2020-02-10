import { QueryCommand, QueryResponse, INetworkError, ILoginResponse, IUserResponse, ICompaniesResponse, ISignUpResponse, ILogOutResponse, IAllUsersResponse, ICreateCodeResponse, IGetCompanyResponse, ICreateCompanyResponse, ICreateUserResponse, IUpdateCompanyResponse, IGetUserDevicesResponse, IUpdateUserResponse, IAddUserResponse, IGetCompanyUsersResponse, IUserNotAuthResponse, IRemoveCompanyUsersResponse, IUserByNameResponse, IRemoveDevicesResponse, IBlockDevicesResponse } from "./queryTypes";

export const queryServer = async (param: QueryCommand): Promise<QueryResponse> => {
  // посылаем на сервер переданную нам команду
  // и ждем ответ
  // все команды на сервер идут на один URL
  // уже сервер внутри смотрит какая команда пришла
  // и что-то делает
  // http://localhost/execute_command
  let resFetch;
  let res;
  let body;
  console.log(param.command);
  switch (param.command) {

    case 'GET_USER_DATA':
      resFetch = await fetch(`http://localhost:3649/api/me`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'USER',
          user: res.result
        } as IUserResponse;
      }
      if (res.status === 403) {
        return {
          type: 'USER_NOT_AUTHENTICATED'
        } as IUserNotAuthResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'LOGIN':
      body = JSON.stringify({
        userName: param.userName,
        password: param.password
      });
      resFetch = await fetch(`http://localhost:3649/api/login`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'LOGIN',
          userId: res.result
        } as ILoginResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'SIGNUP':
      body = JSON.stringify({
        userName: param.userName,
        password: param.password,
        creatorId: param.userName
      });
      resFetch = await fetch(`http://localhost:3649/api/signup`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'SIGNUP',
          user: res.result
        } as ISignUpResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'GET_COMPANIES':
      resFetch = await fetch(`http://localhost:3649/api/company/byUser?userId=${param.userId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'USER_COMPANIES',
          companies: res.result
        } as ICompaniesResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'GET_ALL_USERS':
      resFetch = await fetch(`http://localhost:3649/api/user/all`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'ALL_USERS',
          users: res.result //.map((r: any) => ({userId: r.id, userName: r.userName}))
        } as IAllUsersResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'GET_USER_BY_NAME':
      body = JSON.stringify({
        userName: param.userName,
        password: param.password
      });
      resFetch = await fetch(`http://localhost:3649/api/user/byName`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();
      if (res.status === 200) {
        return {
          type: 'USER_BY_NAME',
          user: res.result
        } as IUserByNameResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'GET_COMPANY':
      resFetch = await fetch(`http://localhost:3649/api/company/profile?companyId=${param.companyId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'USER_COMPANY',
          company: {companyId: res.result.id, companyName: res.result.title}
        } as IGetCompanyResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'CREATE_COMPANY':
      resFetch = await fetch(`http://localhost:3649/api/company/new?title=${param.companyName}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'NEW_COMPANY',
          companyId: res.result
        } as ICreateCompanyResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'UPDATE_COMPANY':
      body = JSON.stringify({
        id: param.companyId,
        title: param.companyName
      });
      resFetch = await fetch(`http://localhost:3649/api/company/editeProfile`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'UPDATE_COMPANY'
        } as IUpdateCompanyResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'UPDATE_USER':

      body = JSON.stringify(param.user);

      resFetch = await fetch(`http://localhost:3649/api/user/edite`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'UPDATE_USER'
        } as IUpdateUserResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'ADD_USER':
      body = JSON.stringify({
        companyId: param.companyId,
        userId: param.userId
      });
      resFetch = await fetch(`http://localhost:3649/api/user/addCompany`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'ADD_USER'
        } as IAddUserResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'CREATE_CODE':
      resFetch = await fetch(`http://localhost:3649/api/device/getActivationCode?user=${param.userId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'USER_CODE',
          code: res.result
        } as ICreateCodeResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'CREATE_USER':
      body = JSON.stringify({
        ...param.user,
        companies: [param.companyId],
        creatorId: param.creatorId
      });
      resFetch = await fetch(`http://localhost:3649/api/signup`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'NEW_USER',
          user: res.result
        } as ICreateUserResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'LOGOUT':
      resFetch = await fetch(`http://localhost:3649/api/signout`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'LOGOUT',
        } as ILogOutResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'GET_USER_DEVICES':
      resFetch = await fetch(`http://localhost:3649/api/device/byUser?userId=${param.userId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'USER_DEVICES',
          devices: res.result
        } as IGetUserDevicesResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'GET_COMPANY_USERS':
      resFetch = await fetch(`http://localhost:3649/api/user/byCompany?companyId=${param.companyId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'COMPANY_USERS',
          users: res.result
        } as IGetCompanyUsersResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'REMOVE_COMPANY_USERS':
      body = JSON.stringify({
        users: param.userIds,
        companyId: param.companyId
      });
      resFetch = await fetch(`http://localhost:3649/api/user/removeUsersFromCompany`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'REMOVE_COMPANY_USERS'
        } as IRemoveCompanyUsersResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'REMOVE_DEVICES':
      body = JSON.stringify({
        uIds: param.uIds,
        userId: param.userId
      });

      resFetch = await fetch(`http://localhost:3649/api/device/remove`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'REMOVE_DEVICES'
        } as IRemoveDevicesResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

    case 'BLOCK_DEVICES':
      body = JSON.stringify({
        uIds: param.uIds,
        userId: param.userId
      });

      resFetch = await fetch(`http://localhost:3649/api/device/lock`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.status === 200) {
        return {
          type: 'BLOCK_DEVICES'
        } as IBlockDevicesResponse;
      }
      return {
        type: 'ERROR',
        message: `${res.status} - ${res.result}`
      } as INetworkError;

  };

};