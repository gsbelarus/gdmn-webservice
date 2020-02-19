import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Text, AsyncStorage, TouchableOpacity} from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import InputSpinner from "react-native-input-spinner";

const ProductDetailPage = (): JSX.Element => {

  const navigation = useNavigation();

  const [data, setData] = useState();
  const [value, setValue] = useState();

  useEffect(() => {
    const getData = async() => {
      setData(JSON.parse(await AsyncStorage.getItem('goods')).find(i => i.ID === navigation.getParam('id').toString()));
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
      <View style={styles.buttonOkView}>
        <TouchableOpacity
          style={styles.buttonOk} 
          onPress={async () => {
            const docLines = JSON.parse(await AsyncStorage.getItem('docLines'));
            const docLineId = Number(docLines[docLines.length - 1].ID) + 1;
            docLines.push({
              ID: docLineId.toString(),
              IDDOC: navigation.getParam('idDoc'),
              GOODKEY: navigation.getParam('id').toString(),
              QUANTITY: value
            });
            await AsyncStorage.setItem('docLines', JSON.stringify(docLines));
            navigation.navigate('ProductPage');
          }}
        >
          <Text style={styles.buttonOkText}>ОК</Text>
        </TouchableOpacity>
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
  },
  buttonOkView: {
    alignItems: 'center',
  },
  buttonOk: {
    marginRight: 15,
    backgroundColor: '#2D3083',
    width: '20%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderColor: '#212323',
    marginHorizontal: 15,
    marginTop: 15
  },
  buttonOkText: {
    color: '#FFFFFF',
    fontSize: 16
  }
});

export default ProductDetailPage;
