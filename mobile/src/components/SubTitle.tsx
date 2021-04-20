import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface IProps {
  children?: unknown;
  colorText?: unknown;
  styles?: unknown;
}

const SubTitle = ({ children, colorText, styles }: IProps) => {
  return (
    <View style={[localStyles.titleContainer, styles]}>
      <Text style={[localStyles.titleText, colorText && { color: colorText as string }]}>
        {((children as string) || '').toUpperCase()}
      </Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
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
