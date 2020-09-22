import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, RouteProp, useIsFocused, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, TextInput } from 'react-native-paper';

import { IDocument, IGood, ILine } from '../../../../../common';
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

  const [document, setDocument] = useState<ISellDocument | IDocument | undefined>();
  const [product, setProduct] = useState<IGood | undefined>();
  const [line, setLine] = useState<ISellLine | ILine | undefined>();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!route.params) {
      return;
    }

    setProduct(state.goods.find((item) => item.id === route.params.prodId));
    setDocument(state.documents.find((item) => item.id === route.params.docId));
    const lineDocuments = document
      ? document instanceof Object && (document as IDocument)
        ? (document as IDocument).lines
        : (document as ISellDocument).lines
      : undefined;
    lineDocuments ? setLine(lineDocuments.find((item) => item.id === route.params.lineId)) : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params, state.goods, state.documents]);

  useEffect(() => {
    if (route.params.weighedGood) {
      const good = state.weighedGoods.find((item) => item.id === route.params.weighedGood);
      const date = good.datework.split('.').reverse();
      console.log(date);
      good
        ? actions.setProducParams({
            id: route.params.lineId,
            goodId: route.params.prodId,
            quantity: good.weight,
            manufacturingDate: new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]) + 1)
              .toISOString()
              .slice(0, 10),
            //timeWork: good.timework,
            numreceive: good.numreceive,
          })
        : undefined;
    }
  }, [actions, route.params.lineId, route.params.prodId, route.params.weighedGood, state.weighedGoods]);

  useEffect(() => {
    if (document) {
      const lineDocuments =
        document instanceof Object && (document as IDocument)
          ? (document as IDocument).lines
          : (document as ISellDocument).lines;
      setLine(lineDocuments.find((item) => item.id === route.params.lineId));
    }
  }, [document, route.params.lineId]);

  useEffect(() => {
    if (!document || !product) {
      return;
    }

    if (route.params.weighedGood) {
      return;
    }

    if (!route.params?.modeCor) {
      actions.setProducParams({
        id: route.params.lineId,
        goodId: route.params.prodId,
        quantity: 1,
        manufacturingDate: new Date(document.head.date).toISOString().slice(0, 10),
      });
    } else {
      if (!line) {
        return;
      }
      route.params?.manufacturingDate
        ? actions.setProducParams({ ...line, manufacturingDate: route.params.manufacturingDate })
        : actions.setProducParams(line);
    }
  }, [actions, document, line, product, route.params.lineId, route.params.manufacturingDate, route.params.prodId]);

  useEffect(() => {
    if (state.productParams && route.params?.manufacturingDate) {
      actions.setProducParams({ ...state.productParams, manufacturingDate: route.params.manufacturingDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, document, product, route.params]);

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
            navigation.navigate('ViewSellDocument', { docId: document?.id });
            actions.clearProductParams();
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            if (line?.id && route?.params?.modeCor) {
              actions.editLine({
                docId: route.params.docId,
                line: {
                  ...line,
                  ...state.productParams,
                },
              });
            } else {
              actions.addLine({
                docId: route.params.docId,
                line: {
                  goodId: route.params.prodId,
                  ...state.productParams,
                  id: '0',
                },
              });
            }
            actions.setBoxingsLine([]);
            navigation.navigate('ViewSellDocument', { docId: document?.id });
            actions.clearProductParams();
          }}
        />
      ),
    });
  }, [actions, document, line, navigation, product, route.params, state.boxingsLine, state.productParams]);

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
            onChangeText={(text) => {
              actions.setProducParams({
                ...state.productParams,
                numreceive: text,
              });
            }}
            value={state.productParams?.numreceive ?? ''}
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
            value={(state.productParams?.orderQuantity ?? 0).toString()}
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
            onChangeText={(text) => {
              actions.setProducParams({
                ...state.productParams,
                quantity: Number(!Number.isNaN(text) ? text : '1'),
              });
            }}
            returnKeyType="done"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isFocused}
            value={(state.productParams?.quantity ?? 1).toString()}
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
            <Text style={[localeStyles.subdivisionText, { color: colors.primary }]}>Дата производства: </Text>
            <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
              <TouchableOpacity
                style={localeStyles.containerDate}
                onPress={() => {
                  if (isKeyboardVisible) {
                    return;
                  }
                  navigation.navigate('SelectDateScreen', {
                    parentScreen: 'SellProductDetail',
                    fieldName: 'manufacturingDate',
                    title: 'Дата производства:',
                    value: new Date(state.productParams?.manufacturingDate ?? document?.head.date)
                      .toISOString()
                      .slice(0, 10),
                  });
                }}
              >
                <Text style={[localeStyles.textDate, { color: colors.text }]}>
                  {getDateString(state.productParams?.manufacturingDate || document?.head.date)}
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
                    fontSize: state.productParams?.tara && state.productParams?.tara.length !== 0 ? 11 : 16,
                  }
                }
              >
                Тара
              </Text>
              {state.productParams?.tara && state.productParams?.tara.length !== 0 ? (
                <Text>
                  {state.productParams.tara.map((item, idx) => {
                    const box = state.boxings.find((itemBox) => itemBox.id === item.tarakey);
                    return `${box ? box.name : 'неизвестная тара'}${
                      idx === state.productParams.tara.length - 1 ? '' : ', '
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
