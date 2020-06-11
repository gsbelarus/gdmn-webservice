import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useReducer, useCallback, useMemo } from 'react';
import { AsyncStorage } from 'react-native';

import { IResponse, IUser, IDevice, IBaseUrl } from '../../../common';
import config from '../config';
import { createCancellableSignal, timeoutWithСancellation } from '../helpers/utils';
import { IDataFetch } from '../model';
import AppNavigator from '../navigation/AppNavigator';
import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen } from '../screens/Auth';
import { useAuthStore, useApiStore } from '../store';
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
    state: { deviceRegistered, userID, companyID },
    actions: authActions,
  } = useAuthStore();

  const {
    state: { serverUrl },
    actions,
    api,
  } = useApiStore();

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
    console.log('useEffect: api.auth, deviceRegistered, signal, state.serverReq');
    /* 1. Запрос к серверу*/
    if (deviceRegistered ?? state.serverReq?.isLoading) {
      console.log('breack request');
      timeoutWithСancellation(signal, 5000, api.auth.getDevice())
        .then((response: IResponse<IDevice>) =>
          setState({ type: 'SET_RESPONSE', result: response.result, data: response.data }),
        )
        .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }));
    }
  }, [api.auth, deviceRegistered, signal, state.serverReq]);

  useEffect(() => {
    console.log('useEffect: authActions, state.serverResp');
    if (state.serverResp) {
      // TODO вызов 3 раза
      console.log('state.serverResp', state.serverResp);
      authActions.setDeviceStatus(state.serverResp.result as boolean);
    }
  }, [authActions, state.serverResp]);

  useEffect(() => {
    console.log('useEffect: authActions, api.auth, deviceRegistered, signal');
    if (deviceRegistered === undefined) {
      return;
    }
    deviceRegistered
      ? timeoutWithСancellation(signal, 5000, api.auth.getUserStatus())
          .then((data: IResponse<IUser>) => {
            const userStatus = isUser(data.data) ? { userID: data.data.id } : undefined;
            authActions.setUserStatus(userStatus);
          })
          .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }))
      : authActions.setUserStatus({ userID: undefined });
  }, [authActions, api.auth, deviceRegistered, signal]);
  // Вынести всё в store  - deviceRegistered

  useEffect(() => {
    console.log('useEffect: userID');
    setState({ type: 'INIT' });
  }, [userID]);

  const connection = useCallback(() => setState({ type: 'SET_CONNECTION' }), []);

  const breakConnection = useCallback(() => cancel(), [cancel]);

  const showSettings = useCallback(() => setState({ type: 'SETTINGS_FORM', showSettings: true }), []);

  const hideSettings = useCallback(() => setState({ type: 'SETTINGS_FORM', showSettings: false }), []);

  const changeSettings = useCallback(
    (newserverUrl: IBaseUrl) => {
      AsyncStorage.setItem('pathServer', JSON.stringify(newserverUrl))
        .then(() => actions.setServerUrl(newserverUrl))
        .catch(() => setState({ type: 'SETTINGS_FORM', showSettings: false }));
    },
    [actions],
  );

  useEffect(() => {
    console.log('useEffect: api, serverUrl');
    if (serverUrl !== undefined) {
      setState({ type: 'SETTINGS_FORM', showSettings: false });
      api.setUrl(serverUrl);
    }
  }, [api, serverUrl]);

  const SplashWithParams = useCallback(
    () => (
      <SplashScreen
        {...{ breakConnection, connection, deviceRegistered, userID, showSettings }}
        isLoading={state?.serverReq.isLoading}
        isError={state?.serverReq?.isError}
        status={state?.serverReq?.status}
        serverName={`${serverUrl?.server}:${serverUrl?.port}`}
      />
    ),
    [breakConnection, connection, deviceRegistered, serverUrl, showSettings, state, userID],
  );

  const CongfigWithParams = useCallback(
    () => (
      <ConfigScreen
        {...{ hideSettings, changeSettings }}
        serverName={`${serverUrl?.protocol}${serverUrl?.server}`}
        serverPort={serverUrl?.port}
      />
    ),
    [hideSettings, changeSettings, serverUrl],
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

  const LoginComponent = useMemo(() => {
    console.log('useMemo: LoginComp');
    return userID ? (
      companyID !== undefined ? (
        <Stack.Screen key="App" name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen key="SelectCompany" name="SelectCompany" component={CompanyNavigator} />
      )
    ) : (
      <Stack.Screen key="LogIn" name="LogIn" component={SignInScreen} />
    );
  }, [userID, companyID]);

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
      deviceRegistered !== undefined /* && userID !== undefined*/ ? (
        RegisterComponent
      ) : (
        <Stack.Screen
          key="Splash"
          name="Splash"
          component={SplashWithParams}
          options={{ animationTypeForReplace: 'pop' }}
        />
      ),
    [RegisterComponent, SplashWithParams, deviceRegistered /*, userID*/],
  );

  return <Stack.Navigator headerMode="none">{state.showSettings ? ConfigComponent : AuthConfig}</Stack.Navigator>;
};

export default AuthNavigator;
