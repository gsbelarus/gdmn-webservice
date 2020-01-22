import { IUser, IUserCompany, IDevice } from "./types";

export interface IQueryCommand {
  command: 'LOGIN' | 'GET_USER_DATA' | 'GET_COMPANIES' | 'SIGNUP' | 'LOGOUT' | 'GET_ALL_USERS' | 'CREATE_CODE'
  | 'GET_COMPANY' | 'CREATE_COMPANY' | 'CREATE_USER' | 'ADD_USER' | 'UPDATE_COMPANY' | 'GET_USER_DEVICES' | 'UPDATE_USER' | 'GET_COMPANY_USERS'
  | 'REMOVE_COMPANY_USERS' | 'GET_USER_BY_NAME' | 'REMOVE_DEVICES' | 'BLOCK_DEVICES';
};

export interface ILoginCommand extends IQueryCommand {
  command: 'LOGIN';
  userName: string;
  password: string;
};

export interface ISignUpCommand extends IQueryCommand {
  command: 'SIGNUP';
  userName: string;
  password: string;
};

export interface ILogOutCommand extends IQueryCommand {
  command: 'LOGOUT';
};

export interface IGetUserData extends IQueryCommand {
  command: 'GET_USER_DATA';
};

export interface IGetCompaniesData extends IQueryCommand {
  command: 'GET_COMPANIES';
  userId: string;
};

export interface IGetAllUsersData extends IQueryCommand {
  command: 'GET_ALL_USERS';
};

export interface IGetUserByNameData extends IQueryCommand {
  command: 'GET_USER_BY_NAME';
  userName: string;
  password: string;
};

export interface ICreateCodeData extends IQueryCommand {
  command: 'CREATE_CODE';
  userId: string;
};

export interface IGetCompanyData extends IQueryCommand {
  command: 'GET_COMPANY';
  companyId: string;
};

export interface ICreateCompanyData extends IQueryCommand {
  command: 'CREATE_COMPANY';
  companyName: string;
};

export interface IUpdateCompanyData extends IQueryCommand {
  command: 'UPDATE_COMPANY';
  companyId: string;
  companyName: string;
};

export interface IUpdateUserData extends IQueryCommand {
  command: 'UPDATE_USER';
  user: IUser;
};


export interface ICreateUserData extends IQueryCommand {
  command: 'CREATE_USER';
  user: IUser;
  companyId: string;
  creatorId: string
};

export interface IAddUserData extends IQueryCommand {
  command: 'ADD_USER';
  userId: string;
  companyId: string;
};

export interface IGetUserDevicesData extends IQueryCommand {
  command: 'GET_USER_DEVICES';
  userId: string;
};

export interface IGetCompanyUsers extends IQueryCommand {
  command: 'GET_COMPANY_USERS';
  companyId: string;
};

export interface IRemoveCompanyUsers extends IQueryCommand {
  command: 'REMOVE_COMPANY_USERS';
  userIds: string[],
  companyId: string
};

export interface IRemoveDevices extends IQueryCommand {
  command: 'REMOVE_DEVICES';
  uIds: string[],
  userId: string
};

export interface IBlockDevices extends IQueryCommand {
  command: 'BLOCK_DEVICES';
  uIds: string[],
  userId: string
};

export type QueryCommand = ILoginCommand | IGetUserData | IGetCompaniesData | ISignUpCommand | ILogOutCommand
  | IGetAllUsersData | ICreateCodeData | IGetCompanyData | ICreateCompanyData | ICreateUserData | IAddUserData
  | IUpdateCompanyData | IGetUserDevicesData | IUpdateUserData | IGetCompanyUsers | IRemoveCompanyUsers | IGetUserByNameData | IRemoveDevices | IBlockDevices;

export interface INetworkError {
  type: 'ERROR';
  message: string;
};

export interface IQueryResponse {
  type: 'LOGIN' | 'USER' | 'USER_COMPANIES' | 'SIGNUP' | 'LOGOUT' | 'ALL_USERS' | 'USER_CODE' | 'USER_COMPANY'
  | 'NEW_COMPANY' | 'NEW_USER' | 'ADD_USER' | 'UPDATE_COMPANY' | 'USER_DEVICES' | 'UPDATE_USER' | 'COMPANY_USERS' | 'USER_NOT_AUTHENTICATED'
  | 'REMOVE_COMPANY_USERS' | 'USER_BY_NAME' | 'REMOVE_DEVICES' | 'BLOCK_DEVICES';
};

export interface ILoginResponse extends IQueryResponse {
  type: 'LOGIN';
  userId: string;
};

export interface ILogOutResponse extends IQueryResponse {
  type: 'LOGOUT';
  userId: string;
};

export interface IUserResponse extends IQueryResponse {
  type: 'USER';
  user: IUser;
};

export interface IUserNotAuthResponse extends IQueryResponse {
  type: 'USER_NOT_AUTHENTICATED';
};

export interface ICompaniesResponse extends IQueryResponse {
  type: 'USER_COMPANIES';
  companies: IUserCompany[];
};

export interface ISignUpResponse extends IQueryResponse {
  type: 'SIGNUP';
  code: string;
};

export interface IAllUsersResponse extends IQueryResponse {
  type: 'ALL_USERS';
  users: IUser[];
};

export interface IUserByNameResponse extends IQueryResponse {
  type: 'USER_BY_NAME';
  user: IUser;
};

export interface ICreateCodeResponse extends IQueryResponse {
  type: 'USER_CODE';
  code: string;
};

export interface IGetCompanyResponse extends IQueryResponse {
  type: 'USER_COMPANY';
  company: IUserCompany;
};

export interface ICreateCompanyResponse extends IQueryResponse {
  type: 'NEW_COMPANY';
  companyId: string;
};

export interface IUpdateCompanyResponse extends IQueryResponse {
  type: 'UPDATE_COMPANY'
};

export interface ICreateUserResponse extends IQueryResponse {
  type: 'NEW_USER';
  code: string;
};

export interface IAddUserResponse extends IQueryResponse {
  type: 'ADD_USER';
  code: string;
};

export interface IGetUserDevicesResponse extends IQueryResponse {
  type: 'USER_DEVICES';
  devices: IDevice[];
};

export interface IUpdateUserResponse extends IQueryResponse {
  type: 'UPDATE_USER'
};

export interface IGetCompanyUsersResponse extends IQueryResponse {
  type: 'COMPANY_USERS';
  users: IUser[];
};

export interface IRemoveCompanyUsersResponse extends IQueryResponse {
  type: 'REMOVE_COMPANY_USERS';
};

export interface IRemoveDevicesResponse extends IQueryResponse {
  type: 'REMOVE_DEVICES';
};

export interface IBlockDevicesResponse extends IQueryResponse {
  type: 'BLOCK_DEVICES';
};

export type QueryResponse = INetworkError | ILoginResponse | IUserResponse | ICompaniesResponse | ISignUpResponse
  | ILogOutResponse | IAllUsersResponse | ICreateCodeResponse | IGetCompanyResponse | ICreateCompanyResponse
  | ICreateUserResponse | IAddUserResponse | IUpdateCompanyResponse | IGetUserDevicesResponse | IUpdateUserResponse
  | IGetCompanyUsersResponse | IUserNotAuthResponse | IRemoveCompanyUsersResponse | IUserByNameResponse | IRemoveDevicesResponse | IBlockDevicesResponse;

