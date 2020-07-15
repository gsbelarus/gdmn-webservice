import { useTheme } from '@react-navigation/native';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import SubTitle from '../../../components/SubTitle';
import { ITara } from '../../../model';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

export interface IBoxingDetailsRef {
  done(): void;
}

interface MyInputProps {
  route: any;
  navigation: any;
}

const BoxingDetailScreen = forwardRef<IBoxingDetailsRef, MyInputProps>(({ route, navigation }, ref) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const boxing: ITara | undefined = state.boxings?.find((item) => item.id === route.params.boxingId);
  const [quantity, setQuantity] = useState('1');
  const [weight, setWeight] = useState((boxing.weight ?? 0).toString());

  useImperativeHandle(ref, () => ({
    done: () => {
      const idx = state.boxingsLine
        ? state.boxingsLine.findIndex(
            (item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId,
          )
        : -1;
      const idxl =
        idx > -1 && boxing ? state.boxingsLine[idx].lineBoxings.findIndex((item) => item.tarakey === boxing.id) : -1;
      const addBoxings =
        idxl > -1
          ? [
              ...state.boxingsLine[idx].lineBoxings.slice(0, idx),
              { tarakey: boxing.id, weight: Number.parseFloat(weight), quantity: Number(quantity) },
              ...state.boxingsLine[idx].lineBoxings.slice(idx + 1),
            ]
          : state.boxingsLine
          ? [
              ...(state.boxingsLine ? state.boxingsLine[idx].lineBoxings : []),
              { tarakey: boxing.id, weight: Number.parseFloat(weight), quantity: Number(quantity) },
            ]
          : [{ tarakey: boxing.id, weight: Number.parseFloat(weight), quantity: Number(quantity) }];
      const newBoxingsLine = { docId: route.params.docId, lineDoc: route.params.lineId, lineBoxings: addBoxings };
      const boxingsLine =
        idx === -1
          ? state.boxingsLine
            ? [...state.boxingsLine, newBoxingsLine]
            : [newBoxingsLine]
          : [...state.boxingsLine.slice(0, idx), newBoxingsLine, ...state.boxingsLine.slice(idx + 1)];
      actions.setBoxingsLine(boxingsLine);
      navigation.navigate('SellProductDetail', {
        lineId: route.params.lineId,
        prodId: route.params.prodId,
        docId: route.params.docId,
        modeCor: route.params.modeCor,
      });
    },
  }));

  return (
    <View
      style={[
        styles.container,
        localeStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>{boxing.name}</SubTitle>
      {boxing.type === 'paper' ? undefined : (
        <TextInput
          mode={'flat'}
          label={'Кол-во'}
          editable={boxing.type !== 'pan'}
          keyboardType="decimal-pad"
          value={quantity}
          onChangeText={setQuantity}
          theme={{
            colors: {
              placeholder: colors.primary,
            },
          }}
          style={{
            backgroundColor: colors.card,
          }}
        />
      )}
      <TextInput
        mode={'flat'}
        label={'Общий вес'}
        editable={boxing.type !== 'box'}
        keyboardType="decimal-pad"
        onChangeText={setWeight}
        value={weight}
        theme={{
          colors: {
            placeholder: colors.primary,
          },
        }}
        style={{
          backgroundColor: colors.card,
        }}
      />
    </View>
  );
});

export { BoxingDetailScreen };

const localeStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  title: {
    padding: 10,
  },
});
