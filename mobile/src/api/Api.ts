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
import { IDocument } from '../model/inventory';
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
        `/auth/login?deviceId=${config.debug.deviceId}`,
        JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password }),
      ),
    logout: async (): Promise<IServerResponse<string>> =>
      get(this.getUrl(), `/auth/logout?deviceId=${config.debug.deviceId}`),

    getUserStatus: async (): Promise<IServerResponse<IUser | string>> =>
      get(this.getUrl(), `/auth/user?deviceId=${config.debug.deviceId}`),

    getDevice: async (): Promise<IServerResponse<IDevice | string>> =>
      get(this.getUrl(), `/devices/${config.debug.deviceId}`),

    verifyActivationCode: async (code: string): Promise<IServerResponse<string>> =>
      get(this.getUrl(), `/auth/device/code=${code}?deviceId=${config.debug.deviceId}`),

    addDevice: async (newDevice: INewDevice): Promise<IServerResponse<string>> =>
      post(this.getUrl(), '/devices/', JSON.stringify({ uid: newDevice.uid, user: newDevice.user })),

    getCurrentUser: async (): Promise<IServerResponse<IUser>> => get(this.getUrl(), '/auth/user'),
  };

  data = {
    getData: async (): Promise<IServerResponse<any>> => get(this.getUrl(), '/test/all'),

    sendMessages: async (
      companyId: string,
      consumer: string,
      documents: IDocument[],
    ): Promise<IServerResponse<IMessageInfo>> =>
      post(
        this.getUrl(),
        '/messages/',
        JSON.stringify({ head: { companyId, consumer }, body: { document: documents } }),
      ),

    getMessages: async (companyId: string): Promise<IServerResponse<IMessage[]>> =>
      get(this.getUrl(), `/messages/${companyId}`),
  };
}
