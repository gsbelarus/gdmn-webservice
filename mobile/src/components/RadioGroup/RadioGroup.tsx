import { useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export interface IOption {
  id: number;
  label: string;
  labelView?: any;
}

type Props = {
  options: IOption[];
  horizontal?: boolean;
  activeButtonId?: number | string;
  onChange: (option: IOption) => void;
};

export const RadioGroup = ({ horizontal = false, options, onChange, activeButtonId }: Props) => {
  const { colors } = useTheme();

  const onPress = useCallback(
    (option) => {
      if (option.id === activeButtonId) {
        return;
      }
      onChange(option);
    },
    [onChange, activeButtonId],
  );

  console.log('RadioGroup');

  return (
    <View style={styles.container}>
      <ScrollView>
        {options.map((option) => {
          return (
            <TouchableOpacity
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
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
