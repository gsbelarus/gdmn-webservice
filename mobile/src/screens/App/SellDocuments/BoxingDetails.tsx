import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, RouteProp, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';

import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { ITara } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type BoxingDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BoxingDetail'>;
type BoxingDetailScreenRouteProp = RouteProp<RootStackParamList, 'BoxingDetail'>;

type Props = {
  route: BoxingDetailScreenRouteProp;
  navigation: BoxingDetailScreenNavigationProp;
};

const BoxingDetailScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const boxing: ITara | undefined = state.boxings?.find((item) => item.id === route.params.boxingId);
  const boxingsLine = state.boxingsLine?.find(
    (box) => box.docId === route.params.docId && box.lineDoc === route.params.lineId,
  );
  const boxingLine = boxingsLine?.lineBoxings?.find((box) => box.tarakey === route.params.boxingId);
  const [quantity, setQuantity] = useState(
    boxingLine && !Number.isNaN(boxingLine.quantity) ? boxingLine.quantity.toString() : '1',
  );
  const [weight, setWeight] = useState((boxing.weight ?? 0).toString());
  const isFocused = useIsFocused();

  useEffect(() => {
    if (boxing.type === 'box') {
      setWeight(((boxing.weight ?? 0) * Number(quantity)).toFixed(3).toString());
    }
  }, [boxing.type, boxing.weight, quantity]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            navigation.navigate('SelectBoxingsScreen', route.params);
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            const idx = state.boxingsLine
              ? state.boxingsLine.findIndex(
                  (item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId,
                )
              : -1;
            const idxl =
              idx > -1 && boxing && state.boxingsLine[idx].lineBoxings
                ? state.boxingsLine[idx].lineBoxings.findIndex((item) => item.tarakey === boxing.id)
                : -1;
            const addBoxings =
              idxl > -1
                ? [
                    ...state.boxingsLine[idx].lineBoxings.slice(0, idxl),
                    {
                      tarakey: boxing.id,
                      type: boxing.type,
                      weight: Number.parseFloat(weight),
                      quantity: Number(quantity),
                    },
                    ...state.boxingsLine[idx].lineBoxings.slice(idxl + 1),
                  ]
                : state.boxingsLine && idx > -1
                ? [
                    ...(state.boxingsLine ? state.boxingsLine[idx].lineBoxings : []),
                    {
                      tarakey: boxing.id,
                      type: boxing.type,
                      weight: Number.parseFloat(weight),
                      quantity: Number(quantity),
                    },
                  ]
                : [
                    {
                      tarakey: boxing.id,
                      type: boxing.type,
                      weight: Number.parseFloat(weight),
                      quantity: Number(quantity),
                    },
                  ];
            const newBoxingsLine = { docId: route.params.docId, lineDoc: route.params.lineId, lineBoxings: addBoxings };
            const updateBoxingsLine =
              idx === -1
                ? state.boxingsLine
                  ? [...state.boxingsLine, newBoxingsLine]
                  : [newBoxingsLine]
                : [...state.boxingsLine.slice(0, idx), newBoxingsLine, ...state.boxingsLine.slice(idx + 1)];
            actions.setBoxingsLine(updateBoxingsLine);
            navigation.navigate('SelectBoxingsScreen', route.params);
          }}
        />
      ),
    });
  }, [
    actions,
    boxing,
    navigation,
    quantity,
    route.params,
    route.params.docId,
    route.params.lineId,
    route.params.modeCor,
    state.boxingsLine,
    weight,
  ]);

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
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={isFocused}
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
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={boxing.type !== 'box' && isFocused}
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
      {boxingLine ? (
        <View style={localeStyles.buttons}>
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
                    const updateBoxingsLine =
                      idx > -1
                        ? [
                            ...state.boxingsLine.slice(0, idx),
                            {
                              ...state.boxingsLine[idx],
                              lineBoxings: state.boxingsLine[idx].lineBoxings.filter(
                                (box) => box.tarakey !== route.params.boxingId,
                              ),
                            },
                            ...state.boxingsLine.slice(idx + 1),
                          ]
                        : state.boxingsLine;
                    actions.setBoxingsLine(updateBoxingsLine);
                    navigation.navigate('SelectBoxingsScreen', route.params);
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
      ) : undefined}
    </View>
  );
};

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
