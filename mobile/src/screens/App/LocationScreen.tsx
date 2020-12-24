import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';

import SubTitle from '../../components/SubTitle';

const LocationScreen = () => {
  const { colors } = useTheme();

  return (
    <>
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Геолокация</SubTitle>
    </>
  );
};

export { LocationScreen };

const localeStyles = StyleSheet.create({
  title: {
    padding: 10,
  },
});
