import { useTheme } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard
} from "react-native";
import {
  Text,
  Button,
  IconButton,
  ActivityIndicator
} from "react-native-paper";

import authApi from "../../api/auth";
import SubTitle from "../../components/SubTitle";
import { timeout } from "../../helpers/utils";
import { IUserCredentials, IDataFetch, IServerResponse } from "../../model";
import { useStore } from "../../store";
import styles from "../../styles/global";

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
  const { actions } = useStore();
  const { colors } = useTheme();
  const [lognState, setLoginState] = useState<IDataFetch>({
    isLoading: false,
    isError: false,
    status: undefined
  });
  const [serverResp, setServerResp] = useState<
    IServerResponse<boolean | string>
  >(undefined);
  const [credential, setCredentials] = useState<IUserCredentials>({
    userName: "",
    password: ""
  });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const logIn = useCallback(() => {
    Keyboard.dismiss();
    setLoginState({ isError: false, isLoading: true, status: undefined });
  }, []);

  useEffect(() => {
    if (!lognState.isLoading) {
      return;
    }

    timeout(5000, authApi.getDeviceStatusByUser(credential.userName))
      .then((data: IServerResponse<boolean | string>) => setServerResp(data))
      .catch((err: Error) =>
        setLoginState({ isLoading: false, status: err.message, isError: true })
      );
  }, [credential.userName, lognState.isLoading]);

  useEffect(() => {
    if (!serverResp) {
      return;
    }

    if (serverResp.status === 200 && !serverResp.result) {
      setLoginState({
        isLoading: false,
        status: "Пользователь заблокирован",
        isError: true
      });
      return;
    }

    if (serverResp.status === 200 && serverResp.result) {
      timeout(5000, authApi.login(credential))
        .then((data: IServerResponse<string>) => {
          data.status === 200
            ? actions.setUserStatus(true)
            : setLoginState({
                isLoading: false,
                status: data.result,
                isError: true
              });
        })
        .catch((err: Error) =>
          setLoginState({
            isLoading: false,
            status: err.message,
            isError: true
          })
        );
      return;
    }
    // Иной вариант ответа
    setLoginState({
      isLoading: false,
      status: serverResp.result as string,
      isError: true
    });
  }, [actions, credential, serverResp]);

  return (
    <>
      <KeyboardAvoidingView
        style={[
          styles.container,
          isKeyboardVisible && localStyles.contentWidthKbd
        ]}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <View>
          <SubTitle>Вход пользователя</SubTitle>
          <TextInput
            placeholder="Имя пользователя"
            value={credential.userName}
            onChangeText={val =>
              setCredentials({ ...credential, userName: val })
            }
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text }
            ]}
          />
          <TextInput
            placeholder="Пароль"
            secureTextEntry
            value={credential.password}
            onChangeText={val =>
              setCredentials({ ...credential, password: val })
            }
            style={[
              styles.input,
              { backgroundColor: colors.card, color: colors.text }
            ]}
          />
          <Button
            mode="contained"
            disabled={lognState.isLoading}
            icon={"login"}
            onPress={logIn}
            style={styles.rectangularButton}
          >
            Войти
          </Button>
        </View>
        <View
          style={{
            ...localStyles.statusBox,
            backgroundColor: colors.background
          }}
        >
          {lognState.isError && (
            <Text style={localStyles.errorText}>
              Ошибка: {lognState.status}
            </Text>
          )}
          {lognState.isLoading && (
            <ActivityIndicator size="large" color="#70667D" />
          )}
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
            borderColor: colors.primary
          }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const localStyles = StyleSheet.create({
  buttons: {
    width: "100%"
  },
  container: {
    justifyContent: "center"
  },
  contentWidthKbd: {
    justifyContent: "flex-start"
  },
  errorText: {
    color: "#cc5933",
    fontSize: 18
  },
  statusBox: {
    alignItems: "center",
    height: 100
  },
  title: {
    textAlign: "center"
  }
});

export { SignInScreen };
