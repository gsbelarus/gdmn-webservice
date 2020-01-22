export interface IUser {
  userId?: string;
  userName: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  code?: string;
  creatorId?: string;
};
export interface IUserCompany {
  companyId: string;
  companyName: string;
  userRole?: 'Admin';
};

export interface IItem {
  key: string;
  name: string;
}

export interface IDevice {
  uid: string;
  state?: string;
 }