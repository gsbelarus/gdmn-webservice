import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubTitle = (props: {subtitle: string}) => {
  return (
  <View style={styles.titleContainer}>
    <Text style={styles.titleText}>{props.subtitle.toUpperCase()}</Text>
  </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 40
  },
  titleText: {
    color: '#333536',
    fontSize: 16,
    fontWeight: '500'
  }
});

export default SubTitle;
