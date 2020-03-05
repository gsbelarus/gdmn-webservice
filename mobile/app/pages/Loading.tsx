import React, { useEffect, useState } from "react";
import Navigator from "../components/Navigator";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  YellowBox,
  Button
} from "react-native";
import { authApi } from "../api/auth";
import { timeout } from "../helpers/utils";
import config from "../config/index";
// import { useStore, deviceStatus } from '../store';
import { StoreContext, AppActions } from '../store';
import { IDataFetch } from "../model";

interface IServerResponse {
  status: number;
  result: boolean;
}

export const Loading = () => {
  // const { state: { isDeviceRegistered, isUserLogged }, dispatch } = useStore();
  const { state: {deviceRegistered, loggedIn}, dispatch } = React.useContext(StoreContext);

  const [serverResp, setServerResp] = useState<IServerResponse>(undefined);
  const [serverReq, setServerReq] = useState<IDataFetch>(undefined);

  console.disableYellowBox = !config.debug.showWarnings;
  /*
    Порядок работы:
      1) Проверка регистрации устройства на сервере
        - если нет регистрации то переводим пользователя на ввод кода регистрации
        - если регистрация есть то проверяем статус пользователя
      2) Получение статуса пользователя на сервере
        - осуществлён ли вход текущего пользователя, если нет то перевод на вход пользователя
  */
  useEffect(() => {
    if (deviceRegistered ?? serverReq?.isLoading) {
      // если нет начального состояния то обращаемся к серверу
      // TODO: Таймаут вынести в конфиг
      timeout(5000, authApi.getDeviceStatus<IServerResponse>())
        .then(data => setServerResp(data as IServerResponse))
        .catch((err: Error) => setServerReq({ isError: true, status: err.message, isLoading: false }));
    }
  }, [serverReq]);

  useEffect(() => {
    if (serverResp) {
      // получен ответ от сервера - передаём результат в глобальный стейт
      // setServerReq({...serverReq, status: 'got it'});
      // serverResp.result ? dispatch(deviceStatus(true)) : null;
      dispatch(AppActions.setDeviceStatus(true));
    }
    //   timeout(5000, authApi.getDeviceStatus<IServerResponse>())
    //     .then(data => setServerResp(data as IServerResponse))
    //     .catch((err: Error) => setErrorText(err.message));
    // }
  }, [serverResp]);



  /*   useEffect(() => {
      if (deviceStatus === 'CONNECTION') {
        setErrorText('');
        timeout(5000, authApi.getDeviceStatus<IServerResponse>())
          .then(data => setServerResp(data as IServerResponse))
          .catch((err: Error) => setErrorText(err.message));
      }
    }, [deviceStatus]);
    */

  /*  useEffect(() => {
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
   }, [appState]); */

  /*   useEffect(() => {
      if (!serverResp || signedIn === "NO_ACTIVATION") return;

    }, [serverResp]); */

  /*   useEffect(() => {
      if (!errorText) return;

      setAppState("PENDING");
    }, [errorText]); */

  const Layout = Navigator(deviceRegistered ? (loggedIn ? 'LOG_IN' : 'LOG_OUT') : 'NO_ACTIVATION');

  /* Если устройство получило статус то переходим в следующе окно */
  return deviceRegistered ?
    <Layout />
    :
    (
      <View style={styles.container}>
        <Text style={{ color: "#888", fontSize: 18 }}>Подключение к серверу. {deviceRegistered} {serverReq?.status}</Text>
        <Text style={{ color: "#888", fontSize: 15 }}>{config.server.name}:{config.server.port}</Text>
        {
          !serverReq?.isLoading
            ? <Button onPress={() => setServerReq({ isError: false, isLoading: true, status: undefined })} title="Подключиться" />
            : <>
              <ActivityIndicator size="large" color="#70667D" />
              <Button onPress={() => setServerReq({ isError: true, isLoading: false, status: 'прервано пользователем' })} title="Прервать" />
            </>
        }
        {
          serverReq?.isError
            ? <Text style={{ color: "#888", fontSize: 18 }}>Ошибка: {serverReq?.status}</Text>
            : null
        }
      </View>
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
