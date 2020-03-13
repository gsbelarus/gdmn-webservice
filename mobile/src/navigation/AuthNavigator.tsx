import React, { useEffect, useReducer, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, YellowBox } from 'react-native';
import { authApi } from '../api/auth';
import { timeout } from '../helpers/utils';
import { useStore } from '../store';
import { IDataFetch, IServerResponse, IUser } from '../model';

import config from '../config/index';
import AppNavigator from '../navigation/AppNavigator';
import { useTheme, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '../screens/Auth/SplashScreen';
import { SignInScreen } from '../screens/Auth/SignInScreen';

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
  const { colors } = useTheme();
  const [state, setState] = useReducer(reducer, initialState);

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
      timeout(5000, authApi.getDeviceStatus())
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
        timeout(5000, authApi.getUserStatus())
          .then((data: IServerResponse<IUser | string>) => actions.setUserStatus(isUser(data.result)))
          .catch((err: Error) => setState({ type: 'SET_ERROR', text: err.message }))
      : actions.setUserStatus(false);
  }, [deviceRegistered]);

  useEffect(() => {
    // Устанавливаем начальное состояние
    setState({ type: 'INIT' });
  }, [loggedIn]);

  const connection = useCallback(() => {
    setState({ type: 'SET_CONNECTION' });
  }, []);

  const breakConnection = useCallback(() => {
    setState({ type: 'SET_CONNECTION' });
  }, []);

  const SplashWithParams = () => (
    <SplashScreen
      {...{ breakConnection, connection, deviceRegistered, loggedIn }}
      isLoading={state.serverReq!.isLoading}
      serverName={`${baseUrl.server}:${baseUrl.port}`}
    />
  );

  return (
    <Stack.Navigator>
      {deviceRegistered !== undefined && loggedIn !== undefined ? (
        !deviceRegistered ? (
          <Stack.Screen key="DeviceRegister" name="DeviceRegister" component={SplashScreen} options={{headerShown: false}} />
        ) : loggedIn ? (
          <Stack.Screen key="App" name="App" component={AppNavigator} options={{headerShown: false}} />
        ) : (
          <Stack.Screen key="LogIn" name="LogIn" component={SignInScreen} options={{headerShown: false}} />
        )
      ) : (
        <Stack.Screen key="Splash" name="Splash" component={SplashWithParams} options={{headerShown: false}} />
      )}
      {/* ) : state.showSettings ? (
    <Settings confirm={() => setState({ type: 'SETTINGS_FORM', showSettings: false })} />
  ) : (
    <>
      <View style={{ ...styles.container, backgroundColor: colors.background }}>
        <Title>Подключение к серверу</Title>
        <Text style={{ color: '#888', fontSize: 15 }}>{`${baseUrl.server}:${baseUrl.port}`}</Text>

        <Text style={{ color: '#888', fontSize: 15 }}>
          {deviceRegistered === undefined ? 'undefined' : deviceRegistered ? 'Registered' : 'not Registered'}
        </Text>
        <Text style={{ color: '#888', fontSize: 15 }}>
          {loggedIn === undefined ? 'undefined' : loggedIn ? 'logged' : 'not loggedIn'}
        </Text>
        {!state.serverReq?.isLoading ? (
          <Button
            onPress={() => setState({ type: 'SET_CONNECTION' })}
            icon="autorenew"
            mode="contained"
            style={{ margin: 20 }}
          >
            Подключиться
          </Button>
        ) : (
          <>
            <ActivityIndicator size="large" color="#70667D" />
            <Button onPress={() => setState({ type: 'SET_ERROR', text: 'прервано пользователем' })} icon="block-helper">
              Прервать
            </Button>
          </>
        )}
        {state.serverReq?.isError ? (
          <Text style={{ color: '#888', fontSize: 18 }}>Ошибка: {state.serverReq?.status}</Text>
        ) : null}
      </View>
      <View style={{ alignItems: 'flex-end', backgroundColor: colors.background }}>
        <IconButton
          icon="settings"
          size={30}
          onPress={() => console.log('Pressed')}
          style={{ ...styles.button, backgroundColor: colors.primary, borderColor: colors.primary }}
          color={colors.background}
        />
      </View>
    </>))  */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    margin: 15,
    borderRadius: 50,
    borderWidth: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
