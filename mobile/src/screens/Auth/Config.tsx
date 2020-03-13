import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

const ConfigScreen = () => {
  return (
    <View style={styles.content}>
      <Title>Config</Title>
    </View>
  );
};

export default ConfigScreen;

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
