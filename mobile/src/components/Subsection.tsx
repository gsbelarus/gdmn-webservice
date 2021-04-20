import React from 'react';
import { StyleProp, StyleSheet, ViewStyle, Text, View } from 'react-native';

interface IProps {
  children?: unknown;
  styles?: StyleProp<ViewStyle>;
  colorText?: string;
}

const Subsection = ({ children, styles, colorText }: IProps) => {
  return (
    <View style={[localStyles.titleContainer, styles]}>
      <Text style={[localStyles.titleText, { color: colorText }]}>{((children as string) || '').toUpperCase()}</Text>
    </View>
  );
};

export { Subsection };

const localStyles = StyleSheet.create({
  titleContainer: {
    marginTop: 0,
    padding: 5,
  },
  titleText: {
    color: '#333536',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
