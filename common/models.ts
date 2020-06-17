import { IDocument } from './inventory';

export interface IMakeUser {
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
  code: string;
  date: string;
  user: string;
}

export interface ICompany {
  id: string;
  title: string;
  admin: string;
}

export interface IDevice {
  uid: string;
  user: string;
  isBlock: boolean;
}

export interface IMessageInfo {
  uid: string;
  date: Date;
}

export interface IMessage {
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
      params: IDocument[];
    };
  };
}
