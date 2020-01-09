import React, { useState, FC } from 'react';
import { StyleSheet, View, StatusBar, TextInput, Alert, TouchableOpacity } from 'react-native';
import SubTitle from './SubTitle';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks'

const ActivationPage: FC = (): JSX.Element => {
const {navigate} = useNavigation();
const [inputValue, setInputValue] = useState('');
const verifyCode = async () => {
  const data = await fetch(
    `http://192.168.0.63:3649/api/device/verifyCode?code=${inputValue}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'},
      credentials: 'include',
    }
  ).then(res => res.json())
  if (data.status === 200) {
    console.log(data.result)
    fetch(
      `http://192.168.0.63:3649/api/device/new`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          uid: Constants.deviceId,
          idUser: data.result
        })
      }
    )
    return Alert.alert(
      'Your code is correct!',
      '',
      [
        {
          text: 'OK', 
          onPress: () => navigate('LoginPage')
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
      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => navigate('LoginPage')}>
          <MaterialIcons
            name="menu"
            size={28}
            color={'#9CAEBA'}
          />
        </TouchableOpacity>
      </View>
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
    flex: 1,
    height: '100%'
  },
  navigation: {
    marginLeft: 10,
    marginTop: 20
  },
  input: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3F4243',
    marginTop: 100,
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

export default ActivationPage;
