import config from '../config';
import {
  IResponse,
  IUser,
  IDevice,
  IBaseUrl,
  IMessageInfo,
  IMessage,
  IDocument,
  IReference,
  IRemain,
  IGood,
  IUserCredentials} from '../../../common';
import { get, post } from './http.service';
import { INewDevice } from '../model';

export default class Api {
  baseUrl: IBaseUrl;

  setUrl = (url: IBaseUrl) => {
    this.baseUrl = url;
  };

  getUrl = () => `${this.baseUrl.protocol}${this.baseUrl.server}:${this.baseUrl.port}/${this.baseUrl.apiPath}`;

  auth = {
    login: async (userCredentials: IUserCredentials): Promise<IResponse<undefined>> =>
      post(
        this.getUrl(),
        `/auth/login?deviceId=${config.debug.deviceId}`,
        JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password }),
      ),
    logout: async (): Promise<IResponse<undefined>> =>
      get(this.getUrl(), `/auth/logout?deviceId=${config.debug.deviceId}`),

    getUserStatus: async (): Promise<IResponse<IUser>> =>
      get(this.getUrl(), `/auth/user?deviceId=${config.debug.deviceId}`),

    getDevice: async (): Promise<IResponse<IDevice[]>> => get(this.getUrl(), `/devices/${config.debug.deviceId}`),

    verifyActivationCode: async (code: string): Promise<IResponse<{ userId: string }>> =>
      post(this.getUrl(), `/auth/device/code?deviceId=${config.debug.deviceId}`, JSON.stringify({ code })),

    addDevice: async (newDevice: INewDevice): Promise<IResponse<IDevice>> =>
      post(
        this.getUrl(),
        `/devices/?deviceId=${config.debug.deviceId}`,
        JSON.stringify({ uid: newDevice.uid, user: newDevice.user }),
      ),

    getCurrentUser: async (): Promise<IResponse<IUser>> =>
      get(this.getUrl(), `/auth/user?deviceId=${config.debug.deviceId}`),
  };

  data = {
    getData: async (): Promise<IResponse<(IDocument | IReference | IRemain | IGood)[]>> =>
      get(this.getUrl(), '/test/all'),

    sendMessages: async (
      companyId: string,
      consumer: string,
      documents: IDocument[],
    ): Promise<IResponse<IMessageInfo>> =>
      post(
        this.getUrl(),
        '/messages/?deviceId=${config.debug.deviceId}',
        JSON.stringify({ head: { companyId, consumer }, body: { document: documents } }),
      ),

    getMessages: async (companyId: string): Promise<IResponse<IMessage[]>> =>
      get(this.getUrl(), `/messages/${companyId}?deviceId=${config.debug.deviceId}`),
  };
}
