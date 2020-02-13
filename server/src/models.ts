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

export interface IMessage {
  head: {
    producer: string;
    consumer: string;
    companyId: string;
    dateTime: string;
  };
  body: {
    type: string;
    payload: {
      name: string;
      params: string[];
    }
  }
}
