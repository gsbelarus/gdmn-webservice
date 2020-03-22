import React from 'react';
import { View } from 'react-native';
import { Title } from 'react-native-paper';

import styles from '../../../styles/global';

const ViewReferenceScreen = () => {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>View Reference</Title>
    </View>
  );
};

export { ViewReferenceScreen };
