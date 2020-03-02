import React, { useEffect, useState } from "react";
import Navigator from "./app/components/Navigator";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  YellowBox
} from "react-native";
import сonfig from "./app/config/index";
import { authApi } from "./app/api/auth";

type TAppState = "CONNECTION" | "PENDING" | "CONNECTED";

// YellowBox.ignoreWarnings(["Require cycle:"]);

type TStartState = "SIGN_OUT" | "NO_ACTIVATION" | "LOG_IN";

interface IServerResponse {
  status: number;
  result: boolean;
}

const App = () => {
  const [signedIn, setSignedIn] = useState<TStartState>("NO_ACTIVATION");
  const [appState, setAppState] = useState<TAppState>("CONNECTION");
  const [serverResp, setServerResp] = useState<IServerResponse>(undefined);
  const [errorText, setErrorText] = useState("");

  console.disableYellowBox = !сonfig.debug.showWarnings;
  /*
    Порядок работы:
      1) Проверка статуса устройства на сервере
      2) Получение статуса пользователя на сервере
  */
  useEffect(() => {
    authApi
      .getDeviceStatus<IServerResponse>()
      .then(data => setServerResp(data))
      .catch((err: Error) => setErrorText(err.message));
  }, []);

  useEffect(() => {
    if (!errorText) return;

    setAppState("PENDING");
  }, [errorText]);

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

    if (appState === "CONNECTION") checkUserStatus();
  }, [appState]);

  useEffect(() => {
    if (!serverResp) return;

    setAppState("CONNECTED");
  }, [serverResp]);

  const Layout = Navigator(signedIn);

  return appState !== "CONNECTED" ? (
    <View style={styles.container}>
      {appState === "CONNECTION" ? (
        <ActivityIndicator size="large" color="#70667D" />
      ) : (
        <Text>No connection: {errorText}</Text>
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
    justifyContent: "center"
  }
});

export default App;
