import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ParamListBase, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Title, Text, Button, IconButton } from 'react-native-paper';

// type Props = {
//   navigation: StackNavigationProp<ParamListBase>;
// };

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
      <View style={styles.container}>
        <Title>Подключение к серверу</Title>
        <Text style={{ color: '#888', fontSize: 15 }}>{serverName}</Text>

        <Text style={{ color: '#888', fontSize: 15 }}>
          {deviceRegistered === undefined ? 'undefined' : deviceRegistered ? 'Registered' : 'not Registered'}
        </Text>
        <Text style={{ color: '#888', fontSize: 15 }}>
          {loggedIn === undefined ? 'undefined' : loggedIn ? 'logged' : 'not loggedIn'}
        </Text>
        {!isLoading ? (
          <Button onPress={connection} icon="autorenew" mode="contained" style={{ margin: 20 }}>
            Подключиться
          </Button>
        ) : (
          <>
            <ActivityIndicator size="large" color="#70667D" />
            <Button onPress={breakConnection} icon="block-helper" mode="contained">
              Прервать
            </Button>
          </>
        )}
        {isError ? <Text style={{ color: '#888', fontSize: 18 }}>Ошибка: {status}</Text> : null}
      </View>
      <View style={{ alignItems: 'flex-end', backgroundColor: colors.background }}>
        <IconButton
          icon="settings"
          size={30}
          onPress={() => console.log('Pressed')}
          style={{ ...styles.button, backgroundColor: colors.primary, borderColor: colors.primary }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    margin: 15,
    borderRadius: 50,
    borderWidth: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
