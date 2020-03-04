export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IServerResponse {
  status: number;
  result: boolean;
}

type TAppState = "CONNECTION" | "ERROR" | "CONNECTED";

type TDeviceStatus = "NO_ACTIVATION" | "LOGGED_OUT" | "LOGGED_IN";

export interface IAppState {
  deviceStatus: TDeviceStatus;
  companyID?: string;
  isLogged: boolean;
  appState: TAppState;
}
