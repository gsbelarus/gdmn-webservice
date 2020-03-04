export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}

export interface IServerResponse {
  status: number;
  result: boolean;
}

export type TAppState = "CONNECTION" | "PENDING" | "CONNECTED";

type TStartState = "NO_ACTIVATION" | "LOGGED_OUT" | "LOGGED_IN";

export interface IAppState {
  signedIn?: TStartState;
  appState?: TAppState;
  serverResp?: IServerResponse;
  errorText?: string;
}
