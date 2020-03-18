import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Keyboard } from 'react-native';
import { Title, Text, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useStore } from '../../store';
import { styles } from '../../styles/global';
import { IUserCredentials, IDataFetch, IServerResponse } from '../../model';
import { createCancellableSignal, timeout } from '../../helpers/utils';
import { authApi } from '../../api/auth';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export const SignInScreen = () => {
  const { state, actions } = useStore();
  const [lognState, setLoginState] = useState<IDataFetch>({ isLoading: false, isError: false, status: undefined });
  const [serverResp, setServerResp] = useState<IServerResponse<boolean | string>>(undefined);
  const [credential, setCredentials] = useState<IUserCredentials>({ userName: '', password: '' });
  const { signal, cancel } = useMemo(() => createCancellableSignal(), [lognState.isLoading]);
  const { colors } = useTheme();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  /*
    Порядок работы:
    1) Проверяем что пользователь активен
      1.1 Если активен переходим к пунтку 2
      1.2 Если не активен отображаем сообщение
    2) Осуществляем вход
     2.1) Вход удался -> вызываем actions.setUserStatus(true);
     2.2) Вход не удался -> отображаем сообщение об ошибке
  */

  const logIn = useCallback(() => {
    Keyboard.dismiss();
    setLoginState({ isError: false, isLoading: true, status: undefined });
  }, []);

  useEffect(() => {
    if (!lognState.isLoading) return;

    timeout(signal, 5000, authApi.getDeviceStatusByUser(credential.userName))
      .then((data: IServerResponse<boolean | string>) => setServerResp(data))
      .catch((err: Error) => setLoginState({ isLoading: false, status: err.message, isError: true }))
  }, [lognState.isLoading]);

  useEffect(() => {
    if (!serverResp) return;

    if (serverResp.status === 200 && !serverResp.result) {
      setLoginState({ isLoading: false, status: 'Пользователь заблокирован', isError: true });
      return;
    }

    if (serverResp.status === 200 && serverResp.result) {
      timeout(signal, 5000, authApi.login(credential))
        .then((data: IServerResponse<any>) => {
          data.status === 200
            ? actions.setUserStatus(true)
            : setLoginState({ isLoading: false, status: data.result, isError: true })
        })
        .catch((err: Error) => setLoginState({ isLoading: false, status: err.message, isError: true }))
      return;
    }
    // Иной вариант ответа
    setLoginState({ isLoading: false, status: serverResp.result as string, isError: true });
  }, [serverResp])

  return (
    <>
      <KeyboardAvoidingView
        style={[styles.container, isKeyboardVisible && { justifyContent: 'flex-start' }]}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View>
          {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
          <Title style={localeStyles.title}>Вход пользователя</Title>
          <TextInput
            placeholder="Имя пользователя"
            value={credential.userName}
            onChangeText={val => setCredentials({ ...credential, userName: val })}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          />
          <TextInput
            placeholder="Пароль"
            secureTextEntry
            value={credential.password}
            onChangeText={val => setCredentials({ ...credential, password: val })}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          />
          {/* </TouchableWithoutFeedback> */}
          <Button mode="contained" disabled={lognState.isLoading} icon={"login"} onPress={logIn} style={styles.rectangularButton}>
            Войти
          </Button>
        </View>
        <View style={{ ...localeStyles.statusBox, backgroundColor: colors.background }}>
          {lognState.isError && <Text style={localeStyles.errorText}>Ошибка: {lognState.status}</Text>}
          {lognState.isLoading && <ActivityIndicator size="large" color="#70667D" />}
        </View>
      </KeyboardAvoidingView>
      <View style={{ alignItems: 'flex-end', backgroundColor: colors.background }}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => actions.disconnect()}
          style={{ ...styles.circularButton, backgroundColor: colors.primary, borderColor: colors.primary }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const localeStyles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center'
  },
  buttons: {
    width: '100%'
  },
  errorText: {
    color: '#cc5933',
    fontSize: 18
  },
  statusBox: {
    alignItems: 'center',
    // justifyContent: 'center',
    height: 100
  }
});
