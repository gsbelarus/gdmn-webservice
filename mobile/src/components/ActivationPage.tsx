import Constants from 'expo-constants';
import React, { useState, FC } from 'react';
import { StyleSheet, View, StatusBar, TextInput, Alert, Button } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

import { baseUrl } from '../helpers/utils';
import SubTitle from './SubTitle';

const ActivationPage: FC = (): JSX.Element => {
  const { navigate } = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const verifyCode = async () => {
    const data = await fetch(`${baseUrl}/device/verifyCode?code=${inputValue}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then((res) => res.json());
    if (data.status === 200) {
      await fetch(`${baseUrl}/device/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          uid: Constants.deviceId,
          userId: data.result,
        }),
      });
      return Alert.alert('Корректный код!', '', [
        {
          text: 'OK',
          onPress: () => navigate('Auth'),
        },
      ]);
    }
    if (data === 404) {
      return Alert.alert('Некорректный код!', 'Повторите ещё раз', [
        {
          text: 'OK',
          onPress: () => setInputValue(''),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.title}>
        <SubTitle subtitle="Регистрация устройства" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Введите код"
          placeholderTextColor={'#9A9FA1'}
          multiline={true}
          autoCapitalize="sentences"
          underlineColorAndroid="transparent"
          selectionColor={'black'}
          maxLength={50}
          returnKeyType="done"
          autoCorrect={false}
          blurOnSubmit={true}
          onSubmitEditing={verifyCode}
        />
      </View>
      <Button title="Отправить" onPress={verifyCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3EFF4',
    flex: 1,
    height: '100%',
  },
  input: {
    borderColor: '#3F4243',
    borderStyle: 'dashed',
    borderWidth: 1,
    color: 'black',
    fontSize: 24,
    fontWeight: '500',
    marginRight: 15,
    marginTop: 100,
  },
  inputContainer: {
    marginTop: 40,
    paddingLeft: 15,
  },
  title: {
    alignItems: 'center',
    marginRight: 10,
  },
});

export default ActivationPage;