import config from '../config';
import { IServerResponse, IUser, IUserCredentials, INewDevice, IBaseUrl } from '../model';
import { get, post } from './http.service';

export default class Api {
  baseUrl: IBaseUrl;

  setUrl = (url: IBaseUrl) => {
    this.baseUrl = url;
  };

  getUrl = () => `${this.baseUrl.protocol}${this.baseUrl.server}:${this.baseUrl.port}/${this.baseUrl.apiPath}`;

  auth = {
    login: async (userCredentials: IUserCredentials): Promise<IServerResponse<string>> =>
      post(
        this.getUrl(),
        '/auth/login',
        JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password }),
      ),
    logout: async (): Promise<IServerResponse<string>> => get(this.getUrl(), '/auth/logout'),

    getUserStatus: async (): Promise<IServerResponse<IUser | string>> => get(this.getUrl(), '/auth/user'),

    getDeviceStatus: async (): Promise<IServerResponse<boolean | string>> =>
      get(this.getUrl(), `/devices/${config.debug.deviceId}`),

    getDeviceStatusByUser: async (userName: string): Promise<IServerResponse<boolean>> =>
      get(this.getUrl(), `/devices/${config.debug.deviceId}?userName=${userName}`),

    verifyActivationCode: async (code: string): Promise<IServerResponse<string>> =>
      get(this.getUrl(), `/auth/device/code=${code}`),

    addDevice: async (newDevice: INewDevice): Promise<IServerResponse<string>> =>
      post(this.getUrl(), '/devices/new', JSON.stringify({ uid: newDevice.uid, userId: newDevice.userId })),
  };
}
