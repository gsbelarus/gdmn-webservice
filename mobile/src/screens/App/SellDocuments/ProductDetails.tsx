import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, RouteProp, useIsFocused, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Keyboard, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, TextInput } from 'react-native-paper';
import Reactotron from 'reactotron-react-native';

import { IGood } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import { NumberInput } from '../../../components/NumberInput';
import SubTitle from '../../../components/SubTitle';
import { Subsection } from '../../../components/Subsection';
import { TextInputWithIcon } from '../../../components/TextInputWithIcon';
import { getDateString, getNextDocLineId } from '../../../helpers/utils';
import { ISellLine, ISellDocument } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { DocumentStackParamList } from '../../../navigation/SellDocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type SellProductDetailScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'SellProductDetail'>,
  StackNavigationProp<DocumentStackParamList>
>;
type SellProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'SellProductDetail'>;

type Props = {
  route: SellProductDetailScreenRouteProp;
  navigation: SellProductDetailScreenNavigationProp;
};

const SellProductDetailScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const [document, setDocument] = useState<ISellDocument | undefined>();
  const [product, setProduct] = useState<IGood | undefined>();
  const [line, setLine] = useState<ISellLine | undefined>();
  const [goodQty, setGoodQty] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isNumberKeyboardVisible, setNumberKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();

  const { quantity = 0, tara, id, numreceive, orderQuantity = 0 } = ((state.formParams as unknown) ?? {}) as ISellLine;

  const manufacturingDate = (state.formParams as ISellLine)?.manufacturingDate ?? document?.head.date;

  useEffect(() => {
    if (!route.params) {
      return;
    }

    // Выполняется если переданы параметры
    // инициализация данных: продукт, документ

    setProduct(state.goods.find((item) => item.id === route.params.prodId));
    setDocument(state.documents.find((item) => item.id === route.params.docId) as ISellDocument);
  }, [route.params, state.documents, state.goods]);

  useEffect(() => {
    if (!document || !product || route.params?.weighedGood) {
      return;
    }
    // Поиск сохранённой позиции
    let docLine: ISellLine = document?.lines?.find((item) => item.id === route.params.lineId);

    const headDate = new Date(document.head.date).toISOString().slice(0, 10);

    if (!docLine) {
      docLine = {
        id: '0',
        goodId: product?.id,
        quantity: 0,
        manufacturingDate: headDate,
        tara: [],
        numreceive: state.weighedGoods.find((item) => {
          const date = item.datework.split('.').reverse();
          return (
            new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]) + 1).toISOString().slice(0, 10) ===
              headDate && item.goodkey === product?.id
          );
        })?.numreceive,
      };
    }

    setGoodQty(docLine.quantity.toString());

    setLine(docLine);

    actions.setFormParams(docLine);
    actions.setBoxingsLine([{ docId: document.id, lineDoc: docLine.id, lineBoxings: docLine.tara ?? [] }]);
  }, [route.params, document, actions, product, state.weighedGoods]);

  useEffect(() => {
    if (!document || !product || !route.params?.weighedGood) {
      return;
    }
    // Если добавление идёт взвешенного товара - передан route.params?.weighedGood

    const weighedGood = state.weighedGoods.find((item) => item.id === route.params.weighedGood);

    const good = weighedGood ? state.goods.find((item) => item.id === weighedGood.goodkey) : undefined;
    const date = weighedGood.datework.split('.').reverse();

    if (!good) {
      return;
    }

    const docLine: ISellLine = {
      id: route.params?.lineId,
      goodId: product.id,
      quantity: weighedGood && good ? weighedGood.weight / good.itemWeight : 0,
      manufacturingDate: new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]) + 1).toISOString().slice(0, 10),
      numreceive: weighedGood.numreceive,
      tara: [],
    };

    setGoodQty(docLine.quantity.toString());

    setLine(docLine);

    actions.setFormParams(docLine);
    actions.setBoxingsLine([{ docId: document.id, lineDoc: docLine.id, lineBoxings: docLine.tara ?? [] }]);
  }, [
    actions,
    document,
    product,
    route.params?.lineId,
    route.params.prodId,
    route.params.weighedGood,
    state.goods,
    state.weighedGoods,
  ]);

  useEffect(() => {
    if (!line) {
      return;
    }

    if (quantity.toString() !== goodQty) {
      actions.setFormParams({ ...line, quantity: parseFloat(goodQty.replace(',', '.')) });
    }
  }, [actions, goodQty, line, quantity]);

  useEffect(() => {
    if (isFocused) {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }
  }, [isFocused]);

  useEffect(() => {
    if ((state.formParams as ISellLine)?.manufacturingDate && !!line) {
      actions.setFormParams({
        ...(state.formParams as ISellLine),
        numreceive: state.weighedGoods.find((item) => {
          const date = item.datework.split('.').reverse();
          return (
            item.goodkey === line.goodId &&
            new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]) + 1).toISOString().slice(0, 10) ===
              (state.formParams as ISellLine)?.manufacturingDate
          );
        })?.numreceive,
      });
    }
  }, [(state.formParams as ISellLine)?.manufacturingDate]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            actions.setBoxingsLine([]);
            actions.clearFormParams();
            navigation.navigate('ViewSellDocument', { docId: document?.id });
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            if (saved) {
              return;
            }

            setSaved(true);

            const editLine = document?.lines.find(
              (item) => item.numreceive === numreceive && item.goodId === route.params?.prodId,
            );

            if ((line?.id && route?.params?.modeCor) || editLine) {
              const idLine = editLine ? editLine.id : line ? line.id : id;
              const newLine = {
                ...(editLine ?? line),
                ...(state.formParams as ISellLine),
                id: idLine,
                quantity: route?.params?.modeCor
                  ? Number(quantity)
                  : Number(quantity) + Number(editLine ? editLine.quantity : line.quantity),
                tara: !route?.params?.modeCor
                  ? (editLine ? editLine.tara ?? [] : (line as ISellLine).tara ?? []).concat(tara ?? [])
                  : (state.formParams as ISellLine).tara ?? [],
                barcodes: [
                  ...(editLine ? editLine.barcodes ?? [] : line ? line.barcodes ?? [] : []),
                  ...(route.params?.barcode
                    ? [route.params?.barcode.length === 12 ? route.params?.barcode : route.params?.barcode.slice(1)]
                    : []),
                ],
                numreceive,
              };

              actions.editLine({
                docId: route.params?.docId,
                line: newLine,
              });
            } else {
              actions.addLine({
                docId: route.params?.docId,
                line: {
                  goodId: route.params?.prodId,
                  ...(state.formParams as ISellLine),
                  id: getNextDocLineId(document).toString(),
                  barcodes: route.params.barcode
                    ? [route.params?.barcode.length === 12 ? route.params?.barcode : route.params?.barcode.slice(1)]
                    : [],
                },
              });
            }
            actions.setBoxingsLine([]);
            actions.clearFormParams();

            navigation.navigate('ViewSellDocument', { docId: document?.id });
          }}
        />
      ),
    });
  }, [
    actions,
    document,
    line,
    navigation,
    product,
    route.params,
    saved,
    state.boxingsLine,
    state.formParams,
    id,
    numreceive,
    tara,
    quantity,
  ]);

  const onPress = () => {
    if (isKeyboardVisible) {
      return;
    }

    setNumberKeyboardVisible(false);

    navigation.navigate('SelectBoxingsScreen', {
      lineId: route.params?.lineId,
      prodId: route.params?.prodId,
      docId: route.params?.docId,
      modeCor: route.params?.modeCor,
      express: false,
    });
  };

  //---Окно календаря для выбора даты производства---
  const [showDate, setShowDate] = useState(false);

  const handleApplyDate = (_, selectedDate: Date) => {
    //Закрываем календарь и записываем выбранную дату в параметры формы
    setShowDate(false);

    if (selectedDate) {
      actions.setFormParams({ ...state.formParams, manufacturingDate: selectedDate.toISOString().slice(0, 10) });
    }
  };

  const [positionNK, setPositionNK] = useState(0);

  return (
    <>
      <SafeAreaView style={localStyles.flex1}>
        <ScrollView contentContainerStyle={localStyles.flex1}>
          <View
            style={[
              styles.container,
              localStyles.container,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <View>
              <SubTitle styles={[localStyles.title, { backgroundColor: colors.primary }]} colorText={colors.card}>
                {product?.name || 'товар не найден'}
              </SubTitle>
              <Subsection styles={{ backgroundColor: colors.background }}>Параметры</Subsection>
              <View style={localStyles.groupFields}>
                <TextInput
                  mode={'flat'}
                  label={'Партия'}
                  editable={true}
                  onChangeText={(text) => {
                    actions.setFormParams({
                      ...(state.formParams as ISellLine),
                      numreceive: text,
                    });
                  }}
                  value={numreceive ?? ''}
                  onFocus={() => setNumberKeyboardVisible(false)}
                  theme={{
                    colors: {
                      placeholder: colors.primary,
                    },
                  }}
                  style={[localStyles.flex1, { backgroundColor: colors.card }]}
                />
                <TextInputWithIcon
                  label={'Дата производства'}
                  value={getDateString(manufacturingDate)}
                  onPress={() => {
                    setShowDate(true);
                    setNumberKeyboardVisible(false);
                  }}
                >
                  <MaterialIcons style={localStyles.marginRight} size={20} color={colors.text} name="date-range" />
                </TextInputWithIcon>
              </View>
              <Subsection styles={{ backgroundColor: colors.background }}>Отгружено</Subsection>
              <View
                onLayout={(obj) => {
                  setPositionNK(obj.nativeEvent.layout.y + obj.nativeEvent.layout.height);
                }}
              />
              <View style={localStyles.groupFields}>
                <TextInput
                  mode={'flat'}
                  label={'По заявке'}
                  editable={false}
                  value={orderQuantity.toString()}
                  style={[localStyles.flex1, { backgroundColor: colors.card }]}
                />
                <NumberInput
                  isKeyboardVisible={isNumberKeyboardVisible}
                  value={goodQty}
                  setValue={setGoodQty}
                  handlePress={() => {
                    Keyboard.dismiss();
                    setNumberKeyboardVisible(!isNumberKeyboardVisible);
                  }}
                  position={positionNK}
                  label={'Количество'}
                />
              </View>
              <TouchableOpacity style={localStyles.boxingsLine} onPress={onPress}>
                <View style={(localStyles.paddingLeft10, { width: '80%' })}>
                  <Text
                    style={
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        color: colors.primary,
                        fontSize: tara && tara.length !== 0 ? 11 : 16,
                      }
                    }
                  >
                    Тара
                  </Text>
                  {tara && tara.length !== 0 ? (
                    <Text>
                      {(state.formParams as ISellLine).tara.map((item, idx) => {
                        const box = state.boxings.find((itemBox) => itemBox.id === item.tarakey);
                        return `${box ? box.name : 'неизвестная тара'}${idx === tara.length - 1 ? '' : ', '} `;
                      })}
                    </Text>
                  ) : null}
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
              </TouchableOpacity>
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date(manufacturingDate)}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  onChange={handleApplyDate}
                />
              )}
            </View>
            {route?.params?.modeCor && !isNumberKeyboardVisible && (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Вы уверены, что хотите удалить позицию?', '', [
                    {
                      text: 'OK',
                      onPress: () => {
                        actions.deleteLine({ docId: route.params?.docId, lineId: route.params?.lineId });
                        navigation.goBack();
                      },
                    },
                    {
                      text: 'Отмена',
                    },
                  ]);
                }}
                style={localStyles.buttonContainer}
              >
                <Text style={localStyles.button}>Удалить позицию</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export { SellProductDetailScreen };

const localStyles = StyleSheet.create({
  boxingsLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 60,
    padding: 10,
  },
  button: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    backgroundColor: '#FC3F4D',
    borderRadius: 10,
    //elevation: 8,
    margin: 10,
    padding: 10,
  },
  container: {
    justifyContent: 'space-between',
    padding: 0,
  },
  flex1: {
    flex: 1,
  },
  groupFields: {
    flexDirection: 'row',
    width: '100%',
  },
  marginRight: {
    marginRight: 10,
  },
  paddingLeft10: {
    //paddingLeft: 10,
  },
  title: {
    padding: 10,
  },
});
