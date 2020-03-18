import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard, TextInput } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { styles } from '../../styles/global';
import { useTheme } from '@react-navigation/native';

type Props = {
  serverName?: string;
  serverPort?: number;
  hideSettings?: () => void;
};

const ConfigScreen = (props: Props) => {
  const { serverName, serverPort, hideSettings } = props;
  const [newServerName, setNewServerName] = useState(serverName);
  const [newServerPort, setNewServerPort] = useState(serverPort?.toString());
  const { colors } = useTheme();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={[styles.container, isKeyboardVisible && { justifyContent: 'flex-start' }]}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
    <Title style={{ alignItems: 'center'}}>Config</Title>
      <TextInput
        value={newServerName}
        onChangeText={setNewServerName}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <TextInput
        value={newServerPort}
        onChangeText={setNewServerPort}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button  onPress={hideSettings} icon="check" mode="contained" style={[styles.rectangularButton, {flex:1, marginRight: 7}]} >Готово</Button>
        <Button  onPress={hideSettings} icon="cancel" mode="contained" style={[styles.rectangularButton, {flex:1, marginLeft: 7}]} >Отмена</Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ConfigScreen;
