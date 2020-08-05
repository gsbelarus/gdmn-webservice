import { useTheme, RouteProp, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Keyboard } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, TextInput } from 'react-native-paper';

import { IDocument } from '../../../../../common';
import SubTitle from '../../../components/SubTitle';
import { ISellLine, ISellDocument, ILineTara } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

export interface ISellProductDetailsRef {
  done(): void;
  cancel(): void;
}

type SellProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SellProductDetail'>;
type SellProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'SellProductDetail'>;

type Props = {
  route: SellProductDetailScreenRouteProp;
  navigation: SellProductDetailScreenNavigationProp;
};

const SellProductDetailScreen = forwardRef<ISellProductDetailsRef, Props>(({ route, navigation }, ref) => {
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
  const [value, setValue] = useState('1');
  const [batchNumber, setBatchNumber] = useState('');
  const orderQ = (lineDocument as ISellLine)?.orderQuantity ?? 0;
  const findBoxingsLine = state.boxingsLine
    ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
    : undefined;
  const [boxingsLine, setBoxingsLine] = useState<ILineTara[]>(findBoxingsLine ? findBoxingsLine.lineBoxings : []);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log('focused screen');
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }
  }, [isFocused]);

  useEffect(() => {
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
  }, [document.lines, route.params.modeCor, route.params.lineId, lineDocument, route.params.quantity]);

  useEffect(() => {
    const findBoxingsLineHock = state.boxingsLine
      ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
      : undefined;
    setBoxingsLine(findBoxingsLineHock ? findBoxingsLineHock.lineBoxings : []);
  }, [route.params.docId, route.params.lineId, state.boxingsLine]);

  useEffect(() => {
    if (line) {
      setBatchNumber(route.params.batchNumber ?? line.numreceive ?? '');
    }
  }, [line, route.params.batchNumber]);

  useImperativeHandle(ref, () => ({
    done: () => {
      const findBoxingsLineHock = state.boxingsLine
        ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
        : undefined;
      const boxings = findBoxingsLineHock ? findBoxingsLineHock : undefined;
      if (line) {
        actions.editLine({
          docId: route.params.docId,
          line: {
            ...line,
            numreceive: batchNumber,
            quantity: Number.parseFloat(route.params.modeCor ? value : value + line.quantity),
            tara: boxings ? boxings.lineBoxings : undefined,
          },
        });
      } else {
        actions.addLine({
          docId: route.params.docId,
          line: {
            id: '0',
            goodId: product.id,
            numreceive: batchNumber,
            quantity: Number.parseFloat(value),
            tara: boxings ? boxings.lineBoxings : undefined,
          },
        });
      }
      actions.setBoxingsLine([]);
    },
    cancel: () => {
      actions.setBoxingsLine([]);
    },
  }));

  const onPress = () => {
    if (isKeyboardVisible) {
      return;
    }
    navigation.navigate('SelectBoxingsScreen', {
      lineId: route.params.lineId,
      prodId: route.params.prodId,
      docId: route.params.docId,
      modeCor: route.params.modeCor,
      quantity: value,
      batchNumber,
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
            onChangeText={setBatchNumber}
            value={batchNumber}
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
            value={orderQ.toString()}
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
            onChangeText={setValue}
            returnKeyType="done"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isFocused}
            value={value}
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={{
              backgroundColor: colors.card,
            }}
          />

          <TouchableOpacity style={localeStyles.boxingsLine} onPress={onPress}>
            <Text
              style={[
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  color: colors.primary,
                  fontSize: boxingsLine && boxingsLine.length !== 0 ? 11 : 16,
                },
                localeStyles.subdivisionText,
              ]}
            >
              Тара
            </Text>
            {boxingsLine && boxingsLine.length !== 0
              ? boxingsLine.map((item) => {
                  const box = state.boxings.find((itemBox) => itemBox.id === item.tarakey);
                  return <Text key={item.tarakey}>{box ? box.name : 'неизвестная тара'}</Text>;
                })
              : null}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export { SellProductDetailScreen };

const localeStyles = StyleSheet.create({
  boxingsLine: {
    height: 60,
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    height: 35,
    marginHorizontal: '25%',
  },
  chip: {
    fontSize: 18,
    height: 50,
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  editQuantityView: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 20,
  },
  flatContaner: {
    margin: 20,
  },
  fontSize16: {
    fontSize: 16,
  },
  fontSize20: {
    fontSize: 20,
  },
  inputSpinner: {
    marginTop: 5,
    width: 180,
  },
  listContainer: {
    borderRadius: 6,
    flexBasis: 100,
    marginLeft: 0.5,
    marginTop: 10,
  },
  margin: {
    margin: 2,
  },
  productName: {
    alignItems: 'center',
    color: '#000000',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 25,
  },
  productPrice: {
    color: '#000000',
    fontSize: 17,
    marginLeft: 5,
    textAlignVertical: 'center',
  },
  productPriceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 25,
  },
  productQuantity: {
    color: '#000000',
    fontSize: 17,
    marginLeft: 15,
  },
  productQuantityView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 15,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subdivisionText: {
    fontSize: 11,
    margin: 10,
    textAlign: 'left',
  },
  taraContanerView: {
    backgroundColor: '#fff',
    borderRadius: 4,
    flexBasis: 145,
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 3,
    marginVertical: 3,
    minWidth: 120,
    padding: 15,
  },
  title: {
    padding: 10,
  },
});
