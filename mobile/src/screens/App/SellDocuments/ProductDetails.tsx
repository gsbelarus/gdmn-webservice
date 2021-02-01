import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, RouteProp, useIsFocused, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, TextInput } from 'react-native-paper';
// import Reactotron from 'reactotron-react-native';

import { IDocument, IGood } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
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

  const [document, setDocument] = useState<ISellDocument | IDocument | undefined>();
  const [product, setProduct] = useState<IGood | undefined>();
  const [line, setLine] = useState<ISellLine | undefined>();
  const [goodQty, setGoodQty] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!route.params) {
      return;
    }

    // Выполняется если переданы параметры
    // инициализация данных: продукт, документ

    setProduct(state.goods.find((item) => item.id === route.params.prodId));
    setDocument(state.documents.find((item) => item.id === route.params.docId));
  }, [route.params, state.documents, state.goods]);

  useEffect(() => {
    if (!document || !product || route.params?.weighedGood) {
      return;
    }
    // Поиск сохранённой позиции
    let docLine: ISellLine = (document as ISellDocument)?.lines?.find((item) => item.id === route.params.lineId);

    if (!docLine) {
      docLine = {
        id: '0',
        goodId: product?.id,
        quantity: 1,
        manufacturingDate: new Date(document.head.date).toISOString().slice(0, 10),
        tara: [],
        numreceive: state.weighedGoods.find((item) => {
          const date = item.datework.split('.').reverse();
          return (
            new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]) + 1).toISOString().slice(0, 10) ===
              new Date(document.head.date).toISOString().slice(0, 10) && item.goodkey === product?.id
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

    if ((state.formParams as ISellLine)?.quantity.toString() !== goodQty) {
      actions.setFormParams({ ...line, quantity: parseFloat(goodQty.replace(',', '.')) });
    }
  }, [actions, goodQty, line, state.formParams]);

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

            const editLine = (document as ISellDocument)?.lines.find(
              (item) =>
                item.numreceive === (state.formParams as ISellLine).numreceive && item.goodId === route.params?.prodId,
            );

            if ((line?.id && route?.params?.modeCor) || editLine) {
              const idLine = editLine ? editLine.id : line ? line.id : (state.formParams as ISellLine).id;
              const newLine = {
                ...(editLine ?? line),
                ...(state.formParams as ISellLine),
                id: idLine,
                quantity: route?.params?.modeCor
                  ? Number((state.formParams as ISellLine).quantity)
                  : Number((state.formParams as ISellLine).quantity) +
                    Number(editLine ? editLine.quantity : line.quantity),
                tara: !route?.params?.modeCor
                  ? (editLine ? editLine.tara ?? [] : (line as ISellLine).tara ?? []).concat(
                      (state.formParams as ISellLine).tara ?? [],
                    )
                  : (state.formParams as ISellLine).tara ?? [],
                barcodes: [
                  ...(editLine ? editLine.barcodes ?? [] : line ? line.barcodes ?? [] : []),
                  ...(route.params?.barcode
                    ? [route.params?.barcode.length === 12 ? route.params?.barcode : route.params?.barcode.slice(1)]
                    : []),
                ],
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
  }, [actions, document, line, navigation, product, route.params, saved, state.boxingsLine, state.formParams]);

  const onPress = () => {
    if (isKeyboardVisible) {
      return;
    }

    navigation.navigate('SelectBoxingsScreen', {
      lineId: route.params?.lineId,
      prodId: route.params?.prodId,
      docId: route.params?.docId,
      modeCor: route.params?.modeCor,
    });
  };

  const handleQuantityChange = useCallback((value: string) => {
    setGoodQty((prev) => {
      value = value.replace(',', '.');
      value = Number.isNaN(parseFloat(value)) ? '0' : value ?? '0';

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      const res = parseFloat(validNumber.test(value) ? value : prev).toString();

      return res;
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={[
            styles.container,
            localStyles.container,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>
            {product?.name || 'товар не найден'}
          </SubTitle>
          <TextInput
            mode={'flat'}
            label={'Номер партии'}
            editable={true}
            onChangeText={(text) => {
              actions.setFormParams({
                ...(state.formParams as ISellLine),
                numreceive: text,
              });
            }}
            value={(state.formParams as ISellLine)?.numreceive ?? ''}
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={{
              backgroundColor: colors.card,
            }}
          />
          <TextInput
            mode={'flat'}
            label={'Количество по заявке'}
            editable={false}
            value={((state.formParams as ISellLine)?.orderQuantity ?? 0).toString()}
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={{
              backgroundColor: colors.card,
            }}
          />
          <TextInput
            mode={'flat'}
            label={'Количество'}
            editable={true}
            keyboardType="decimal-pad"
            onChangeText={handleQuantityChange}
            returnKeyType="done"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isFocused}
            value={((state.formParams as ISellLine)?.quantity ?? 0).toString()}
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={{
              backgroundColor: colors.card,
            }}
          />
          <View style={localStyles.text}>
            <Text style={[localStyles.subdivisionText, { color: colors.primary }]}>Дата производства: </Text>
            <View style={[localStyles.areaChips, { borderColor: colors.border }]}>
              <TouchableOpacity
                style={localStyles.containerDate}
                onPress={() => {
                  if (isKeyboardVisible) {
                    return;
                  }
                  navigation.navigate('SelectDateScreen', {
                    parentScreen: 'SellProductDetail',
                    fieldName: 'manufacturingDate',
                    title: 'Дата производства:',
                    value: new Date((state.formParams as ISellLine)?.manufacturingDate ?? document?.head.date)
                      .toISOString()
                      .slice(0, 10),
                  });
                }}
              >
                <Text style={[localStyles.textDate, { color: colors.text }]}>
                  {getDateString((state.formParams as ISellLine)?.manufacturingDate || document?.head.date)}
                </Text>
                <MaterialIcons style={localStyles.marginRight} size={30} color={colors.text} name="date-range" />
              </TouchableOpacity>
            </View>
          </View>
          <ItemSeparator />

          <TouchableOpacity style={localStyles.boxingsLine} onPress={onPress}>
            <View style={(localStyles.paddingLeft10, { width: '80%' })}>
              <Text
                style={
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    color: colors.primary,
                    fontSize:
                      (state.formParams as ISellLine)?.tara && (state.formParams as ISellLine)?.tara.length !== 0
                        ? 11
                        : 16,
                  }
                }
              >
                Тара
              </Text>
              {(state.formParams as ISellLine)?.tara && (state.formParams as ISellLine)?.tara.length !== 0 ? (
                <Text>
                  {(state.formParams as ISellLine).tara.map((item, idx) => {
                    const box = state.boxings.find((itemBox) => itemBox.id === item.tarakey);
                    return `${box ? box.name : 'неизвестная тара'}${
                      idx === (state.formParams as ISellLine).tara.length - 1 ? '' : ', '
                    } `;
                  })}
                </Text>
              ) : null}
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export { SellProductDetailScreen };

const localStyles = StyleSheet.create({
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  boxingsLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 60,
    padding: 10,
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  containerDate: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
  },
  marginRight: {
    marginRight: 10,
  },
  paddingLeft10: {
    //paddingLeft: 10,
  },
  subdivisionText: {
    fontSize: 11,
    textAlign: 'left',
  },
  text: {
    padding: 10,
  },
  textDate: {
    flex: 1,
    flexGrow: 4,
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    padding: 10,
  },
});
