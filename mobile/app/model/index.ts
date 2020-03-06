export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IServerResponse<T> {
  status: number;
  result: T;
}

// type TAppState = "CONNECTION" | "ERROR" | "CONNECTED";

// export type TDeviceStatus = "NOT_REGISTERED" | "NOT_ACTIVATED" | "ACTIVATED";

export interface IAppState {
  companyID?: string;
  userID?: string;
  deviceRegistered?: boolean
  deviceActive?: boolean
  loggedIn?: boolean;
}
