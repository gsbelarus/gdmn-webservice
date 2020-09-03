import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, RouteProp, useIsFocused, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, TextInput } from 'react-native-paper';

import { IDocument } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { getDateString } from '../../../helpers/utils';
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

  const product = state.goods.find((item) => item.id === route.params.prodId);
  const document = state.documents.find((item) => item.id === route.params.docId);
  const lineDocuments =
    document instanceof Object && (document as IDocument)
      ? (document as IDocument).lines
      : (document as ISellDocument).lines;
  const lineDocument = lineDocuments.find((line) => line.id === route.params.lineId);
  const [line, setLine] = useState<ISellLine>(lineDocument);
  //const [value, setValue] = useState('1');
  //const [batchNumber, setBatchNumber] = useState('');
  //const [manufacturingDate, setManufacturingDate] = useState(new Date().toISOString());
  //const orderQ = (lineDocument as ISellLine)?.orderQuantity ?? 0;
  /*const findBoxingsLine = state.boxingsLine
    ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
    : undefined;*/
  //const [boxingsLine, setBoxingsLine] = useState<ILineTara[]>(findBoxingsLine ? findBoxingsLine.lineBoxings : []);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const isFocused = useIsFocused();
  //producParams

  useEffect(() => {
    if (!route.params || !route.params.docId || !route.params.prodId || !route.params.modeCor) {
      return;
    }
    // Инициализируем параметры
    if (!state.producParams) {
      actions.setProducParams(
        route.params.modeCor
          ? lineDocument
          : {
              id: route.params.lineId,
              goodId: route.params.prodId,
              quantity: 1,
              manufacturingDate: document.head.date,
            },
      );
    }
  }, [
    route.params.docId,
    route.params.prodId,
    route.params.modeCor,
    route.params,
    lineDocument,
    actions,
    document.head.date,
    state.producParams,
  ]);

  /*useEffect(() => {
    if (!state.producParams && !route.params?.docId) {
    }
  }, [actions, document.head.date, route.params?.docId, route.params.lineId, route.params.prodId, state.producParams]);*/

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

  /*useEffect(() => {
    if (route.params.quantity) {
      setValue(route.params.quantity);
      return;
    }

    if (route.params.modeCor) {
      if (lineDocument) {
        setValue(!Number.isNaN(lineDocument.quantity) ? lineDocument.quantity.toString() : '1');
      }
      setLine(lineDocument);
    }
  }, [document.lines, route.params.modeCor, route.params.lineId, lineDocument, route.params.quantity]);*/

  /*useEffect(() => {
    const findBoxingsLineHock = state.boxingsLine
      ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
      : undefined;
    actions.setProducParams({
      ...state.producParams,
      tara: findBoxingsLineHock ? findBoxingsLineHock.lineBoxings : [],
    });
    //setBoxingsLine(findBoxingsLineHock ? findBoxingsLineHock.lineBoxings : []);
  }, [actions, route.params.docId, route.params.lineId, state.boxingsLine, state.producParams]);*/

  /*useEffect(() => {
    if (line) {
      setBatchNumber(route.params.batchNumber ?? line.numreceive ?? '');
    }
  }, [line, route.params.batchNumber]);*/

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            actions.setBoxingsLine([]);
            navigation.navigate('ViewSellDocument', { docId: document.id });
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            /*const findBoxingsLineHock = state.boxingsLine
              ? state.boxingsLine.find(
                  (item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId,
                )
              : undefined;

            const boxings = findBoxingsLineHock ? findBoxingsLineHock : undefined;*/

            if (line?.id && route?.params?.modeCor) {
              actions.editLine({
                docId: route.params.docId,
                line: {
                  ...line,
                  ...state.producParams,
                  /*numreceive: batchNumber,
                  quantity: Number.parseFloat(route.params.modeCor ? value : value + line.quantity),
                  tara: boxings ? boxings.lineBoxings : undefined,
                  manufacturingDate,*/
                },
              });
            } else {
              actions.addLine({
                docId: route.params.docId,
                line: {
                  ...state.producParams,
                  id: '0',
                  /*goodId: product.id,
                  numreceive: batchNumber,
                  quantity: Number.parseFloat(value),
                  tara: boxings ? boxings.lineBoxings : undefined,
                  manufacturingDate,*/
                },
              });
            }
            actions.setBoxingsLine([]);
            navigation.navigate('ViewSellDocument', { docId: document.id });
          }}
        />
      ),
    });
  }, [
    actions,
    line,
    navigation,
    product.id,
    route.params.docId,
    route.params.lineId,
    route.params?.modeCor,
    state.boxingsLine,
    state.producParams,
  ]);

  const onPress = () => {
    if (isKeyboardVisible) {
      return;
    }
    navigation.navigate('SelectBoxingsScreen', {
      lineId: route.params.lineId,
      prodId: route.params.prodId,
      docId: route.params.docId,
      modeCor: route.params.modeCor,
      quantity: '0',
      batchNumber: '0',
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={[
            styles.container,
            localeStyles.container,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>
            {product?.name || 'товар не найден'}
          </SubTitle>
          <TextInput
            mode={'flat'}
            label={'Номер партии'}
            editable={true}
            //onChangeText={setBatchNumber}
            //value={batchNumber}
            onChangeText={(text) => {
              actions.setProducParams({
                ...state.producParams,
                numreceive: text,
              });
            }}
            value={state.producParams?.numreceive ?? ''}
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
            //value={orderQ.toString()}
            value={(state.producParams?.orderQuantity ?? 0).toString()}
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
            //onChangeText={setValue}
            onChangeText={(text) => {
              actions.setProducParams({
                ...state.producParams,
                quantity: Number(!Number.isNaN(text) ? text : '1'),
              });
            }}
            returnKeyType="done"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isFocused}
            //value={value}
            value={(state.producParams?.quantity ?? 1).toString()}
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={{
              backgroundColor: colors.card,
            }}
          />
          <View style={localeStyles.text}>
            <Text style={[localeStyles.subdivisionText, { color: colors.primary }]}>Дата документа: </Text>
            <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
              <TouchableOpacity
                style={localeStyles.containerDate}
                onPress={() =>
                  navigation.navigate('SelectDateScreen', {
                    parentScreen: 'SellProductDetail',
                    fieldName: 'date',
                    title: 'Дата производства:',
                    value: state.producParams?.manufacturingDate,
                  })
                }
              >
                <Text style={[localeStyles.textDate, { color: colors.text }]}>
                  {getDateString(state.producParams?.manufacturingDate || document.head.date)}
                </Text>
                <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
              </TouchableOpacity>
            </View>
          </View>
          <ItemSeparator />

          <TouchableOpacity style={localeStyles.boxingsLine} onPress={onPress}>
            <View style={(localeStyles.paddingLeft10, { width: '80%' })}>
              <Text
                style={
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    color: colors.primary,
                    fontSize: state.producParams?.tara && state.producParams?.tara.length !== 0 ? 11 : 16,
                  }
                }
              >
                Тара
              </Text>
              {state.producParams?.tara && state.producParams?.tara.length !== 0 ? (
                <Text>
                  {state.producParams.tara.map((item, idx) => {
                    const box = state.boxings.find((itemBox) => itemBox.id === item.tarakey);
                    return `${box ? box.name : 'неизвестная тара'}${
                      idx === state.producParams.tara.length - 1 ? '' : ', '
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

const localeStyles = StyleSheet.create({
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
