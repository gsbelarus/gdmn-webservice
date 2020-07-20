import { useTheme } from '@react-navigation/native';
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

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
  const boxingsLine = state.boxingsLine.find(box => box.docId === route.params.docId && box.lineDoc === route.params.lineId);
  const boxingLine = boxingsLine ? boxingsLine.lineBoxings.find(box => box.tarakey === route.params.boxingId) : undefined;
  const [quantity, setQuantity] = useState(boxingLine ? boxingLine.quantity.toString() : '1');
  const [weight, setWeight] = useState((boxing.weight ?? 0).toString());

  useEffect(() => {
    if (boxing.type === 'box') {
      setWeight(((boxing.weight ?? 0) * Number(quantity)).toFixed(3).toString())
    }
  }, [quantity])

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
          : state.boxingsLine && idx > -1
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
          label={'Количество'}
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
      <TouchableOpacity
        style={[
          styles.circularButton,
          localeStyles.buttons,
          {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          },
        ]}
        onPress={async () => {
          Alert.alert('Вы уверены, что хотите удалить?', '', [
            {
              text: 'OK',
              onPress: async () => {
                const idx = state.boxingsLine
                  ? state.boxingsLine.findIndex(
                      (item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId,
                    )
                  : -1;
                const boxingsLine =
                  idx > -1 ?
                  [
                    ...state.boxingsLine.slice(0, idx),
                      {
                        ...state.boxingsLine[idx],
                        lineBoxings: state.boxingsLine[idx].lineBoxings.filter(box => box.tarakey !== route.params.boxingId)
                      },
                    ...state.boxingsLine.slice(idx + 1)
                  ] :
                  state.boxingsLine;
                actions.setBoxingsLine(boxingsLine);
                navigation.navigate('SellProductDetail', {
                  lineId: route.params.lineId,
                  prodId: route.params.prodId,
                  docId: route.params.docId,
                  modeCor: route.params.modeCor,
                });
              },
            },
            {
              text: 'Отмена',
            },
          ]);
        }}
      >
        <MaterialIcons size={30} color={colors.card} name="delete" />
      </TouchableOpacity>
    </View>
  );
});

export { BoxingDetailScreen };

const localeStyles = StyleSheet.create({
  buttons: {
    alignItems: 'center',
    margin: 10,
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  title: {
    padding: 10,
  },
});
