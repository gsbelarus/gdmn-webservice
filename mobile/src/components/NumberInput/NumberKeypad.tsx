import { evaluate } from 'mathjs';
import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';

import { IKeyProps, Key } from './Key';

interface IProps {
  oldValue?: string;
  handelDismiss: () => void;
  handelApply: (newValue: string) => void;
}

const NumberKeypad = ({ oldValue, handelDismiss, handelApply }: IProps) => {
  const [expression, setExpression] = useState('');
  const [number, setNumber] = useState('');

  const handleNumberPress = ({ value }: { value: string }) => {
    setNumber((prev) => {
      value = `${prev}${value}`;
      value = Number.isNaN(parseFloat(value)) ? '0' : value ?? '0';

      const validNumber = new RegExp(/^(\d{1,6}(.))?\d{0,4}$/);
      return validNumber.test(value) ? value : prev;
    });
  };

  const handleOperationPress = ({ value }: { value: string }) => {
    if (!expression && !!oldValue && !number) {
      setExpression((prev) => `${prev}${oldValue}${value}`);
    } else if (number) {
      setExpression((prev) => `${prev}${number}${value}`);
      setNumber('');
    } else {
      setExpression((prev) => `${prev.slice(0, -1)}${value}`);
    }
  };

  const keys: IKeyProps[][] = [
    [
      { title: '7', onPress: () => handleNumberPress({ value: '7' }) },
      { title: '8', onPress: () => handleNumberPress({ value: '8' }) },
      { title: '9', onPress: () => handleNumberPress({ value: '9' }) },
      { title: 'C', onPress: () => setNumber(''), operation: true },
    ],
    [
      { title: '4', onPress: () => handleNumberPress({ value: '4' }) },
      { title: '5', onPress: () => handleNumberPress({ value: '5' }) },
      { title: '6', onPress: () => handleNumberPress({ value: '6' }) },
      { title: '−', onPress: () => handleOperationPress({ value: '-' }), operation: true },
    ],
    [
      { title: '1', onPress: () => handleNumberPress({ value: '1' }) },
      { title: '2', onPress: () => handleNumberPress({ value: '2' }) },
      { title: '3', onPress: () => handleNumberPress({ value: '3' }) },
      { title: '+', onPress: () => handleOperationPress({ value: '+' }), operation: true },
    ],
    [
      { title: '0', onPress: () => handleNumberPress({ value: '0' }), grow: 2 },
      { title: '.', onPress: () => handleNumberPress({ value: '.' }) },
      {
        title: '=',
        onPress: () => {
          handelApply(evaluate(`${expression}${number}`).toFixed(3).toString());
          handelDismiss();
        },
        operation: true,
      },
    ],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Text>{expression}</Text>
        <Text style={styles.currentNumber}>{number}</Text>
      </View>
      <View style={styles.keypad}>
        {keys.map((rowKeys, idx) => (
          <View key={idx} style={styles.keypadRow}>
            {rowKeys.map((keyProps) => (
              <Key key={keyProps.title} {...keyProps} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export { NumberKeypad };

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 2.6,
  },
  currentNumber: {
    color: Colors.blue600,
    fontSize: 18,
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.grey300,
    borderTopWidth: 1,
    height: 50,
  },
  keypad: {
    backgroundColor: Colors.grey300,
    flex: 1,
  },
  keypadRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
