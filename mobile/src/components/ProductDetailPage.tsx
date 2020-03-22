import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, AsyncStorage, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import InputSpinner from 'react-native-input-spinner';
import { useTheme } from '@react-navigation/native';
import { styles } from '../styles/global';

const ProductDetailPage = (): JSX.Element => {
  interface IRemain {
    goodId: number;
    quantity: number;
    price: number;
    contactId: number;
  }

  const navigation = useNavigation();
  const { colors } = useTheme();

  const [data, setData] = useState<IRemain>();
  const [nameProduct, setNameProduct] = useState();
  const [value, setValue] = useState(1);

  useEffect(() => {
    const getData = async () => {
      setData(JSON.parse(await AsyncStorage.getItem('remains')).find(i => i.goodId === navigation.getParam('id')));
      setNameProduct(
        JSON.parse(await AsyncStorage.getItem('goods')).find(i => i.id === navigation.getParam('id')).name,
      );
    };
    getData();
  }, []);

  const acceptAdditing = async () => {
    const docs = JSON.parse(await AsyncStorage.getItem('docs'));
    const docLine = docs.find(doc => doc.id === navigation.getParam('idDoc'));
    const lineId = docLine.lines.findIndex(line => line.goodId === navigation.getParam('id'));
    lineId < 0
      ? undefined
      : docLine.lines.splice(lineId, 1, {
          id: docLine.lines[lineId].id,
          goodId: navigation.getParam('id'),
          quantity: docLine.lines[lineId].quantity + value,
        });
    docs[docs.findIndex(item => item.id === docLine.id)] = {
      ...docLine,
      lines:
        lineId < 0
          ? [
              ...docLine.lines,
              {
                id: docLine.lines.length !== 0 ? docLine.lines[docLine.lines.length - 1].id + 1 : 0,
                goodId: navigation.getParam('id'),
                quantity: value,
              },
            ]
          : [...docLine.lines],
    };
    await AsyncStorage.setItem('docs', JSON.stringify(docs));
    navigation.navigate('ProductPage');
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        {nameProduct ? (
          <Text numberOfLines={5} style={localeStyles.productName}>
            {nameProduct}
          </Text>
        ) : (
          undefined
        )}
      </View>
      <View style={localeStyles.productPriceView}>
        <Text style={{ fontSize: 17 }}>Цена:</Text>
        {data ? <Text style={localeStyles.productPrice}>{data.price}</Text> : undefined}
      </View>
      <View style={localeStyles.productQuantityView}>
        <Text style={{ fontSize: 17 }}>Количество:</Text>
        {data ? <Text style={localeStyles.productQuantity}>{data.quantity}</Text> : undefined}
      </View>
      <View style={localeStyles.editQuantityView}>
        <Text style={{ fontSize: 17 }}>Добавить количество:</Text>
        <InputSpinner
          returnKeyType="done"
          style={localeStyles.inputSpinner}
          inputStyle={{ fontSize: 20 }}
          value={value}
          max={1000}
          min={1}
          step={1}
          colorLeft={'#2D3083'}
          colorRight={'#2D3083'}
          onChange={setValue}
          onMin={() => {
            Alert.alert('Предупреждение', 'Минимальное значение уже выбрано!');
          }}
        />
      </View>
      <Button onPress={acceptAdditing} style={{ ...styles.rectangularButton, height: 35, alignItems: 'center' }}>
        Отправить
      </Button>
      <StatusBar barStyle="light-content" />
    </View>
  );
};

const localeStyles = StyleSheet.create({
  productName: {
    marginTop: 25,
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 19,
    alignItems: 'center',
  },
  productPriceView: {
    marginLeft: 15,
    marginTop: 45,
    flexDirection: 'row',
  },
  productPrice: {
    marginLeft: 5,
    textAlignVertical: 'center',
    color: '#000000',
    fontSize: 17,
  },
  productQuantityView: {
    marginLeft: 15,
    marginTop: 15,
    flexDirection: 'row',
  },
  productQuantity: {
    marginLeft: 5,
    color: '#000000',
    fontSize: 17,
  },
  editQuantityView: {
    marginLeft: 15,
    marginTop: 100,
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputSpinner: {
    marginTop: 5,
    width: 180,
  },
});

export default ProductDetailPage;
