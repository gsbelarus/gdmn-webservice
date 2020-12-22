import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Circle from './Circle';

export interface IOption {
  id: number;
  label: string;
  labelView?: any;
}

type Props = {
  options: IOption[];
  horizontal?: boolean;
  circleStyle?: { [name: string]: string };
  activeButtonId?: number | string;
  onChange: (option: IOption) => void;
};

export const RadioGroup = ({ horizontal = false, options, circleStyle, onChange, activeButtonId }: Props) => {
  //const [selectedOptionId, setSelectedOptionId] = useState(activeButtonId);

  const onPress = useCallback(
    (option) => {
      if (option.id === activeButtonId) {
        return;
      }
      //setSelectedOptionId(option.id);
      onChange(option);
    },
    [onChange, activeButtonId],
  );

  return (
    <View style={[styles.container, horizontal && styles.horizontalRow]}>
      {options.map((option) => (
        <TouchableOpacity key={option.id} style={styles.radio} onPress={() => onPress(option)}>
          <Circle active={activeButtonId === option.id} circleStyle={circleStyle} />
          {option.label && <Text>{option.label}</Text>}
          {!option.label && option.labelView}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
  },
  horizontalRow: {
    flexDirection: 'row',
  },
  radio: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10,
  },
});

export default RadioGroup;
