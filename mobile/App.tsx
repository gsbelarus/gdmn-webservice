import React, { useEffect, useState } from "react";
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

type TAppState = "CONNECTION" | "PENDING" | "CONNECTED";

// YellowBox.ignoreWarnings(["Require cycle:"]);

type TStartState = "SIGN_OUT" | "NO_ACTIVATION" | "LOG_IN";

interface IServerResponse {
  status: number;
  result: boolean;
}

const App = () => {
  const [signedIn, setSignedIn] = useState<TStartState>("NO_ACTIVATION");
  const [appState, setAppState] = useState<TAppState>(undefined);
  const [serverResp, setServerResp] = useState<IServerResponse>(undefined);
  const [errorText, setErrorText] = useState("");

  console.disableYellowBox = !сonfig.debug.showWarnings;

  /*   const connect = async () => {
      return authApi.getDeviceStatus<IServerResponse>()
        .then(data => setServerResp(data as IServerResponse))
        .catch((err: Error) => setErrorText(err.message));
    } */
  /*
    Порядок работы:
      1) Проверка статуса устройства на сервере
      2) Получение статуса пользователя на сервере
  */
  useEffect(() => {
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
