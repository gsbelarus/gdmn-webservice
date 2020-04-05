// import Constants from 'expo-constants';
// import { IServerResponse, IUser, IUserCredentials, INewDevice, IBaseUrl } from '../model';

export default class Sync {
  path: string;

  setPath = (path: string) => {
    this.path = path;
  };

  // getUrl = () => `${this.baseUrl.protocol}${this.baseUrl.server}:${this.baseUrl.port}/${this.baseUrl.apiPath}`;

  // auth = {
  //   login: async (userCredentials: IUserCredentials): Promise<IServerResponse<string>> =>
  //     post(
  //       this.getUrl(),
  //       '/login',
  //       JSON.stringify({ userName: userCredentials.userName, password: userCredentials.password }),
  //     ),
  //   logout: async (): Promise<IServerResponse<string>> => get(this.getUrl(), '/logout'),

  //   getUserStatus: async (): Promise<IServerResponse<IUser | string>> => get(this.getUrl(), '/me'),

  //   getDeviceStatus: async (): Promise<IServerResponse<boolean | string>> =>
  //     get(this.getUrl(), `/device/isExist?uid=${Constants.deviceId}`),

  //   getDeviceStatusByUser: async (userName: string): Promise<IServerResponse<boolean>> =>
  //     get(this.getUrl(), `/device/isActive?uid=${Constants.deviceId}&userId=${userName}`),

  //   verifyActivationCode: async (code: string): Promise<IServerResponse<string>> =>
  //     get(this.getUrl(), `/device/verifyCode?code=${code}`),

  //   addDevice: async (newDevice: INewDevice): Promise<IServerResponse<string>> =>
  //     post(this.getUrl(), '/device/new', JSON.stringify({ uid: newDevice.uid, userId: newDevice.userId })),
  // };
}
