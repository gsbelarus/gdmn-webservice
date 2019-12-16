import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Input from './components/Input';
import SubTitle from './components/SubTitle';

const Main = (): JSX.Element => {

const [inputValue, setInputValue] = useState('');

const sendCode = async() => {
  //TODO: fetch to service
}

return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.title}>
        <SubTitle subtitle='Please enter your code' />
      </View>
      <View style={styles.inputContainer}>
        <Input
          inputValue={inputValue}
          onChangeText={setInputValue}
          sendCode={sendCode}
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
  inputContainer: {
    marginTop: 40,
    paddingLeft: 15
  },
  title: {
    marginRight: 10,
    alignItems: 'center',
  }
});

export default Main;
