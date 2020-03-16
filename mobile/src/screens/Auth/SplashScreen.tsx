import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Title, Text, Button, IconButton } from 'react-native-paper';
import { styles } from '../../styles/global';

type Props = {
  deviceRegistered?: boolean;
  loggedIn?: boolean;
  serverName?: string;
  isLoading?: boolean;
  isError?: boolean;
  status?: string;
  connection?: () => void;
  breakConnection?: () => void;
};

export const SplashScreen = (props: Props) => {
  const { deviceRegistered, loggedIn, serverName, isLoading, isError, status, connection, breakConnection } = props;
  const { colors } = useTheme();
  return (
    <>
      <View style={{...styles.container, ...localeStyles.container}}>
        <Title>Подключение к серверу</Title>
        <Text style={{ marginBottom: 10, color: '#888', fontSize: 15 }}>{serverName}</Text>
        <Text style={{ color: '#888', fontSize: 15 }}>
          Рег: {deviceRegistered === undefined ? 'undefined' : deviceRegistered ? 'Registered' : 'not Registered'}
        </Text>
        <Text style={{ color: '#888', fontSize: 15 }}>
          Лог: {loggedIn === undefined ? 'undefined' : loggedIn ? 'logged' : 'not loggedIn'}
        </Text>
        <View style={{ justifyContent: 'center', height: 70, backgroundColor: colors.background }}>
          {isError ? <Text style={{ color: '#cc5933', fontSize: 18 }}>Ошибка: {status}</Text> : null}
          {isLoading && <ActivityIndicator size="large" color="#70667D" />}
        </View>
        {!isLoading ? (
          <Button onPress={connection} icon="autorenew" mode="contained" style={styles.rectangularButton}>
            Подключиться
          </Button>
        ) : (
            <>
              <Button onPress={breakConnection} icon="block-helper" mode="contained" style={styles.rectangularButton}>
                Прервать
              </Button>
            </>
          )}
      </View>
      <View style={{ alignItems: 'flex-end', backgroundColor: colors.background }}>
        <IconButton
          icon="settings"
          size={30}
          onPress={() => console.log('Pressed')}
          style={{ ...styles.circularButton, backgroundColor: colors.primary, borderColor: colors.primary }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const localeStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
