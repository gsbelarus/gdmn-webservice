export interface IUser {
  userName: string;
  password: string;
  firstName?: string;
  lastName?: string;
  numberPhone?: string;
};
export interface IUserCompany {
  companyName: string;
  userRole?: 'Admin';
};