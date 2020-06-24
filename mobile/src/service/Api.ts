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
  IUserCredentials,
} from '../../../common';
import { INewDevice } from '../model';
import { get, post, remove } from './http.service';

export default class Api {
  baseUrl: IBaseUrl;
  deviceId: string;

  setUrl = (url: IBaseUrl) => {
    this.baseUrl = url;
  };

  setDeviceId = (deviceId: string) => {
    this.deviceId = deviceId;
  };

  getUrl = () => `${this.baseUrl.protocol}${this.baseUrl.server}:${this.baseUrl.port}/${this.baseUrl.apiPath}`;

  auth = {
    login: async (userCredentials: IUserCredentials): Promise<IResponse<undefined>> =>
      post(
        this.getUrl(),
        `/auth/login?deviceId=${this.deviceId}`,
        JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password }),
      ),
    logout: async (): Promise<IResponse<undefined>> => get(this.getUrl(), `/auth/logout?deviceId=${this.deviceId}`),

    getUserStatus: async (): Promise<IResponse<IUser>> => get(this.getUrl(), `/auth/user?deviceId=${this.deviceId}`),

    /* Проверка устройства - есть ли в базе сервера */
    getDevice: async (): Promise<IResponse<IDevice>> => get(this.getUrl(), `/devices/${this.deviceId}`),

    verifyActivationCode: async (code: string): Promise<IResponse<{ userId: string; deviceId: string }>> =>
      post(this.getUrl(), '/auth/device/code', JSON.stringify({ uid: this.deviceId, code })),

    //TODO: избавиться от роута
    addDevice: async (newDevice: INewDevice): Promise<IResponse<IDevice>> =>
      post(this.getUrl(), '/devices/', JSON.stringify({ uid: newDevice.uid, user: newDevice.user })),
  };

  data = {
    getData: async (): Promise<IResponse<(IDocument | IReference | IRemain | IGood)[]>> =>
      get(this.getUrl(), '/test/all'),

    sendMessages: async (
      companyId: string,
      consumer: string,
      body: IMessage['body'],
    ): Promise<IResponse<IMessageInfo>> =>
      post(
        this.getUrl(),
        `/messages/?deviceId=${this.deviceId}`,
        JSON.stringify({ head: { companyId, consumer }, body }),
      ),

    getMessages: async (companyId: string): Promise<IResponse<IMessage[]>> =>
      get(this.getUrl(), `/messages/${companyId}?deviceId=${this.deviceId}`),

    deleteMessage: async (companyId: string, uid: string): Promise<IResponse<void>> =>
      remove(this.getUrl(), `/messages/${companyId}/${uid}?deviceId=${this.deviceId}`),

    subscribe: async (companyId: string): Promise<IResponse<IMessage[]>> =>
      get(this.getUrl(), `/messages/subscribe/${companyId}?deviceId=${this.deviceId}`),

    publich: async (companyId: string,
      consumer: string,
      body: IMessage['body']
    ): Promise<IResponse<IMessageInfo>> =>
      post(
        this.getUrl(),
        `/messages/publish/${companyId}?deviceId=${this.deviceId}`,
        JSON.stringify({ head: { companyId, consumer }, body })
      ),
  };
}
