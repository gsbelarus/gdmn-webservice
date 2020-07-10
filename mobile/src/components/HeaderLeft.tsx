import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface IProps {
  text: string;
  onPress: () => void;
}

const HeaderLeft = ({ text, onPress }: IProps) => {
  return (
    <Button onPress={onPress} mode="text" style={localeStyles.marginLeft}>
      {text}
    </Button>
  );
};

export { HeaderLeft };

const localeStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 15,
  },
});
