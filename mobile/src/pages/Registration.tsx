import React, { useState, FC } from 'react';
import { View, StatusBar, TextInput, Text, Alert, Button } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from 'react-navigation-hooks';
import { baseUrl } from '../helpers/utils';
import { styles } from '../styles/global';
import { useTheme } from '@react-navigation/native';

const ActivationPage: FC = (): JSX.Element => {
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const verifyCode = async () => {
    const data = await fetch(`${baseUrl}/device/verifyCode?code=${inputValue}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => res.json());
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
      <Text style={{ textAlign: 'center' }}>Регистрация устройства</Text>
      <View style={styles.input}>
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

export default ActivationPage;
