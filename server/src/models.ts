export interface IUser {
  id?: string;
  userName: string;
  password: string;
  activationCode?: string;
  organisations?: string[];
  firstName?: string;
  lastName?: string;
  numberPhone?: string;
}

export interface IActivationCode {
  code: string;
  date: string;
  user: string;
}

export interface IOrganisation {
  id: string;
  title: string;
  admin: string;
}

 export interface IDevice {
  uid: string;
  user: string;
  isBlock: boolean;
}
