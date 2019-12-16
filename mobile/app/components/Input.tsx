import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export interface IInputProps {
  inputValue: string;
  onChangeText: any;
  sendCode: any;
}

const Input = (props: IInputProps) => {
  const { inputValue, onChangeText, sendCode } = props;
  return (
  <TextInput
    style={styles.input}
    value={inputValue}
    onChangeText={onChangeText}
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
    onSubmitEditing={sendCode}
  />
  )
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3F4243',
    marginTop: 200,
    marginRight: 15,
    fontSize: 24,
    color: 'black',
    fontWeight: '500'
  }
});

export default Input;
