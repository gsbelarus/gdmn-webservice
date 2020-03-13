import * as React from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useStore } from '../../store';


export const SignInScreen = () => {
  const { state, actions } = useStore();
  const { colors } = useTheme();

  const logIn = () => {
    actions.setUserStatus(true);
  }

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="Username"
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <Button mode="contained" onPress={logIn} style={styles.button}>
        Sign in
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  button: {
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
});
