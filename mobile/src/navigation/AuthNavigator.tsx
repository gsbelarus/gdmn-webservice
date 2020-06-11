import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useReducer, useCallback, useMemo } from 'react';

import { IResponse, IUser, IDevice, IBaseUrl } from '../../../common';
import config from '../config';
import { createCancellableSignal } from '../helpers/utils';
import { IDataFetch } from '../model';
import AppNavigator from '../navigation/AppNavigator';
import { SplashScreen, SignInScreen, ConfigScreen, ActivationScreen } from '../screens/Auth';
import { useAuthStore, useServiceStore } from '../store';
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
    apiService,
  } = useServiceStore();

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
    console.log('useEffect: apiService.auth, deviceRegistered, signal, state.serverReq');
    /* Нажата кнопка подключиться (или начальное состояние 'подключение')
      deviceRegistered ещё не определно и состояние isLoading = true
       => 1. Запрос к серверу devices/:id
    */
    const getDeviceStatus = async () => {
      console.info('REQUEST: devices/:id');
      try {
        const response = await apiService.auth.getDevice();
        // const response: IResponse<IDevice> = await timeoutWithСancellation<IResponse<IDevice>>(
        //   signal,
        //   5000,
        //   apiService.auth.getDevice(),
        // );
        console.log('result', response.result);
        setState({ type: 'SET_RESPONSE', result: response.result, data: response.data });
      } catch (err) {
        setState({ type: 'SET_ERROR', text: err.message });
      }
    };

    if (deviceRegistered === undefined && state.serverReq?.isLoading) {
      getDeviceStatus();
    }
    // if (deviceRegistered === undefined && state.serverReq?.isLoading) {
    //   console.log('break request');
    //   timeoutWithСancellation(signal, 5000, apiService.auth.getDevice())
    //     .then((response: IResponse<IDevice>) =>
    //       setState({ type: 'SET_RESPONSE', result: response.result, data: response.data }),
    //     )
    //     .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }));
    // }
  }, [apiService.auth, deviceRegistered, signal, state.serverReq]);

  useEffect(() => {
    if (state.serverResp) {
      // TODO вызов 3 раза
      console.info('RESPONSE: devices/:id. Result', state.serverResp.result);
      authActions.setDeviceStatus(state.serverResp.result as boolean);
    }
  }, [authActions, state.serverResp]);

  useEffect(() => {
    /* 2. Если устройства найдено (deviceRegistered = true)
      то делаем отправляем запрос на проверку пользователя (пользователь передаётся из куки)
    */
    const getUser = async () => {
      console.info('REQUEST: auth/user');
      try {
        const result = await apiService.auth.getUserStatus();
        const userStatus = { userID: isUser(result.data) ? result.data.id : null };
        console.info('   user status:', userStatus);
        authActions.setUserStatus(userStatus);
      } catch (err) {
        setState({ type: 'SET_ERROR', text: err.message });
      }
    };

    deviceRegistered ? getUser() : authActions.setUserStatus({ userID: undefined });
  }, [authActions, apiService.auth, deviceRegistered, signal]);
  // Вынести всё в store  - deviceRegistered

  useEffect(() => {
    if (!userID) {
      /* При обнулении userID сбрасываем состояние состояния в навигаторе */
      console.log('useEffect: [userID] init');
      setState({ type: 'INIT' });
    }
  }, [userID]);

  const connection = useCallback(() => setState({ type: 'SET_CONNECTION' }), []);

  const breakConnection = useCallback(() => cancel(), [cancel]);

  const showSettings = useCallback(() => setState({ type: 'SETTINGS_FORM', showSettings: true }), []);

  const hideSettings = useCallback(() => setState({ type: 'SETTINGS_FORM', showSettings: false }), []);

  const changeSettings = useCallback(
    (newServerUrl: IBaseUrl) => {
      actions.setServerUrl(newServerUrl);
      setState({ type: 'SETTINGS_FORM', showSettings: false });
    },
    [actions],
  );

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
    [
      breakConnection,
      connection,
      deviceRegistered,
      userID,
      showSettings,
      state?.serverReq?.isLoading,
      state?.serverReq?.isError,
      state?.serverReq?.status,
      serverUrl?.server,
      serverUrl?.port,
    ],
  );

  const CongfigWithParams = useCallback(
    () => (
      <ConfigScreen
        {...{ hideSettings, changeSettings }}
        serverName={`${serverUrl?.protocol}${serverUrl?.server}`}
        serverPort={serverUrl?.port}
      />
    ),
    [hideSettings, changeSettings, serverUrl?.protocol, serverUrl?.server, serverUrl?.port],
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
    console.log('useMemo: LoginComp', userID);
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

  const AuthConfig = useMemo(() => {
    console.log('AuthConfig: deviceRegistered ', deviceRegistered);
    console.log('AuthConfig: userID ', userID);

    return deviceRegistered !== undefined && userID !== undefined ? (
      RegisterComponent
    ) : (
      <Stack.Screen
        key="Splash"
        name="Splash"
        component={SplashWithParams}
        options={{ animationTypeForReplace: 'pop' }}
      />
    );
  }, [RegisterComponent, SplashWithParams, deviceRegistered, userID]);

  return <Stack.Navigator headerMode="none">{state.showSettings ? ConfigComponent : AuthConfig}</Stack.Navigator>;
};

export default AuthNavigator;
