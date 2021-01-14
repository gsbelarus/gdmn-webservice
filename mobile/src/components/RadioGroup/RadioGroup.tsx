// import React, { Component, useState } from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

// export interface IOption {
//   id: number;
//   label: string;
//   labelView?: any;
// }

// type Props = {
//   options: IOption[];
//   horizontal?: boolean;
//   circleStyle?: { [name: string]: string };
//   activeButtonId?: number | string;
//   onChange: (option: IOption) => void;
// };

// const RadioGroup = ({ options, onChange, activeButtonId }: Props) => {
//   return (
//     <View>
//       {options.map((res) => {
//         <View key={res.id} style={styles.container}>
//           <TouchableOpacity style={styles.radioCircle} onPress={() => onChange(res)}>
//             <Text style={styles.radioText}>{res.label}</Text>
//             {options[activeButtonId] === res.id && <View style={styles.selectedRb} />}
//           </TouchableOpacity>
//         </View>;
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 35,
//   },
//   radioCircle: {
//     alignItems: 'center',
//     borderColor: '#3740ff',
//     borderRadius: 100,
//     borderWidth: 2,
//     height: 30,
//     justifyContent: 'center',
//     width: 30,
//   },
//   radioText: {
//     color: '#000',
//     fontSize: 20,
//     fontWeight: '700',
//     marginRight: 35,
//   },
//   selectedRb: {
//     backgroundColor: '#3740ff',
//     borderRadius: 50,
//     height: 15,
//     width: 15,
//   },
// });
import { useTheme } from '@react-navigation/native';
import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from 'constants';
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import ItemSeparator from '../ItemSeparator';
import Circle from './Circle';

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
  //const [selectedOptionId, setSelectedOptionId] = useState(activeButtonId);
  const { colors } = useTheme();

  const onPress = useCallback(
    (option) => {
      //console.log(option.id);
      if (option.id === activeButtonId) {
        return;
      }
      //setSelectedOptionId(option.id);
      onChange(option);
      //console.log(option.id);
    },
    [onChange, activeButtonId],
  );

  console.log('RadioGroup');

  return (
    <View style={styles.container}>
      {options.map((option) => {
        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.itemContainer,
              { borderColor: options[activeButtonId].id === option.id ? colors.primary : '#FFF' },
              horizontal && styles.horizontalRow,
            ]}
            onPress={() => {
              console.log('onPress');
              onPress(option);
            }}
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
      <ItemSeparator />
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
