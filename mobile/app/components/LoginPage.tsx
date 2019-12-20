import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';

const LoginPage = (): JSX.Element => {

const [loginValue, setLoginValue] = useState('');
const [passwordValue, setPasswordValue] = useState('');

const account = (login, password) => {
  const receivedLogin = 'user';
  const receivedPassword = '12345';
  if (login === '' && password === '') {
    return Alert.alert(
      'Enter login and password',
      '',
      [
        {
          text: 'OK', 
          onPress: () => console.log('Enter login and password'),
        },
      ],
    );
  } 
  if (login === receivedLogin && password === receivedPassword) {
    return Alert.alert(
      'Success',
      '',
      [
        {
          text: 'OK', 
          onPress: () => setPasswordValue(''),
        },
      ],
    );
  }
  if (login === receivedLogin && password !== receivedPassword) {
    return Alert.alert(
      'Your password is incorrect',
      'Try again',
      [
        {
          text: 'OK', 
          onPress: () => setPasswordValue(''),
        },
      ],
    );
  }
  if (login !== receivedLogin && password !== receivedPassword) {
    return Alert.alert(
      'Your login and password are incorrect',
      'Try again',
      [
        {
          text: 'OK', 
          onPress: () => setPasswordValue(''),
        },
      ],
    );
  }
  if (login !== receivedLogin && password !== receivedPassword) {
    return Alert.alert(
      'Your login is incorrect',
      'Try again',
      [
        {
          text: 'OK', 
          onPress: () => setPasswordValue(''),
        },
      ],
    );
  }
  if (login === '' && password !== '') {
    return Alert.alert(
      'Enter login',
      '',
      [
        {
          text: 'OK', 
          onPress: () => setPasswordValue(''),
        },
      ],
    );
  }
  if (login !== '' && password === '') {
    return Alert.alert(
      'Enter password',
      '',
      [
        {
          text: 'OK', 
          onPress: () => setPasswordValue(''),
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
      onPress = {() => account(loginValue, passwordValue)}
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
