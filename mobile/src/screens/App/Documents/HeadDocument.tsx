import React from 'react';
import { View } from 'react-native';
import { Title } from 'react-native-paper';

import styles from '../../../styles/global';

const HeadDocumentScreen = () => {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Head Document</Title>
    </View>
  );
};

export { HeadDocumentScreen };
