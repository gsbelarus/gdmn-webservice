import React, { useEffect, useReducer, useCallback, useMemo, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { authApi } from '../api/auth';
import { timeout, createCancellableSignal } from '../helpers/utils';
import { useStore } from '../store';
import { IDataFetch, IServerResponse, IUser } from '../model';
import AppNavigator from '../navigation/AppNavigator';
import { SplashScreen } from '../screens/Auth/SplashScreen';
import { SignInScreen } from '../screens/Auth/SignInScreen';

import config from '../config/index';

type AuthStackParamList = {
  Splash: undefined;
  Config: undefined;
  DeviceRegister: undefined;
  LogIn: undefined;
  App: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

interface ILoadingState {
  serverResp?: IServerResponse<any>;
  serverReq: IDataFetch;
  showSettings: boolean;
}

type Action =
  | { type: 'INIT' }
  | { type: 'SET_CONNECTION' }
  | { type: 'SET_ERROR'; text: string }
  | { type: 'SETTINGS_FORM'; showSettings: boolean }
  | { type: 'SET_RESPONSE'; status: number; result: any };

function reducer(state: ILoadingState, action: Action): ILoadingState {
  switch (action.type) {
    case 'INIT':
      return initialState;
    case 'SETTINGS_FORM':
      return { ...state, showSettings: action.showSettings };
    case 'SET_RESPONSE':
      return { ...state, serverResp: { result: action.result, status: action.status } };
    case 'SET_ERROR':
      return { ...state, serverReq: { ...state.serverReq, isError: true, status: action.text, isLoading: false } };
    case 'SET_CONNECTION':
      return {
        ...state,
        serverResp: undefined,
        serverReq: { ...state.serverReq, isError: false, status: undefined, isLoading: true }
      };
    default:
      return state;
  }
}

const initialState: ILoadingState = {
  serverResp: undefined,
  serverReq: { isLoading: false, isError: false, status: undefined },
  showSettings: false
};

const isUser = (obj: any): obj is IUser => obj instanceof Object && 'id' in obj;

const AuthNavigator = () => {
  const {
    state: { deviceRegistered, loggedIn, baseUrl },
    actions
  } = useStore();

  const [state, setState] = useReducer(reducer, initialState);
  const { signal, cancel } = useMemo(() => createCancellableSignal(), [state.serverReq.isLoading]);

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
    if (deviceRegistered ?? state.serverReq?.isLoading) {
      // если нет начального состояния то обращаемся к серверу
      // TODO Таймаут вынести в конфиг
      timeout(signal, 5000, authApi.getDeviceStatus())
        .then((data: IServerResponse<boolean>) =>
          setState({ type: 'SET_RESPONSE', result: data.result, status: data.status })
        )
        .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }));
    }
  }, [state.serverReq]);

  useEffect(() => {
    if (state.serverResp) {
      // получен ответ от сервера - передаём результат в глобальный стейт
      // TODO Проверить если свойство result не передано
      actions.setDeviceStatus(state.serverResp.result ?? false);
    }
  }, [state.serverResp]);

  useEffect(() => {
    // TODO проверить случай когда устройство не зарегистрировано
    if (deviceRegistered === undefined) return;

    deviceRegistered
      ? // устройство зарегистрировано, проверяем пользователя
      timeout(signal, 5000, authApi.getUserStatus())
        .then((data: IServerResponse<IUser | string>) => actions.setUserStatus(isUser(data.result)))
        .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }))
      : actions.setUserStatus(false);
  }, [deviceRegistered]);

  // Устанавливаем начальное состояние
  useEffect(() => setState({ type: 'INIT' }), [loggedIn]);

  const connection = useCallback(() => setState({ type: 'SET_CONNECTION' }), []);

  const breakConnection = useCallback(() => cancel(), [state.serverReq.isLoading]);

  const SplashWithParams = () => (
    <SplashScreen
      {...{ breakConnection, connection, deviceRegistered, loggedIn }}
      isLoading={state?.serverReq.isLoading}
      isError={state?.serverReq?.isError}
      status={state?.serverReq?.status}
      serverName={`${baseUrl?.server}:${baseUrl?.port}`}
    />
  );

  return (
    <Stack.Navigator>
      {deviceRegistered !== undefined && loggedIn !== undefined ? (
        !deviceRegistered ? (
          // Устройство не зарегистрировано - открываем окно ввода кода
          <Stack.Screen key="DeviceRegister" name="DeviceRegister" component={SplashScreen} options={{ headerShown: false }} />
        ) : loggedIn ? (
          // Устройство зарегистрировано, вход пользователя осуществлён - открываем окно приложение
          <Stack.Screen key="App" name="App" component={AppNavigator} options={{ headerShown: false }} />
        ) : (
              // Устройство зарегистрировано, вход пользователя не осуществлён - открываем окно входа пользователя
              <Stack.Screen key="LogIn" name="LogIn" component={SignInScreen} options={{ headerShown: false }} />
            )
      ) : (
          // Обращение к серверу
          <Stack.Screen key="Splash" name="Splash" component={SplashWithParams} options={{ headerShown: false, animationTypeForReplace: 'pop' }} />
        )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
