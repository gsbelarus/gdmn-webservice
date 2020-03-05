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
import { useStore } from '../store';
import { IDataFetch } from "../model";

import config from "../config/index";

interface IServerResponse {
  status: number;
  result: boolean;
}

export const Loading = () => {
  const { state: { deviceRegistered, loggedIn }, actions } = useStore();
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
      // TODO Таймаут вынести в конфиг
      timeout(5000, authApi.getDeviceStatus<IServerResponse>())
        .then(data => setServerResp(data as IServerResponse))
        .catch((err: Error) => setServerReq({ isError: true, status: err.message, isLoading: false }));
    }
  }, [serverReq]);

  useEffect(() => {
    if (serverResp) {
      // получен ответ от сервера - передаём результат в глобальный стейт
      // TODO Проверить если свойство result не передано
      actions.setDeviceStatus(serverResp.result || false)
    }
  }, [serverResp]);

  useEffect(() => {
    // TODO проверить случай когда устройство не зарегистрировано
    if (deviceRegistered) {
      // устройство зарегистрировано, проверяем пользователя
      timeout(5000, authApi.getUserStatus<string>())
        .then(data => actions.setUserStatus(data !== "not authenticated"))
        .catch((err: Error) => setServerReq({ isError: true, isLoading: false, status: err.message }));
    }
  }, [deviceRegistered])

  useEffect(() => {
    // Устанавливаем начальнео состояние
    // TODO переделать на useReducer
    setServerReq({ isLoading: false, isError: false, status: undefined })
  }, [loggedIn])

  const Layout = Navigator(deviceRegistered ? (loggedIn ? 'LOG_IN' : 'LOG_OUT') : 'NO_ACTIVATION');

  /* Если устройство получило статус то переходим в следующе окно */
  return deviceRegistered && loggedIn !== undefined ?
    <Layout />
    :
    (
      <View style={styles.container}>
        <Text style={{ color: "#888", fontSize: 18 }}>Подключение к серверу</Text>
        <Text style={{ color: "#888", fontSize: 15 }}>{config.server.name}:{config.server.port}</Text>
        <Text style={{ color: "#888", fontSize: 15 }}>{deviceRegistered ? 'Registered' : 'not Registered'}</Text>
        <Text style={{ color: "#888", fontSize: 15 }}>{loggedIn === undefined ? 'undefined' : 'not loggedIn'}</Text>
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
