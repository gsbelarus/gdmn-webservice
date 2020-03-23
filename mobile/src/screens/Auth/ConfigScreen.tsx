import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import SubTitle from '../../components/SubTitle';
import styles from '../../styles/global';

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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <SubTitle>Настройка подключения</SubTitle>
      <TextInput
        value={newServerName}
        onChangeText={setNewServerName}
        placeholder="Адрес сервера"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <TextInput
        value={newServerPort}
        onChangeText={setNewServerPort}
        placeholder="Порт"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      />
      <View style={localeStyles.buttonsView}>
        <Button
          onPress={hideSettings}
          icon="check"
          mode="contained"
          style={[styles.rectangularButton, localeStyles.button]}
        >
          Готово
        </Button>
        <Button
          onPress={hideSettings}
          icon="cancel"
          mode="contained"
          style={[styles.rectangularButton, localeStyles.button]}
        >
          Отмена
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const localeStyles = StyleSheet.create({
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export { ConfigScreen };
