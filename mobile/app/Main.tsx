import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, TextInput, Alert, TouchableOpacity } from 'react-native';
import SubTitle from './components/SubTitle';

const Main = (): JSX.Element => {

const [inputValue, setInputValue] = useState('');
const verifyCode = async () => {
  const data = await fetch(
    'http://192.168.0.66:3649/api/device/verifyCode',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({'code': inputValue})
    }
  ).then(res => res.json())
  .then(res => res.status)
  if (data === 200) {
    return Alert.alert(
      'Your code is correct!',
      '',
      [
        {
          text: 'OK', 
          onPress: () => setInputValue('')
        },
      ],
    );
  }
  if (data === 404) { 
    return Alert.alert(
      'Your code is incorrect!',
      'Try again',
      [
        {
          text: 'OK', 
          onPress: () => setInputValue('')
        },
      ],
    );
  }
}

return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.title}>
        <SubTitle subtitle='Please enter your code' />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type here to enter your code"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3EFF4',
    flex: 1
  },
  deleteAllButton: {
    marginRight: 10,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3F4243',
    marginTop: 200,
    marginRight: 15,
    fontSize: 24,
    color: 'black',
    fontWeight: '500'
  },
  inputContainer: {
    marginTop: 40,
    paddingLeft: 15
  },
  title: {
    marginRight: 10,
    alignItems: 'center'
  },
});

export default Main;
