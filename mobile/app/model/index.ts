export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IServerResponse<T> {
  status: number;
  result: T;
}

export interface IAppState {
  companyID?: string;
  userID?: string;
  deviceRegistered?: boolean
  deviceActive?: boolean
  loggedIn?: boolean;
}

// перенести в общую папку common
export interface IUser {
  id: string;
  userName: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
