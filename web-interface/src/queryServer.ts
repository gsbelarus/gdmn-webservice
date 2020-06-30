import { QueryCommand, QueryResponse, INetworkError, ILoginResponse, IUserResponse, ICompaniesResponse, ISignUpResponse, ILogOutResponse, IAllUsersResponse, ICreateCodeResponse, IGetCompanyResponse, ICreateCompanyResponse, IUpdateCompanyResponse, IGetUserDevicesResponse, IUpdateUserResponse, IGetCompanyUsersResponse, IUserNotAuthResponse, IRemoveDevicesResponse, IBlockDevicesResponse, ICreateDeviceNameResponse, IGetUserResponse } from "./queryTypes";
import { get, post, put, remove } from './service/http.service';
import { IResponse, ICompany } from '../../common';
import { IUser, IDevice } from './types';

export const queryServer = async (param: QueryCommand): Promise<QueryResponse> => {
  // посылаем на сервер переданную нам команду
  // и ждем ответ
  // все команды на сервер идут на один URL
  // уже сервер внутри смотрит какая команда пришла
  // и что-то делает
  // http://localhost/execute_command
  const deviceId = "WEB";
  let res;
  let body;
  console.log(param.command);
  switch (param.command) {

    case 'GET_USER_DATA': {
      try {
        res = await get<IResponse<IUser>>(`/auth/user?deviceId=${deviceId}`);

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
        res = await post<IResponse<undefined>>(`/auth/login?deviceId=${deviceId}`, body);

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
      res = await post<IResponse<IUser>>('/auth/signup', body);

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
      res = await get<IResponse<ICompany[]>>(`/companies/?deviceId=${deviceId}`);

      if (res.result) {
        return {
          type: 'USER_COMPANIES',
          companies: res.data
        } as ICompaniesResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'GET_ALL_USERS':
      res = await get<IResponse<IUser[]>>(`/users/?deviceId=${deviceId}`);

      if (res.result) {
        return {
          type: 'ALL_USERS',
          users: res.data //.map((r: any) => ({userId: r.id, userName: r.userName}))
        } as IAllUsersResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

      case 'GET_USER':
      res = await get<IResponse<IUser>>(`/users/${param.userId}?deviceId=${deviceId}`);

      if (res.result) {
        return {
          type: 'GET_USER',
          user: res.data
        } as IGetUserResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'GET_COMPANY':
      res = await get<IResponse<ICompany>>(`/companies/${param.companyId}?deviceId=${deviceId}`);

      if (res.result) {
        return {
          type: 'USER_COMPANY',
          company: {companyId: res.data?.id, companyName: res.data?.title}
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
      res = await post<IResponse<ICompany>>(`/companies/?deviceId=${deviceId}`, body);

      if (res.result) {
        return {
          type: 'NEW_COMPANY',
          companyId: res.data?.id
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
      res = await put<IResponse<ICompany>>(`/companies/${param.companyId}?deviceId=${deviceId}`, body);

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
      res = await put<IResponse<IUser>>(`/users/${param.user.id}?deviceId=${deviceId}`, body);

      if (res.result) {
        return {
          type: 'UPDATE_USER'
        } as IUpdateUserResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'CREATE_CODE':
      res = await get<IResponse<string>>(`/auth/user/${param.userId}/device/code`);

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

    case 'CREATE_DEVICENAME':
      body = JSON.stringify({
        userId: param.userId,
        title: param.title
      });
      res = await post<IResponse<undefined>>('/device/newName', body);

      if (res.result) {
        return {
          type: 'CREATE_DEVICENAME'
        } as ICreateDeviceNameResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

    case 'LOGOUT':
      res = await get<IResponse<undefined>>('/auth/logout');

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
      res = await get<IResponse<IDevice[]>>(`/users/${param.userId}/devices?deviceId=${deviceId}`);

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
      res = await get<IResponse<IUser[]>>(`/companies/${param.companyId}/users?deviceId=${deviceId}`);

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

    case 'REMOVE_DEVICES': {
      body = JSON.stringify({
        userId: param.userId
      });
      res = await remove<IResponse<undefined>>(`/devices/${param.uId}?deviceId=${deviceId}`, body);

      if (res.result) {
        return {
          type: 'REMOVE_DEVICES'
        } as IRemoveDevicesResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;
    }
    case 'BLOCK_DEVICES':
      body = JSON.stringify({
        isBlock: param.isBlock
      });
      res = await put<IResponse<IDevice>>(`/devices/${param.uId}/user/${param.userId}?deviceId=${deviceId}`, body);

      if (res.result) {
        return {
          type: 'BLOCK_DEVICES',
          device: res.data
        } as IBlockDevicesResponse;
      }
      return {
        type: 'ERROR',
        message: res.error
      } as INetworkError;

  };

};
