import React from 'react';
import { View } from 'react-native';
import { Title, Text } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import styles from '../../../styles/global';

const HeadDocumentScreen = ({route}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Head Document</Title>
      <Text style={styles.title}>{route.params.docId}</Text>
    </View>
  );
};

export { HeadDocumentScreen };
