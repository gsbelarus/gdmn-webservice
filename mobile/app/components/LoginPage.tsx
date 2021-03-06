import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import Constants from 'expo-constants';
import { path } from '../../App';

const LoginPage = (): JSX.Element => {

const [loginValue, setLoginValue] = useState('');
const [passwordValue, setPasswordValue] = useState('');
const {navigate} = useNavigation();

const isActivateDevice = async () => {
  const data = await fetch(
    `${path}device/isActive?uid=${Constants.deviceId}&userId=${loginValue}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'},
      credentials: 'include',
    }
  ).then(res => res.json());
  return data.status === 200 ? data.result ? 'ACTIVE' : 'BLOCK'  : 'ERROR'
}

const account = async() => {

  const isBlock = await isActivateDevice();
  if(isBlock === 'ACTIVE') {
    const data = await fetch(
      `${path}login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          userName: loginValue,
          password: passwordValue
        })
      }
    ).then(res => res.json());
    if (data.status === 200) {
      navigate('App')
    } else {
      return Alert.alert(
        data.result,
        'Неправильный логин или пароль',
        [
          {
            text: 'OK',
            onPress: () => setPasswordValue('')
          },
        ],
      );
    }
  } else if(isBlock === 'BLOCK') {
    return Alert.alert(
      'Устройство заблокировано!',
      'Обратитесь к администратору',
      [
        {
          text: 'OK',
          onPress: () => setPasswordValue('')
        },
      ],
    );
  } else {
    return Alert.alert(
      'Неизвестная ошибка',
      '',
      [
        {
          text: 'OK',
          onPress: () => setPasswordValue('')
        },
      ],
    );
  }
}

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <View style={styles.container}>
        <TextInput
          style = {styles.input}
          value={loginValue}
          onChangeText = {setLoginValue}
          placeholder = "Логин"
          placeholderTextColor = "#9A9FA1"
          multiline={true}
          autoCapitalize="sentences"
          underlineColorAndroid = "transparent"
          selectionColor={'black'}
          maxLength={20}
          returnKeyType="done"
          autoCorrect={false}
        />
        <TextInput
          style = {styles.input}
          value={passwordValue}
          onChangeText = {setPasswordValue}
          placeholder = "Пароль"
          placeholderTextColor = "#9A9FA1"
          multiline={true}
          autoCapitalize="sentences"
          underlineColorAndroid = "transparent"
          selectionColor={'black'}
          maxLength={25}
          returnKeyType="done"
          autoCorrect={false}
        />
        <TouchableOpacity
          style = {styles.submitButton}
          onPress = {account}
          >
          <Text style = {styles.submitButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#E3EFF4',
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    margin: 15,
    borderColor: '#2D3083',
    borderWidth: 1,
    fontSize: 24,
    height: 50,
  },
  submitButton: {
    backgroundColor: '#2D3083',
    padding: 8,
    margin: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
 submitButtonText:{
    color: 'white',
    fontSize: 18
  }
});

export default LoginPage;
