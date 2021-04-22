import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View, BackHandler, useWindowDimensions } from 'react-native';

import { TextInputWithIcon } from '../TextInputWithIcon';
import { NumberKeypad } from './NumberKeypad';

interface IProps {
  label: string;
  value: string;
  isKeyboardVisible: boolean;
  position?: number;
  setValue: (newValue: string) => void;
  handlePress: () => void;
}

const NumberInput = ({ isKeyboardVisible, label, position, value, setValue, handlePress }: IProps) => {
  const { colors } = useTheme();
  const height = useWindowDimensions().height;
  const headerHeight = useHeaderHeight();

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
              top: -position,
              height: height - headerHeight,
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
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    //zIndex: 99999,
  },
  marginRight: {
    alignItems: 'center',
    marginRight: 10,
  },
});
