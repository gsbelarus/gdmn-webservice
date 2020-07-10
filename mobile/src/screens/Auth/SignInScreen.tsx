import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, Keyboard } from 'react-native';
import { Text, TextInput, Button, IconButton, ActivityIndicator } from 'react-native-paper';

import { IResponse, IUserCredentials, IUser } from '../../../../common';
import SubTitle from '../../components/SubTitle';
import { timeout } from '../../helpers/utils';
import { IDataFetch } from '../../model';
import { useAuthStore, useServiceStore } from '../../store';
import styles from '../../styles/global';

/*
  Порядок работы:
  1) Проверяем что пользователь активен
    1.1 Если активен переходим к пунтку 2
    1.2 Если не активен отображаем сообщение
  2) Осуществляем вход
    2.1) Вход удался -> вызываем actions.setUserStatus(true);
    2.2) Вход не удался -> отображаем сообщение об ошибке
*/

const SignInScreen = () => {
  const { apiService } = useServiceStore();
  const { actions } = useAuthStore();
  const { colors } = useTheme();
  const [loginState, setLoginState] = useState<IDataFetch>({
    isLoading: false,
    isError: false,
    status: undefined,
  });

  const { actions: authActions } = useAuthStore();

  const [credential, setCredentials] = useState<IUserCredentials>({
    userName: '',
    password: '',
  });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // const finishLogin = async () => {
  //   const result = await appStorage.getItems([
  //     `${credential.userName}/SYNCHRONIZATION`,
  //     `${credential.userName}/AUTODELETING_DOCUMENT`,
  //   ]);
  //   actions.setSynchonization(result?.[0][1] && JSON.parse(result[0][1]).value);
  //   actions.setAutodeletingDocument(result?.[1][1] && JSON.parse(result[1][1]).value);
  //   actions.setUserID(credential.userName);
  //   actions.setUserStatus(true);
  // };

  // useEffect(() => {
  //   if (state.loggedIn) {
  //     // TODO: Не всегда заходит почему-то
  //     // TODO: setUserStatus совсемстить с setUserID
  //     actions.setUserID(credential.userName);
  //   }
  // }, [actions, credential.userName, state.loggedIn]);

  const logIn = useCallback(() => {
    Keyboard.dismiss();
    setLoginState({ isError: false, isLoading: true, status: undefined });
  }, []);

  useEffect(() => {
    if (!loginState.isLoading) {
      return;
    }

    const LoginUser = async () => {
      try {
        const device = await apiService.auth.getDeviceByUser(credential.userName);

        if (device.error === 'устройство не найдено') {
          // Устройство не найдено. Перенаправляем на ввод кода активации
          authActions.setUserStatus({ userID: null });
          authActions.setDeviceStatus(false);
          return;
        }

        if (!device.result) {
          setLoginState({
            isLoading: false,
            status: device.error,
            isError: true,
          });
          return;
        }
      } catch (err) {
        setLoginState({
          isLoading: false,
          status: err.message,
          isError: true,
        });
        return;
      }

      try {
        const res = await timeout<IResponse<string>>(5000, apiService.auth.login(credential));

        console.log('res', res);
        res.result
          ? actions.setUserStatus({
              userID: res.data,
            })
          : setLoginState({
              isLoading: false,
              status: res.error,
              isError: true,
            });
      } catch (err) {
        setLoginState({
          isLoading: false,
          status: err.message,
          isError: true,
        });
      }
    };
    LoginUser();
  }, [actions, apiService.auth, authActions, credential, credential.userName, loginState.isLoading]);

  return (
    <>
      <KeyboardAvoidingView
        style={[styles.container, isKeyboardVisible && localStyles.contentWidthKbd]}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <View>
          <SubTitle>Вход пользователя</SubTitle>
          <TextInput
            returnKeyType="done"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            placeholder="Имя пользователя"
            value={credential.userName}
            onChangeText={(val) => setCredentials({ ...credential, userName: val })}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          />
          <TextInput
            returnKeyType="done"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            placeholder="Пароль"
            secureTextEntry
            value={credential.password}
            onChangeText={(val) => setCredentials({ ...credential, password: val })}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          />
          <Button
            mode="contained"
            disabled={loginState.isLoading}
            icon={'login'}
            onPress={logIn}
            style={styles.rectangularButton}
          >
            Войти
          </Button>
        </View>
        <View style={localStyles.statusBox}>
          {loginState.isError && <Text style={localStyles.errorText}>Ошибка: {loginState.status}</Text>}
          {loginState.isLoading && <ActivityIndicator size="large" color="#70667D" />}
        </View>
      </KeyboardAvoidingView>
      <View style={styles.bottomButtons}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => actions.disconnect()}
          style={{
            ...styles.circularButton,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const localStyles = StyleSheet.create({
  buttons: {
    width: '100%',
  },
  container: {
    justifyContent: 'center',
  },
  contentWidthKbd: {
    justifyContent: 'flex-start',
  },
  errorText: {
    color: '#cc5933',
    fontSize: 18,
  },
  statusBox: {
    alignItems: 'center',
    height: 100,
  },
  title: {
    textAlign: 'center',
  },
});

export { SignInScreen };
