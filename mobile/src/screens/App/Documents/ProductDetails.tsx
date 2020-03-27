import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import { Text, Button } from 'react-native-paper';

import SubTitle from '../../../components/SubTitle';
import products from '../../../mockData/Goods.json';
import remains from '../../../mockData/Remains.json';
import styles from '../../../styles/global';

const ProductDetailScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const product = products.find((item) => item.id === route.params.prodId);
  const remain = remains.find((item) => item.goodId === route.params.prodId);
  const [value, setValue] = useState(1);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          padding: 0,
          justifyContent: 'flex-start',
        },
      ]}
    >
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>{product.name}</SubTitle>
      <View style={localeStyles.productPriceView}>
        <Text style={{ fontSize: 17 }}>Цена:</Text>
        <Text style={localeStyles.productPrice}>{remain.price}</Text>
      </View>
      <View style={localeStyles.productQuantityView}>
        <Text style={{ fontSize: 16 }}>Количество:</Text>
        <Text style={localeStyles.productQuantity}>{remain.quantity}</Text>
      </View>
      <View style={localeStyles.editQuantityView}>
        <Text style={{ fontSize: 16 }}>Добавить количество:</Text>
        <InputSpinner
          returnKeyType="done"
          style={localeStyles.inputSpinner}
          inputStyle={{ fontSize: 20 }}
          value={value}
          max={1000}
          min={0}
          step={1}
          colorLeft={colors.primary}
          colorRight={colors.primary}
          onChange={setValue}
          // onMin={() => {
          //   Alert.alert('Предупреждение', 'Минимальное значение уже выбрано!');
          // }}
        />
      </View>
      <Button
        onPress={() => navigation.goBack()}
        style={{
          ...styles.rectangularButton,
          height: 35,
          alignItems: 'center',
        }}
      >
        Отправить
      </Button>
    </View>
  );
};

export { ProductDetailScreen };

const localeStyles = StyleSheet.create({
  editQuantityView: {
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 15,
    marginTop: 100,
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
