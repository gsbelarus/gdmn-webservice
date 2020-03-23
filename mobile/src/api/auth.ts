import Constants from 'expo-constants';

import { IServerResponse, IUser, IUserCredentials, INewDevice } from '../model';
import { get, post } from './http.service';

export const authApi = {
  login: async (userCredentials: IUserCredentials): Promise<IServerResponse<string>> =>
    post('/login', JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password })),

  logout: async (): Promise<IServerResponse<string>> => get('/logout'),

  getUserStatus: async (): Promise<IServerResponse<IUser | string>> => get('/me'),

  getDeviceStatus: async (): Promise<IServerResponse<boolean | string>> =>
    get(`/device/isExist?uid=${Constants.deviceId}`),

  getDeviceStatusByUser: async (userName: string): Promise<IServerResponse<boolean>> =>
    get(`/device/isActive?uid=${Constants.deviceId}&userId=${userName}`),

  verifyActivationCode: async (code: string): Promise<IServerResponse<string>> =>
    get(`/device/verifyCode?code=${code}`),

  addDevice: async (newDevice: INewDevice): Promise<IServerResponse<string>> =>
    post('/device/new', JSON.stringify({ uid: newDevice.uid, userId: newDevice.userId })),
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
