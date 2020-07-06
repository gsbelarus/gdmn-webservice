import { IDocument } from './inventory';

export interface IUserProfile {
  id?: string;
  userName: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  creatorId: string;
}

export interface IUser {
  id?: string;
  userName: string;
  password: string;
  activationCode?: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  creatorId: string;
}

export interface IBaseUrl {
  protocol: string;
  server: string;
  port: number;
  apiPath: string;
}

export interface IUserCredentials {
  userName: string;
  password: string;
}

export interface IActivationCode {
  id?: string;
  code: string;
  date: string;
  user: string;
}

export interface ICompany {
  id?: string;
  title: string;
  admin: string;
}

export interface IDevice {
  id?: string;
  uid: string;
  name: string;
}

export type DeviceState  = 'NON_ACTIVATED' | 'ACTIVE' | 'BLOCKED'

export interface IDeviceBinding {
  id?: string;
  deviceId: string;
  userId: string;
  state: DeviceState;
}

export interface IDeviceInfo {
  deviceId: string;
  deviceName: string;  
  userId: string;
  userName: string;  
  state: DeviceState;
}

export interface IMessageInfo {
  uid: string;
  date: Date;
}

export interface IMessage {
  id?: string;
  head: {
    id: string;
    producer: string;
    consumer: string;
    dateTime: string;
  };
  body: {
    type: string;
    payload: {
      name: string;
      params: IDocument[] | string[];
    };
  };
}
