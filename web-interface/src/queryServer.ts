import { QueryCommand, QueryResponse, INetworkError, ILoginResponse, IUserResponse, ICompaniesResponse, ISignUpResponse, ILogOutResponse, IAllUsersResponse, ICreateCodeResponse, IGetCompanyResponse, ICreateCompanyResponse, ICreateUserResponse, IUpdateCompanyResponse, IGetUserDevicesResponse, IUpdateUserResponse, IAddUserResponse, IGetCompanyUsersResponse, IUserNotAuthResponse, IRemoveCompanyUsersResponse, IUserByNameResponse, IRemoveDevicesResponse, IBlockDevicesResponse } from "./queryTypes";

export const queryServer = async (param: QueryCommand): Promise<QueryResponse> => {
  // посылаем на сервер переданную нам команду
  // и ждем ответ
  // все команды на сервер идут на один URL
  // уже сервер внутри смотрит какая команда пришла
  // и что-то делает
  // http://localhost/execute_command
  const url: string = 'http://localhost:3649/api';
  const deviceId = "123";
  let resFetch;
  let res;
  let body;
  console.log(param.command);
  switch (param.command) {

    case 'GET_USER_DATA': {
      try {
        resFetch = await fetch(`${url}/auth/user?deviceId=${deviceId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
        res = await resFetch.json();

        if (res.result) {
          return {
            type: 'USER',
            user: res.data
          } as IUserResponse;
        }
        if (!res.result) {
          return {
            type: 'USER_NOT_AUTHENTICATED'
          } as IUserNotAuthResponse;
        }
        return {
          type: 'ERROR',
          message: res.error
        } as INetworkError;
      }
      catch (err) {
        if (err.response) {
          throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
      }
    }
    case 'LOGIN': {
      body = JSON.stringify({
        userName: param.userName,
        password: param.password
      });
      try {
        resFetch = await fetch(`${url}/auth/login?deviceId=${deviceId}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
        res = await resFetch.json();

        if (res.result) {
          return {
            type: 'LOGIN',
            userId: param.userName
          } as ILoginResponse;
        }
        return {
          type: 'ERROR',
          message: res.error
        } as INetworkError;
      }
      catch (err) {
        if (err.response) {
          throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
      }
    }
    case 'SIGNUP':
      body = JSON.stringify({
        userName: param.userName,
        password: param.password,
        companies: param.companyId ? [param.companyId] : undefined,
        creatorId: param.creatorId?? param.userName
      });
      resFetch = await fetch(`${url}/auth/signup`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'SIGNUP',
          user: res.data
        } as ISignUpResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;
    case 'GET_COMPANIES':
      resFetch = await fetch(`${url}/companies/${param.companyId}?deviceId=${deviceId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'USER_COMPANIES',
          company: {
            companyId: res.data.id,
            companyName: res.data.title,
            userRole: res.data.admin === param.userId ? 'Admin' : undefined
          }
        } as ICompaniesResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'GET_ALL_USERS':
      resFetch = await fetch(`${url}/users/?deviceId=${deviceId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'ALL_USERS',
          users: res.result //.map((r: any) => ({userId: r.id, userName: r.userName}))
        } as IAllUsersResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;
//TODO: удалить
    case 'GET_USER_BY_NAME':
      body = JSON.stringify({
        userName: param.userName,
        password: param.password
      });
      resFetch = await fetch(`${url}/users/byName`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();
      if (res.result) {
        return {
          type: 'USER_BY_NAME',
          user: res.data
        } as IUserByNameResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'GET_COMPANY':
      resFetch = await fetch(`${url}/companies/${param.companyId}?deviceId=${deviceId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'USER_COMPANY',
          company: {companyId: res.data.id, companyName: res.data.title}
        } as IGetCompanyResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'CREATE_COMPANY':
      body = JSON.stringify({
        title: param.companyName
      });
      resFetch = await fetch(`${url}/companies/?deviceId=${deviceId}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'NEW_COMPANY',
          companyId: res.data
        } as ICreateCompanyResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'UPDATE_COMPANY':
      body = JSON.stringify({
        title: param.companyName
      });
      resFetch = await fetch(`${url}/companies/${param.companyId}?deviceId=${deviceId}`, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'UPDATE_COMPANY'
        } as IUpdateCompanyResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'UPDATE_USER':

      body = JSON.stringify(param.user);

      resFetch = await fetch(`${url}/users/${param.user.id}?deviceId=${deviceId}`, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'UPDATE_USER'
        } as IUpdateUserResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;
//TODO: заменить этот метод на изменения пользователя
    case 'ADD_USER':
      body = JSON.stringify({
        companyId: param.companyId,
        userId: param.userId
      });
      resFetch = await fetch(`${url}/user/addCompany`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'ADD_USER'
        } as IAddUserResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'CREATE_CODE':
      body = JSON.stringify({
        userId: param.userId
      })
      resFetch = await fetch(`${url}/device/code`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'USER_CODE',
          code: res.data
        } as ICreateCodeResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;
//TODO: удалить
    case 'CREATE_USER':
      body = JSON.stringify({
        ...param.user,
        companies: [param.companyId],
        creatorId: param.creatorId
      });
      resFetch = await fetch(`${url}/auth/signup`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'NEW_USER',
          user: res.data
        } as ICreateUserResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'LOGOUT':
      resFetch = await fetch(`${url}/auth/logout`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'LOGOUT',
        } as ILogOutResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'GET_USER_DEVICES':
      resFetch = await fetch(`${url}/users/${param.userId}/devices?deviceId=${deviceId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'USER_DEVICES',
          devices: res.data
        } as IGetUserDevicesResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'GET_COMPANY_USERS':
      resFetch = await fetch(`${url}/companies/${param.companyId}/users?deviceId=${deviceId}`, {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'COMPANY_USERS',
          users: res.data
        } as IGetCompanyUsersResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;
//TODO: изменить нужно этот метод в месте вызова. Удаление по одному. И теперь это вызов изменения пользователя
    case 'REMOVE_COMPANY_USERS':
      body = JSON.stringify({
        users: param.userIds,
        companyId: param.companyId
      });
      resFetch = await fetch(`${url}/user/removeUsersFromCompany`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'REMOVE_COMPANY_USERS'
        } as IRemoveCompanyUsersResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'REMOVE_DEVICES':
      body = JSON.stringify({
        userName: param.userId
      });

      resFetch = await fetch(`${url}/devices/${param.uIds}?deviceId=${deviceId}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'REMOVE_DEVICES'
        } as IRemoveDevicesResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'BLOCK_DEVICES':
      body = JSON.stringify({
        isBlock: param.isBlock
      });

      resFetch = await fetch(`${url}/devices/${param.uIds}/user/${param.userId}?deviceId=${deviceId}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, credentials: 'include', body});
      res = await resFetch.json();

      if (res.result) {
        return {
          type: 'BLOCK_DEVICES'
        } as IBlockDevicesResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

  };

};
