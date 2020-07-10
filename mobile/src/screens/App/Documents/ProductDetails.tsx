import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Route } from 'react-native';
import { TextInput } from 'react-native-paper';

import { ILine } from '../../../../../common';
import SubTitle from '../../../components/SubTitle';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

export interface IProductDetailsRef {
  done(): void;
}

interface MyInputProps {
  route: Route;
  navigation: any;
}

const ProductDetailScreen = forwardRef<IProductDetailsRef, MyInputProps>(({ route, navigation }, ref) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const product = state.goods.find((item) => item.id === route.params.prodId);
  const remain = state.remains.find((item) => item.goodId === route.params.prodId);
  const document = state.documents.find((item) => item.id === route.params.docId);
  const [line, setLine] = useState<ILine>(undefined);
  const [value, setValue] = useState('1.0');

  useEffect(() => {
    const lineDocument = document.lines.find((item) => item.goodId === route.params.prodId);
    if (lineDocument) {
      if (route.params.modeCor) {
        setValue(lineDocument.quantity.toString());
      }
      setLine(lineDocument);
    }
  }, [document.lines, route.params.modeCor, route.params.prodId]);

  useImperativeHandle(ref, () => ({
    done: () => {
      if (line !== undefined) {
        actions.editLine({
          docId: route.params.docId,
          lineId: line.id,
          value: Number.parseFloat(route.params.modeCor ? value : value + line.quantity),
        });
      } else {
        actions.addLine({
          docId: route.params.docId,
          line: { id: '0', goodId: product.id, quantity: Number.parseFloat(value) },
        });
      }
      navigation.navigate('ViewDocument', { docId: route.params.docId });
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
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>{product.name}</SubTitle>
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
        autoFocus={true}
        value={value.toString()}
        style={{
          backgroundColor: colors.card,
        }}
      />
    </View>
  );
});

export { ProductDetailScreen };

const localeStyles = StyleSheet.create({
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
