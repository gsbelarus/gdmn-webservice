import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Text, AsyncStorage} from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import InputSpinner from "react-native-input-spinner";

const ProductDetailPage = (): JSX.Element => {

  const navigate = useNavigation();

  const [data, setData] = useState();
  const [value, setValue] = useState();

  useEffect(() => {
    const getData = async() => {
      setData(JSON.parse(await AsyncStorage.getItem('goods')).find(i => i.ID === navigate.getParam('id').toString()));
    }
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        {data ? <Text numberOfLines={5} style={styles.productName}>{data.NAME}</Text> : undefined}
      </View>
      <View style={styles.productPriceView}>
        <Text style={{fontSize: 17}}>Цена:</Text>
        {data ? <Text style={styles.productPrice}>{data.PRICE}</Text> : undefined}
      </View>
      <View style={styles.productQuantityView}>
        <Text style={{fontSize: 17}}>Количество:</Text>
        {data ? <Text style={styles.productQuantity}>{data.QUANTITY}</Text> : undefined}
      </View>
      <View style={styles.editQuantityView}>
        <Text style={{fontSize: 17}}>Изменить количество:</Text>
        <InputSpinner 
          returnKeyType="done"
          style={styles.inputSpinner}
          inputStyle={{fontSize: 20}}
          value={value}
          max={1000}
          min={1}
          step={1}
          colorLeft={'#2D3083'}
          colorRight={'#2D3083'}
          onChange={setValue}
        />
      </View>
      <StatusBar barStyle = "light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFE0FF',
    flex: 1
  },
  productName: {
    marginTop: 25,
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 19,
    alignItems: 'center'
  },
  productPriceView: {
    marginLeft: 15,
    marginTop: 45,
    flexDirection: 'row'
  },
  productPrice: {
    marginLeft: 5,
    textAlignVertical: 'center',
    color: '#000000',
    fontSize: 17
  },
  productQuantityView: {
    marginLeft: 15,
    marginTop: 15,
    flexDirection: 'row'
  },
  productQuantity: {
    marginLeft: 5,
    color: '#000000',
    fontSize: 17
  },
  editQuantityView: {
    marginLeft: 15,
    marginTop: 100,
    flexDirection: 'column',
    alignItems: 'center'
  },
  inputSpinner: {
    marginTop: 5,
    width: 180
  }
});

export default ProductDetailPage;
