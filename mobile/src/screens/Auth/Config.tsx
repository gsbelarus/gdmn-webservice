import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import { styles } from '../../styles/global';

const ConfigScreen = () => {
  return (
    <View style={styles.container}>
      <Title>Config</Title>
    </View>
  );
};

export default ConfigScreen;
