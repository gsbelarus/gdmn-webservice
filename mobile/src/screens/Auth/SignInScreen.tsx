import React from 'react';
import { View, TextInput } from 'react-native';
import { Title, Button, IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useStore } from '../../store';
import { styles } from '../../styles/global';

export const SignInScreen = () => {
  const { state, actions } = useStore();
  const { colors } = useTheme();

  const logIn = () => {
    actions.setUserStatus(true);
  };

  return (
    <>
    {
      //KeyboardAvoidingView
      //Этот компонент позволяет отображать внутренние компоненты в видимой области. Даже когда откроется клавиатура.
    }
      <View style={styles.container}>
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
        <Button mode="contained" onPress={logIn} style={styles.rectangularButton}>
          Войти
        </Button>
      </View>
      <View style={{ alignItems: 'flex-end', backgroundColor: colors.background }}>
        <IconButton
          icon="server"
          size={30}
          onPress={() => actions.disconnect()}
          style={{ ...styles.circularButton, backgroundColor: colors.primary, borderColor: colors.primary }}
          color={colors.background}
        />
      </View>
    </>
  );
};
