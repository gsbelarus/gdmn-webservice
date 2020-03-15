import React from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Title, Button, IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useStore } from '../../store';

export const SignInScreen = () => {
  const { state, actions } = useStore();
  const { colors } = useTheme();

  const logIn = () => {
    actions.setUserStatus(true);
  };

  return (
    <>
      <View style={styles.content}>
        <Title style={{ textAlign: 'center' }}>Вход пользователя</Title>
        <TextInput
          placeholder="Username"
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        />
        <Button mode="contained" onPress={logIn} style={styles.button}>
          Войти
        </Button>
      </View>
      <View style={{ alignItems: 'flex-end', backgroundColor: colors.background }}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => actions.disconnect()}
          style={{ ...styles.button, backgroundColor: colors.primary, borderColor: colors.primary }}
          color={colors.background}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)'
  },
  button: {
    margin: 8
  },
  text: {
    textAlign: 'center',
    margin: 8
  }
});
