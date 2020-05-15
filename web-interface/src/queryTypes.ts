import { IUser, IUserCompany, IDevice } from "./types";
import { ICompany } from '../../common';

export interface IQueryCommand {
  command: 'LOGIN' | 'GET_USER_DATA' | 'GET_COMPANIES' | 'SIGNUP' | 'LOGOUT' | 'GET_ALL_USERS' | 'GET_USER' | 'CREATE_CODE'
  | 'GET_COMPANY' | 'CREATE_COMPANY' | 'UPDATE_COMPANY' | 'GET_USER_DEVICES' | 'UPDATE_USER' | 'GET_COMPANY_USERS'
  | 'REMOVE_DEVICES' | 'BLOCK_DEVICES';
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
  companyId?: string;
  creatorId?: string;
};

export interface ILogOutCommand extends IQueryCommand {
  command: 'LOGOUT';
};

export interface IGetUserData extends IQueryCommand {
  command: 'GET_USER_DATA';
};

export interface IGetCompaniesData extends IQueryCommand {
  command: 'GET_COMPANIES';
};

export interface IGetAllUsersData extends IQueryCommand {
  command: 'GET_ALL_USERS';
};

export interface IUserData extends IQueryCommand {
  command: 'GET_USER';
  userId: string;
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

export interface IGetUserDevicesData extends IQueryCommand {
  command: 'GET_USER_DEVICES';
  userId: string;
};

export interface IGetCompanyUsers extends IQueryCommand {
  command: 'GET_COMPANY_USERS';
  companyId: string;
};

export interface IRemoveDevices extends IQueryCommand {
  command: 'REMOVE_DEVICES';
  uIds: string[],
  userId: string
};

export interface IBlockDevices extends IQueryCommand {
  command: 'BLOCK_DEVICES';
  uId: string,
  userId: string,
  isBlock: boolean
};

export type QueryCommand = ILoginCommand | IGetUserData | IGetCompaniesData | ISignUpCommand | ILogOutCommand
  | IGetAllUsersData | IUserData | ICreateCodeData | IGetCompanyData | ICreateCompanyData
  | IUpdateCompanyData | IGetUserDevicesData | IUpdateUserData | IGetCompanyUsers | IRemoveDevices | IBlockDevices;

export interface INetworkError {
  type: 'ERROR';
  message: string;
};

export interface IQueryResponse {
  type: 'LOGIN' | 'USER' | 'USER_COMPANIES' | 'SIGNUP' | 'LOGOUT' | 'ALL_USERS' |  'GET_USER' | 'USER_CODE' | 'USER_COMPANY'
  | 'NEW_COMPANY' | 'NEW_USER' | 'UPDATE_COMPANY' | 'USER_DEVICES' | 'UPDATE_USER' | 'COMPANY_USERS' | 'USER_NOT_AUTHENTICATED'
  | 'USER_BY_NAME' | 'REMOVE_DEVICES' | 'BLOCK_DEVICES';
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
  companies: ICompany[];
};

export interface ISignUpResponse extends IQueryResponse {
  type: 'SIGNUP';
  user: IUser;
};

export interface IAllUsersResponse extends IQueryResponse {
  type: 'ALL_USERS';
  users: IUser[];
};

export interface IGetUserResponse extends IQueryResponse {
  type: 'GET_USER';
  user: IUser;
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
  user: IUser;
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

export interface IRemoveDevicesResponse extends IQueryResponse {
  type: 'REMOVE_DEVICES';
};

export interface IBlockDevicesResponse extends IQueryResponse {
  type: 'BLOCK_DEVICES';
  device: IDevice;
};

export type QueryResponse = INetworkError | ILoginResponse | IUserResponse | ICompaniesResponse | ISignUpResponse
  | ILogOutResponse | IAllUsersResponse | IGetUserResponse | ICreateCodeResponse | IGetCompanyResponse | ICreateCompanyResponse
  | ICreateUserResponse | IUpdateCompanyResponse | IGetUserDevicesResponse | IUpdateUserResponse
  | IGetCompanyUsersResponse | IUserNotAuthResponse | IUserByNameResponse | IRemoveDevicesResponse | IBlockDevicesResponse;
