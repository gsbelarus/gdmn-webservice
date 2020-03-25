import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, View, Button } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import Constants from 'expo-constants';
import { baseUrl } from '../helpers/utils';
import { useStore } from '../store';
import config from '../config';

const LoginPage = (): JSX.Element => {
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const { navigate } = useNavigation();
  const { state, actions } = useStore();

  useEffect(() => {
    // Если сброшен флаг регистрации то переходим на страничку входа в систему
    if (state.deviceRegistered === undefined) {
      navigate('Auth');
      Alert.alert('Тест', '', [{ text: 'OK' }]);
    }
  }, [state.deviceRegistered]);

  const isActivateDevice = async () => {
    const data = await fetch(`${baseUrl}/device/isActive?uid=${Constants.deviceId}&userId=${loginValue}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => res.json());
    return data.status === 200 ? (data.result ? 'ACTIVE' : 'BLOCK') : 'ERROR';
  };

  const account = async () => {
    const isBlock = await isActivateDevice();
    if (isBlock === 'ACTIVE') {
      const data = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userName: loginValue,
          password: passwordValue,
        }),
      }).then(res => res.json());
      if (data.status === 200) {
        navigate('App');
      } else {
        return Alert.alert(data.result, 'Неправильный логин или пароль', [
          {
            text: 'OK',
            onPress: () => setPasswordValue(''),
          },
        ]);
      }
    } else if (isBlock === 'BLOCK') {
      return Alert.alert('Устройство заблокировано!', 'Обратитесь к администратору', [
        {
          text: 'OK',
          onPress: () => setPasswordValue(''),
        },
      ]);
    } else {
      return Alert.alert('Неизвестная ошибка', '', [
        {
          text: 'OK',
          onPress: () => setPasswordValue(''),
        },
      ]);
    }
  };

  const _disconnectAsync = async () => {
    Alert.alert('Отключиться от сервера?', '', [
      {
        text: 'Подтвердить',
        onPress: async () => {
          // const res = await authApi.logout();
          // if (res.status === 200) {
          actions.disconnect();
          return;
          // }
          // return Alert.alert(
          //   'Ошибка сервера', res.result,
          //   [
          //     {
          //       text: 'OK'
          //     },
          //   ],
          // );
        },
      },
      {
        text: 'Отмена',
      },
    ]);
  };

  const server = `${config.server.name}:${config.server.port}`;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <View style={styles.login}>
          <View style={styles.info}>
            <Text style={{ color: '#888', fontSize: 18 }}>Подключение к серверу</Text>
            <Button onPress={_disconnectAsync} title={server} />
          </View>
          <TextInput
            style={styles.input}
            value={loginValue}
            onChangeText={setLoginValue}
            placeholder="Логин"
            placeholderTextColor="#9A9FA1"
            multiline={false}
            autoCapitalize="sentences"
            underlineColorAndroid="transparent"
            selectionColor={'black'}
            maxLength={20}
            returnKeyType="done"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            value={passwordValue}
            onChangeText={setPasswordValue}
            placeholder="Пароль"
            placeholderTextColor="#9A9FA1"
            multiline={false}
            autoCapitalize="sentences"
            underlineColorAndroid="transparent"
            selectionColor={'black'}
            maxLength={25}
            returnKeyType="done"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.submitButton} onPress={account}>
            <Text style={styles.submitButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#E3EFF4',
    flex: 2,
    justifyContent: 'flex-start',
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    margin: 5,
    borderColor: '#2D3083',
    borderWidth: 1,
    fontSize: 24,
    height: 35,
  },
  submitButton: {
    backgroundColor: '#2D3083',
    padding: 0,
    margin: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default LoginPage;
