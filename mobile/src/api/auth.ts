import { get, post, put } from './http.service';
import Constants from "expo-constants";
import { IServerResponse, IUser, IUserCredentials, IDataFetch } from '../model';

export const authApi = {
  login: async (userCredentials: IUserCredentials): Promise<IServerResponse<any>> => post('/login', { userName: userCredentials.userName, password: userCredentials.password }),

  logout: async (): Promise<IServerResponse<string>> => get(`/logout`),

  getUserStatus: async (): Promise<IServerResponse<IUser | string>> => get(`/me`),

  getDeviceStatus: async (): Promise<IServerResponse<boolean | string>> => get(`/device/isExist?uid=${Constants.deviceId}`),

  getDeviceStatusByUser: async (userName: string): Promise<IServerResponse<boolean>> => get(`/device/isActive?uid=${Constants.deviceId}&userId=${userName}`),

  // `${baseUrl}/device/isActive?uid=${Constants.deviceId}&userId=${loginValue}`,

  /*   fetchData: async <T>(name: string): Promise<T> => {
      return get(`/${name}`);
    },

    addData: async <T>(name: string, body: any): Promise<T> => {
      return post(`/${name}`, body);
    },

    updateData: async <T>(name: string, body: any): Promise<T> => {
      return put(`/${name}`, body);
    } */
};
