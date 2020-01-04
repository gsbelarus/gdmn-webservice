export interface IUser {
  userName: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  numberPhone?: string;
};
export interface IUserCompany {
  companyId?: number;
  companyName: string;
  userRole?: 'Admin';
};

export interface IItem {
  key: string;
  name: string;
}