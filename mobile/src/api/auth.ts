import { get, post, put } from './http.service';
import Constants from "expo-constants";
import { IServerResponse, IUser } from '../model';

export const authApi = {
  login: async (userCredentials: { name: string; password: string }): Promise<any> => {
    return post('/login', {
      username: userCredentials.name,
      password: userCredentials.password
    });
  },

  logout: async (): Promise<IServerResponse<string>> => get(`/logout`),

  getDeviceStatus: async (): Promise<boolean> => {
    return get(`/device/isExist?uid=${Constants.deviceId}`);
  },

  getUserStatus: async (): Promise<IUser | string> => get(`/me`),

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
