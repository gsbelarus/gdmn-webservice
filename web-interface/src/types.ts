export interface IUser {
  id?: string;
  userName: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companies?: string[];
  isAdmin?: boolean;
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
