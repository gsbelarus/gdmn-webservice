import React, { useEffect, useState, createContext, useContext } from "react";
import Navigator from "./components/Navigator";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  YellowBox,
  Button
} from "react-native";
import { authApi } from "./api/auth";
import { timeout } from "./helpers/utils";
import config from "./config/index";
import {MyContext, errorCreate} from './store';

type TAppState = "CONNECTION" | "PENDING" | "CONNECTED";

// YellowBox.ignoreWarnings(["Require cycle:"]);

type TStartState = "LOGGED_OUT" | "NO_ACTIVATION" | "LOGGED_IN";

interface IServerResponse {
  status: number;
  result: boolean;
}

const App = () => {
  const { state, dispatch } = React.useContext(MyContext);

  const [signedIn, setSignedIn] = useState<TStartState>("NO_ACTIVATION");
  const [appState, setAppState] = useState<TAppState>(undefined);
  const [serverResp, setServerResp] = useState<IServerResponse>(undefined);
  const [errorText, setErrorText] = useState("");

  console.disableYellowBox = !config.debug.showWarnings;
  /*
    Порядок работы:
      1) Проверка статуса устройства на сервере
      2) Получение статуса пользователя на сервере
  */
  useEffect(() => {
    if (appState === "CONNECTION" && !serverResp) {
      setErrorText("");

      timeout(5000, authApi.getDeviceStatus<IServerResponse>())
        .then(data => setServerResp(data as IServerResponse))
        .catch((err: Error) => setErrorText(err.message));
    }
  }, [appState]);

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
      // setErrorText(signedIn);
      if (!serverResp?.result) {
        setSignedIn("LOGGED_OUT");
        return;
      }

      authApi
        .getUserStatus<string>()
        .then(data =>
          setSignedIn(data !== "not authenticated" ? "LOGGED_IN" : "LOGGED_OUT")
        )
        .catch((err: Error) => setErrorText(err.message));
    };

    if (appState === "CONNECTION" && serverResp) checkUserStatus();
  }, [appState]);

  useEffect(() => {
    if (!serverResp || signedIn === "NO_ACTIVATION") return;
    // setErrorText(signedIn);
    // setAppState("CONNECTED");

  }, [serverResp]);

  // useEffect(() => {
  //   if (!signedIn) return;

  //   setAppState("CONNECTED");
  // }, [signedIn]);

  useEffect(() => {
    if (!errorText) return;

    setAppState("PENDING");
  }, [errorText]);

  const Layout = Navigator(signedIn);

  return appState !== "CONNECTED" ? (
    <View style={styles.container}>
      <Text style={{ color: "#888", fontSize: 18 }}>Подключение к серверу</Text>
      <Text style={{ color: "#888", fontSize: 15 }}>
        {config.server.name}:{config.server.port}
      </Text>
      {appState === "CONNECTION" ? (
        <>
          <ActivityIndicator size="large" color="#70667D" />
          <Button onPress={() => setErrorText("прервано пользователем")} title="Прервать" />
        </>
      ) : (
          <>
            <Text style={{ color: "#888", fontSize: 18 }}>
              Ошибка: {errorText}  - {state.errorText}
            </Text>
            <Button
              // onPress={() => setAppState("CONNECTION")}
              onPress={() => dispatch(errorCreate('terminated'))}
              title="Подключиться снова"
            />
          </>
        )}
    </View>
  ) : (
      <Layout />
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3EFF4",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
