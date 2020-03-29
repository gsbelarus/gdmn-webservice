import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useReducer, useCallback, useMemo } from 'react';
import { AsyncStorage } from 'react-native';

import { createCancellableSignal, timeoutWithСancellation } from '../helpers/utils';
import { IDataFetch, IServerResponse, IUser, IBaseUrl } from '../model';
import AppNavigator from '../navigation/AppNavigator';
import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen } from '../screens/Auth';
import { useStore } from '../store';
import config from '../config';

type AuthStackParamList = {
  Splash: undefined;
  Config: undefined;
  DeviceRegister: undefined;
  LogIn: undefined;
  App: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

interface ILoadingState {
  serverResp?: IServerResponse<boolean | IUser | string>;
  serverReq: IDataFetch;
  showSettings: boolean;
}

type Action =
  | { type: 'INIT' }
  | { type: 'SET_CONNECTION' }
  | { type: 'SET_ERROR'; text: string }
  | { type: 'SETTINGS_FORM'; showSettings: boolean }
  | { type: 'SET_RESPONSE'; status: number; result: boolean | string | IUser };

function reducer(state: ILoadingState, action: Action): ILoadingState {
  switch (action.type) {
    case 'INIT':
      return initialState;
    case 'SETTINGS_FORM':
      return {
        ...state,
        showSettings: action.showSettings,
        serverResp: undefined,
        serverReq: { isError: false, status: undefined, isLoading: false },
      };
    case 'SET_RESPONSE':
      return { ...state, serverResp: { result: action.result, status: action.status } };
    case 'SET_ERROR':
      return { ...state, serverReq: { isError: true, status: action.text, isLoading: false } };
    case 'SET_CONNECTION':
      return {
        ...state,
        serverResp: undefined,
        serverReq: { isError: false, status: undefined, isLoading: true },
      };
    default:
      return state;
  }
}

const initialState: ILoadingState = {
  serverResp: undefined,
  serverReq: { isLoading: false, isError: false, status: undefined },
  showSettings: false,
};

const isUser = (obj: unknown): obj is IUser => obj instanceof Object && 'id' in obj;

const AuthNavigator = () => {
  const {
    state: { deviceRegistered, loggedIn, baseUrl },
    actions,
    api,
  } = useStore();

  const [state, setState] = useReducer(reducer, initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    console.log('check effect', api.getUrl());
    if (deviceRegistered ?? state.serverReq?.isLoading) {
      timeoutWithСancellation(signal, 5000, api.auth.getDeviceStatus())
        .then((data: IServerResponse<boolean>) =>
          setState({ type: 'SET_RESPONSE', result: data.result, status: data.status }),
        )
        .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }));
    }
  }, [api.auth, deviceRegistered, signal, state.serverReq]);

  useEffect(() => {
    if (state.serverResp) {
      actions.setDeviceStatus(state.serverResp.result as boolean);
    }
  }, [actions, state.serverResp]);

  useEffect(() => {
    if (deviceRegistered === undefined) {
      return;
    }

    deviceRegistered
      ? timeoutWithСancellation(signal, 5000, api.auth.getUserStatus())
          .then((data: IServerResponse<IUser | string>) => actions.setUserStatus(isUser(data.result)))
          .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }))
      : actions.setUserStatus(false);
  }, [actions, api.auth, deviceRegistered, signal]);

  useEffect(() => setState({ type: 'INIT' }), [loggedIn]);

  const connection = useCallback(() => setState({ type: 'SET_CONNECTION' }), []);

  const breakConnection = useCallback(() => cancel(), [cancel]);

  const showSettings = useCallback(() => setState({ type: 'SETTINGS_FORM', showSettings: true }), []);

  const hideSettings = useCallback(() => setState({ type: 'SETTINGS_FORM', showSettings: false }), []);

  const changeSettings = useCallback(
    (newBaseUrl: IBaseUrl) => {
      AsyncStorage.setItem('pathServer', JSON.stringify(newBaseUrl))
        .then(() => actions.setBaseUrl(newBaseUrl))
        .catch(() => setState({ type: 'SETTINGS_FORM', showSettings: false }));
    },
    [actions],
  );

  useEffect(() => {
    if (baseUrl !== undefined) {
      setState({ type: 'SETTINGS_FORM', showSettings: false });
      api.setUrl(baseUrl);
    }
  }, [api, baseUrl]);

  const SplashWithParams = useCallback(
    () => (
      <SplashScreen
        {...{ breakConnection, connection, deviceRegistered, loggedIn, showSettings }}
        isLoading={state?.serverReq.isLoading}
        isError={state?.serverReq?.isError}
        status={state?.serverReq?.status}
        serverName={`${baseUrl?.server}:${baseUrl?.port}`}
      />
    ),
    [baseUrl, breakConnection, connection, deviceRegistered, loggedIn, showSettings, state],
  );

  const CongigWithParams = useCallback(
    () => (
      <ConfigScreen
        {...{ hideSettings, changeSettings }}
        serverName={`${baseUrl?.protocol}${baseUrl?.server}`}
        serverPort={baseUrl?.port}
      />
    ),
    [baseUrl, hideSettings, changeSettings],
  );

  const ConfigComponent = useMemo(
    () => (
      <Stack.Screen
        key="Config"
        name="Config"
        component={CongigWithParams}
        options={{ headerShown: true, headerBackTitleVisible: true }}
      />
    ),
    [CongigWithParams],
  );

  const LoginComponent = useMemo(
    () =>
      loggedIn ? (
        <Stack.Screen key="App" name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen key="LogIn" name="LogIn" component={SignInScreen} />
      ),
    [loggedIn],
  );

  const RegisterComponent = useMemo(
    () =>
      !deviceRegistered ? (
        <Stack.Screen key="DeviceRegister" name="DeviceRegister" component={ActivationScreen} />
      ) : (
        LoginComponent
      ),
    [deviceRegistered, LoginComponent],
  );

  const AuthConfig = useMemo(
    () =>
      deviceRegistered !== undefined && loggedIn !== undefined ? (
        RegisterComponent
      ) : (
        <Stack.Screen
          key="Splash"
          name="Splash"
          component={SplashWithParams}
          options={{ animationTypeForReplace: 'pop' }}
        />
      ),
    [RegisterComponent, SplashWithParams, deviceRegistered, loggedIn],
  );

  return <Stack.Navigator headerMode="none">{state.showSettings ? ConfigComponent : AuthConfig}</Stack.Navigator>;
};

export default AuthNavigator;
