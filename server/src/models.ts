export interface User {
  id?: string;
  userName: string;
  password: string;
  activationCode?: string;
  firstName?: string;
  lastName?: string;
  numberPhone?: string;
}

export interface ActivationCode {
  code: string;
  date: string;
  user: string;
}

export interface Organisation {
  id: number;
  title: string;
}
