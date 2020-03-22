import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Title, Text, Button, IconButton } from 'react-native-paper';

import styles from '../../styles/global';

type Props = {
  deviceRegistered?: boolean;
  loggedIn?: boolean;
  serverName?: string;
  isLoading?: boolean;
  isError?: boolean;
  status?: string;
  connection?: () => void;
  breakConnection?: () => void;
  showSettings?: () => void;
};

const SplashScreen = (props: Props) => {
  const {
    deviceRegistered,
    loggedIn,
    serverName,
    isLoading,
    isError,
    status,
    connection,
    breakConnection,
    showSettings,
  } = props;

  const { colors } = useTheme();

  const deviseStatus =
    deviceRegistered === undefined ? 'undefined' : deviceRegistered ? 'Registered' : 'not Registered';
  const loginStatus = loggedIn === undefined ? 'undefined' : loggedIn ? 'logged' : 'not loggedIn';

  return (
    <>
      <View style={{ ...styles.container, ...localeStyles.container }}>
        <Title>Подключение к серверу</Title>
        <Text style={{ marginBottom: 10, color: '#888', fontSize: 15 }}>{serverName}</Text>
        <Text style={{ color: '#888', fontSize: 15 }}>Рег: {deviseStatus}</Text>
        <Text style={{ color: '#888', fontSize: 15 }}>Лог: {loginStatus}</Text>
        <View style={{ ...localeStyles.statusBox, backgroundColor: colors.background }}>
          {isError && <Text style={localeStyles.errorText}>Ошибка: {status}</Text>}
          {isLoading && <ActivityIndicator size="large" color="#70667D" />}
        </View>
        {!isLoading ? (
          <Button
            onPress={connection}
            icon="autorenew"
            mode="contained"
            style={[styles.rectangularButton, localeStyles.buttons]}
          >
            Подключиться
          </Button>
        ) : (
          <Button
            onPress={breakConnection}
            icon="block-helper"
            mode="contained"
            style={[styles.rectangularButton, localeStyles.buttons]}
          >
            Прервать
          </Button>
        )}
      </View>
      <View style={{ alignItems: 'flex-end', backgroundColor: colors.background }}>
        <IconButton
          icon="settings"
          size={30}
          onPress={showSettings}
          style={{ ...styles.circularButton, backgroundColor: colors.primary, borderColor: colors.primary }}
          color={colors.background}
        />
      </View>
    </>
  );
};

export { SplashScreen };

const localeStyles = StyleSheet.create({
  buttons: {
    width: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#cc5933',
    fontSize: 18,
  },
  statusBox: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
  },
});
