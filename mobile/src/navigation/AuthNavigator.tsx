import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useReducer, useCallback, useMemo } from 'react';
import { AsyncStorage } from 'react-native';

import { IResponse, IUser, IBaseUrl, IDevice } from '../../../common';
import config from '../config';
import { createCancellableSignal, timeoutWithСancellation } from '../helpers/utils';
import { IDataFetch } from '../model';
import AppNavigator from '../navigation/AppNavigator';
import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen } from '../screens/Auth';
import { useAuthStore } from '../store';
import CompanyNavigator from './CompanyNavigator';

type AuthStackParamList = {
  Splash: undefined;
  Config: undefined;
  DeviceRegister: undefined;
  LogIn: undefined;
  SelectCompany: undefined;
  App: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

interface ILoadingState {
  serverResp?: IResponse<IDevice>;
  serverReq: IDataFetch;
  showSettings: boolean;
}

type Action =
  | { type: 'INIT' }
  | { type: 'SET_CONNECTION' }
  | { type: 'SET_ERROR'; text: string }
  | { type: 'SETTINGS_FORM'; showSettings: boolean }
  | { type: 'SET_RESPONSE'; result: boolean; data?: IDevice };

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
      return { ...state, serverResp: { result: action.result, data: action.data } };
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
    state: { deviceRegistered, loggedIn, baseUrl, companyID },
    actions: authActions,
    api,
  } = useAuthStore();

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
    /* 1. Запрос к серверу*/
    if (deviceRegistered ?? state.serverReq?.isLoading) {
      timeoutWithСancellation(signal, 5000, api.auth.getDevice())
        .then((response: IResponse<IDevice>) =>
          setState({ type: 'SET_RESPONSE', result: response.result, data: response.data }),
        )
        .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }));
    }
  }, [api.auth, deviceRegistered, signal, state.serverReq]);

  useEffect(() => {
    if (state.serverResp) {
      // TODO вызов 3 раза
      console.log('state.serverResp', state.serverResp);
      actions.setDeviceStatus(state.serverResp.result as boolean);
    }
  }, [actions, state.serverResp]);

  useEffect(() => {
    if (deviceRegistered === undefined) {
      return;
    }
    deviceRegistered
      ? timeoutWithСancellation(signal, 5000, api.auth.getUserStatus())
          .then((data: IResponse<IUser>) => {
            const userStatus = isUser(data.data)
              ? { logged: true, userID: data.data.id }
              : { logged: false, userID: undefined };
            actions.setUserStatus(userStatus);
          })
          .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }))
      : actions.setUserStatus({ logged: false, userID: undefined });
  }, [actions, api.auth, deviceRegistered, signal]);
  // Вынести всё в store  - deviceRegistered

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
    [
      baseUrl?.port,
      baseUrl?.server,
      breakConnection,
      connection,
      deviceRegistered,
      loggedIn,
      showSettings,
      state?.serverReq?.isError,
      state?.serverReq?.isLoading,
      state?.serverReq?.status,
    ],
  );

  const CongfigWithParams = useCallback(
    () => (
      <ConfigScreen
        {...{ hideSettings, changeSettings }}
        serverName={`${baseUrl?.protocol}${baseUrl?.server}`}
        serverPort={baseUrl?.port}
      />
    ),
    [hideSettings, changeSettings, baseUrl?.protocol, baseUrl?.server, baseUrl?.port],
  );

  const ConfigComponent = useMemo(
    () => (
      <Stack.Screen
        key="Config"
        name="Config"
        component={CongfigWithParams}
        options={{ headerShown: true, headerBackTitleVisible: true }}
      />
    ),
    [CongfigWithParams],
  );

  const LoginComponent = useMemo(
    () =>
      loggedIn ? (
        companyID !== undefined ? (
          <Stack.Screen key="App" name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen key="SelectCompany" name="SelectCompany" component={CompanyNavigator} />
        )
      ) : (
        <Stack.Screen key="LogIn" name="LogIn" component={SignInScreen} />
      ),
    [loggedIn, companyID],
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
