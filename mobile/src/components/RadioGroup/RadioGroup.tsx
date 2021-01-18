import { TouchableHighlight } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface IOption {
  id: number;
  label: string;
}

type Props = {
  options: IOption[];
  horizontal?: boolean;
  activeButtonId?: number;
  onChange: (option: IOption) => void;
};

export const RadioGroup = ({ horizontal = false, options, onChange, activeButtonId }: Props) => {
  const { colors } = useTheme();
  // const [selectedRadio, setSelectedRadio] = useState<IOption>(activeButtonId);

  const onPress = useCallback(
    (option) => {
      if (option.id === activeButtonId) {
        return;
      }
      onChange(option);
    },
    [onChange, activeButtonId],
  );

  return (
    <View style={styles.container}>
      <View>
        {options.map((option) => {
          return (
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={colors.background}
              key={option.id}
              style={[
                styles.itemContainer,
                { borderColor: options[activeButtonId].id === option.id ? colors.primary : 'transparent' },
                horizontal && styles.horizontalRow,
              ]}
              onPress={() => onPress(option)}
            >
              <View style={[styles.item, { borderColor: colors.primary }]}>
                <Text style={styles.radioText}>{option.label}</Text>
                <View
                  style={[
                    styles.radioCircle,
                    { borderColor: options[activeButtonId].id === option.id ? colors.primary : colors.border },
                  ]}
                >
                  {options[activeButtonId].id === option.id && (
                    <View style={[styles.selectedRb, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  horizontalRow: {
    flexDirection: 'row',
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  itemContainer: {
    borderColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    marginRight: 8,
  },
  radioCircle: {
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  radioText: {
    color: '#000',
    fontSize: 16,
  },
  selectedRb: {
    borderRadius: 50,
    height: 10,
    width: 10,
  },
});

export default RadioGroup;
