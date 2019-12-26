export interface IUser {
  login: string;
  password: string;
  firstName?: string;
  lastName?: string;
  numberPhone?: string;
  organizations?: string[];
  devices?: string[];
};