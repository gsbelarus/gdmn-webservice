import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import Constants from 'expo-constants';

const LoginPage = (): JSX.Element => {

const [loginValue, setLoginValue] = useState('');
const [passwordValue, setPasswordValue] = useState('');
const {navigate} = useNavigation();

const isActivateDevice = async () => {
  const data = await fetch(
    `http://192.168.0.63:3649/api/device/isActive?uid=${Constants.deviceId}&idUser=${loginValue}`,
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
      'http://192.168.0.63:3649/api/login',
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
        'Try again',
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
      'This device blocked for this user.',
      'Try again',
      [
        {
          text: 'OK', 
          onPress: () => setPasswordValue('')
        },
      ],
    );
  } else {
    return Alert.alert(
      'Unknown error',
      'Try again',
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
  <View style={styles.container}>
    <TextInput 
      style = {styles.input}
      value={loginValue}
      onChangeText = {setLoginValue}
      placeholder = "Login"
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
      placeholder = "Password"
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 200,
    backgroundColor: '#E3EFF4',
    flex: 1
  },
  input: {
    margin: 15,
    borderColor: '#70667D',
    borderWidth: 1,
    fontSize: 24,
    height: 40
 },
  submitButton: {
    backgroundColor: '#70667D',
    padding: 10,
    margin: 15,
    height: 40,
    alignItems: 'center'
 },
 submitButtonText:{
    color: 'white',
    fontSize: 18
 }
});

export default LoginPage;
