import React, { useEffect, useState, createContext, useContext } from "react";
import Navigator from "./app/components/Navigator";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  YellowBox,
  Button
} from "react-native";
import сonfig from "./app/config";
import { authApi } from "./app/api/auth";
import { timeout } from './app/helpers/utils';
import config from "./app/config";

// YellowBox.ignoreWarnings(["Require cycle:"]);

type TAppState = "CONNECTION" | "PENDING" | "CONNECTED";

type TStartState = "SIGN_OUT" | "NO_ACTIVATION" | "LOG_IN";

interface IAppState {
  signedIn?: TStartState;
  appState?: TAppState;
  serverResp?: IServerResponse;
  errorText?: string;
}

const initialState: IAppState = {
  appState: "CONNECTION",
  errorText: ''
};

interface IState {
  state: IAppState;
  setState: React.Dispatch<React.SetStateAction<IAppState>>;
}

const defaultAppState: IState = {
  state: initialState,
  setState: (): void => { },
};

export const AppContext = createContext<IState>(defaultAppState);

export const useAppContext = (): IState => {
  return useContext(AppContext);
};

interface IServerResponse {
  status: number;
  result: boolean;
}

const App = () => {
  const [signedIn, setSignedIn] = useState<TStartState>("NO_ACTIVATION");
  const [appState, setAppState] = useState<TAppState>(undefined);
  const [serverResp, setServerResp] = useState<IServerResponse>(undefined);
  const [errorText, setErrorText] = useState("");

  const { state, setState } = useAppContext();

  console.disableYellowBox = !сonfig.debug.showWarnings;

  /*
    Порядок работы:
      1) Проверка статуса устройства на сервере
      2) Получение статуса пользователя на сервере
  */
  useEffect(() => {
    setState({ appState: 'CONNECTION' })
    setAppState('CONNECTION')
  }, []);

  useEffect(() => {
    if (!errorText) return;
    setAppState("PENDING");
  }, [errorText]);

  useEffect(() => {
    if (appState === 'CONNECTION') {
      setErrorText('');
      timeout(5000, authApi.getDeviceStatus<IServerResponse>())
        .then(data => setServerResp(data as IServerResponse))
        .catch((err: Error) => setErrorText(err.message));
    }
  }, [appState]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!serverResp?.result) {
        setSignedIn("SIGN_OUT");
        return;
      }

      authApi
        .getUserStatus<string>()
        .then(data =>
          setSignedIn(data !== "not authenticated" ? "LOG_IN" : "SIGN_OUT")
        )
        .catch((err: Error) => setErrorText(err.message));
    };

    if (appState === "CONNECTION" && serverResp) checkUserStatus();
  }, [appState]);

  useEffect(() => {
    if (!serverResp) return;

    setAppState("CONNECTED");
  }, [serverResp]);

  const Layout = Navigator(signedIn);

  return appState !== "CONNECTED" ? (
    <View style={styles.container}>
      {appState === "CONNECTION"
        ?
        <>
          <ActivityIndicator size="large" color="#70667D" />
          <Text style={{ color: '#888', fontSize: 18 }}>Подключение к серверу</Text>
          <Text style={{ color: '#888', fontSize: 15 }}>{config.server.name}:{config.server.port}</Text>
          <Button onPress={() => setAppState("PENDING")} title="Прервать" />
        </>
        :
        <>
          <Text style={{ color: '#888', fontSize: 18 }}>Ошибка подключения: {errorText}</Text>
          <Button onPress={() => setAppState("CONNECTION")} title="Подключиться снова" />
        </>
      }
    </View>
  ) : (
      <Layout />
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3EFF4",
    alignItems: 'center',
    justifyContent: "center"
  }
});

export default App;
