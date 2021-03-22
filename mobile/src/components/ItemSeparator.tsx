import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import styles from '../styles/global';

const ItemSeparator = ( { vertical }: { vertical?: boolean }) => {
  const { colors } = useTheme();

  return <View style={[!!vertical ? {width: StyleSheet.hairlineWidth} : styles.separator, { backgroundColor: colors.border }]} />;
};

export default ItemSeparator;
