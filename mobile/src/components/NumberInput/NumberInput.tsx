import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, View, BackHandler } from 'react-native';

import { TextInputWithIcon } from '../TextInputWithIcon';
import { NumberKeypad } from './NumberKeypad';

interface IProps {
  label: string;
  value: string;
  isKeyboardVisible: boolean;
  setValue: (newValue: string) => void;
  handlePress: () => void;
}

const NumberInput = ({ isKeyboardVisible, label, value, setValue, handlePress }: IProps) => {
  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      const handleBack = () => {
        if (isKeyboardVisible) {
          handlePress();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', handleBack);

      return () => BackHandler.removeEventListener('hardwareBackPress', handleBack);
    }, [isKeyboardVisible, handlePress]),
  );

  return (
    <>
      <TextInputWithIcon label={label} onPress={handlePress} isFocus={isKeyboardVisible} value={value}>
        <MaterialCommunityIcons style={styles.marginRight} size={20} color={colors.text} name="calculator-variant" />
      </TextInputWithIcon>
      {isKeyboardVisible && (
        <View
          style={[
            styles.keypad,
            {
              //проблема на малых экранах, нужно поднять
              bottom: (-1.6 * Dimensions.get('window').height) / 2.6,
            },
          ]}
        >
          <NumberKeypad oldValue={value} handelApply={setValue} handelDismiss={handlePress} />
        </View>
      )}
    </>
  );
};

export { NumberInput };

const styles = StyleSheet.create({
  keypad: {
    backgroundColor: '#DDD',
    height: Dimensions.get('window').height / 2.6,
    position: 'absolute',
    width: '100%',
    zIndex: 99999,
  },
  marginRight: {
    alignItems: 'center',
    marginRight: 10,
  },
});
