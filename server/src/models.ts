export interface User {
  id?: number;
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
