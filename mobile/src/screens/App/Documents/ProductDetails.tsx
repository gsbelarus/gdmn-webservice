import { useTheme, useIsFocused, RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import { ILine } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { getNextDocLineId } from '../../../helpers/utils';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type ProductDetailScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'ProductDetail'>,
  StackNavigationProp<DocumentStackParamList>
>;
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

type Props = {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
};

const ProductDetailScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const product = state.goods.find((item) => item.id === route.params.prodId);
  const remain = state.remains.find((item) => item.goodId === route.params.prodId);
  const document = state.documents.find((item) => item.id === route.params.docId);
  const [line, setLine] = useState<ILine>(undefined);
  const [value, setValue] = useState('1.0');
  const isFocused = useIsFocused();

  useEffect(() => {
    const lineDocument = document.lines.find((item) => item.goodId === route.params.prodId);
    if (lineDocument) {
      if (route.params.modeCor) {
        setValue(lineDocument.quantity.toString());
      }
      setLine(lineDocument);
    }
  }, [document.lines, route.params.modeCor, route.params.prodId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            navigation.navigate('ViewDocument', { docId: route.params.docId });
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            if (line !== undefined) {
              actions.editLine({
                docId: route.params.docId,
                line: {
                  ...line,
                  quantity: Number.parseFloat(route.params.modeCor ? value : value + line.quantity),
                },
              });
            } else {
              actions.addLine({
                docId: route.params.docId,
                line: { id: getNextDocLineId(document), goodId: product.id, quantity: Number.parseFloat(value) },
              });
            }
            navigation.navigate('ViewDocument', { docId: route.params.docId });
          }}
        />
      ),
    });
  }, [actions, line, navigation, product.id, route.params.docId, route.params.modeCor, value]);

  return (
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
        label={'Цена'}
        editable={false}
        value={remain?.price.toString()}
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
        label={'Остаток'}
        editable={false}
        value={remain?.quantity.toString()}
        theme={{
          colors: {
            placeholder: colors.primary,
            accent: colors.primary,
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
        onChangeText={(newValue) => setValue(newValue)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={isFocused}
        value={value.toString()}
        style={{
          backgroundColor: colors.card,
        }}
      />
    </View>
  );
};

export { ProductDetailScreen };

const localStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 35,
    marginHorizontal: '25%',
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  editQuantityView: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 100,
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
    marginLeft: 15,
    marginTop: 45,
  },
  productQuantity: {
    color: '#000000',
    fontSize: 17,
    marginLeft: 5,
  },
  productQuantityView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 15,
  },
  title: {
    padding: 10,
  },
});
