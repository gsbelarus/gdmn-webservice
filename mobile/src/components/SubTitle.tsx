import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const SubTitle = ({ children }) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{children.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 0,
  },
  titleText: {
    color: '#333536',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SubTitle;
