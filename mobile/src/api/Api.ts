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
import { IDocument, IReference, IRemain, IGood } from '../model/inventory';
import { get, post } from './http.service';

export default class Api {
  baseUrl: IBaseUrl;

  setUrl = (url: IBaseUrl) => {
    this.baseUrl = url;
  };

  getUrl = () => `${this.baseUrl.protocol}${this.baseUrl.server}:${this.baseUrl.port}/${this.baseUrl.apiPath}`;

  auth = {
    login: async (userCredentials: IUserCredentials): Promise<IServerResponse<undefined>> =>
      post(
        this.getUrl(),
        `/auth/login?deviceId=${config.debug.deviceId}`,
        JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password }),
      ),
    logout: async (): Promise<IServerResponse<undefined>> =>
      get(this.getUrl(), `/auth/logout?deviceId=${config.debug.deviceId}`),

    getUserStatus: async (): Promise<IServerResponse<IUser>> =>
      get(this.getUrl(), `/auth/user?deviceId=${config.debug.deviceId}`),

    getDevice: async (): Promise<IServerResponse<IDevice[]>> => get(this.getUrl(), `/devices/${config.debug.deviceId}`),

    verifyActivationCode: async (code: string): Promise<IServerResponse<{ userId: string }>> =>
      post(this.getUrl(), `/auth/device/code?deviceId=${config.debug.deviceId}`, JSON.stringify({ code })),

    addDevice: async (newDevice: INewDevice): Promise<IServerResponse<IDevice>> =>
      post(
        this.getUrl(),
        `/devices/?deviceId=${config.debug.deviceId}`,
        JSON.stringify({ uid: newDevice.uid, user: newDevice.user }),
      ),

    getCurrentUser: async (): Promise<IServerResponse<IUser>> => get(this.getUrl(), '/auth/user'),
  };

  data = {
    getData: async (): Promise<IServerResponse<(IDocument | IReference | IRemain | IGood)[]>> =>
      get(this.getUrl(), '/test/all'),

    sendMessages: async (
      companyId: string,
      consumer: string,
      documents: IDocument[],
    ): Promise<IServerResponse<IMessageInfo>> =>
      post(
        this.getUrl(),
        '/messages/?deviceId=${config.debug.deviceId}',
        JSON.stringify({ head: { companyId, consumer }, body: { document: documents } }),
      ),

    getMessages: async (companyId: string): Promise<IServerResponse<IMessage[]>> =>
      get(this.getUrl(), `/messages/${companyId}?deviceId=${config.debug.deviceId}`),
  };
}
