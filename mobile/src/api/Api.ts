import config from '../config';
import {
  IServerResponse,
  IUser,
  IUserCredentials,
  IDevice,
  IBaseUrl,
  IMessageInfo,
  IMessage,
  INewDevice,
} from '../model';
import { get, post } from './http.service';

export default class Api {
  baseUrl: IBaseUrl;

  setUrl = (url: IBaseUrl) => {
    this.baseUrl = url;
  };

  getUrl = () => `${this.baseUrl.protocol}${this.baseUrl.server}:${this.baseUrl.port}/${this.baseUrl.apiPath}`;

  auth = {
    login: async (userCredentials: IUserCredentials): Promise<IServerResponse<IUser | false>> =>
      post(
        this.getUrl(),
        '/auth/login',
        JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password }),
      ),
    logout: async (): Promise<IServerResponse<string>> => get(this.getUrl(), '/auth/logout'),

    getUserStatus: async (): Promise<IServerResponse<IUser | string>> => get(this.getUrl(), '/auth/user'),

    getDevice: async (): Promise<IServerResponse<IDevice | string>> =>
      get(this.getUrl(), `/devices/${config.debug.deviceId}`),

    verifyActivationCode: async (code: string): Promise<IServerResponse<string>> =>
      post(this.getUrl(), '/devices/code', JSON.stringify({ code })),

    addDevice: async (newDevice: INewDevice): Promise<IServerResponse<string>> =>
      post(this.getUrl(), '/devices/', JSON.stringify({ uid: newDevice.uid, user: newDevice.user })),

    getCurrentUser: async (): Promise<IServerResponse<IUser>> => get(this.getUrl(), '/auth/user'),
  };

  data = {
    getData: async (): Promise<IServerResponse<any>> => get(this.getUrl(), '/test/all'),

    sendMessages: async (companyId: string, consumer: string, body: string): Promise<IServerResponse<IMessageInfo>> =>
      post(this.getUrl(), '/messages/', JSON.stringify({ companyId, consumer, body })),

    getMessages: async (companyId: string): Promise<IServerResponse<IMessage[]>> =>
      get(this.getUrl(), `/messages/${companyId}`),
  };
}
