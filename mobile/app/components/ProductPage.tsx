import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, AsyncStorage, ScrollView} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';

const ProductPage = (): JSX.Element => {

  const navigation = useNavigation();

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async() => {
      setData(JSON.parse(await AsyncStorage.getItem('goods')));
    }
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.documentHeader}>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{navigation.getParam('docType')}</Text>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{navigation.getParam('contact')}</Text>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{navigation.getParam('date')}</Text>
      </View>
      <ScrollView style={{flex: 1}}>
        {
          data.map( (item, idx) => <View style={styles.productView} key={idx}>
            <View style={styles.productTextView}>
              <View style={styles.productIdView}>
                <Text style={styles.productId}>{idx + 1}</Text>
              </View>
              <View style={styles.productNameTextView}>
                <Text numberOfLines={5} style={styles.productTitleView}>{item.NAME}</Text>
                <Text numberOfLines={5} style={styles.productBarcodeView}>{item.BARCODE}</Text>
              </View>
            </View>
            <View style={styles.productNumView}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Ionicons 
                  size={20}
                  color='#8C8D8F' 
                  name='md-pricetag' 
                /> 
                <Text numberOfLines={5} style={styles.productPriceView}>{item.PRICE}</Text>
              </View>
              <Text numberOfLines={5} style={styles.productQuantityView}>{item.QUANTITY}</Text>
            </View>
          </View>)
        }
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', margin: 10}}>
        <TouchableOpacity
          style={styles.addButton} 
          onPress={() => navigation.navigate('ProductsListPage')}
        >
          <MaterialIcons
            size={20}
            color='#FFF' 
            name='add' 
          />
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
  documentHeader: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#5053A8'
  },
  documentHeaderText: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 2,
    textAlignVertical: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  productView: {
    flexDirection: 'column'
  },
  productTextView: {
    flexDirection: 'row',
    margin: 5
  },
  productNumView: {
    height: 25,
    flexDirection: 'row',
    backgroundColor: '#F0F0FF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 48,
    paddingHorizontal: 30
  },
  productIdView: {
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  productId: {
    margin: 15,
    textAlignVertical: 'center',
    color: '#000000'
  },
  productNameView: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#E6E7FF'
  },
  productNameTextView: {
    maxHeight: 75,
    minHeight: 45,
    marginTop: 5,
    marginHorizontal: 5,
    width: '90%',
    textAlignVertical: 'center',
    color: '#000000',
    fontWeight: 'bold'
  },
  productPriceView: {
    marginLeft: 5
  },
  productTitleView: {
    fontWeight: 'bold',
    minHeight: 25,
    maxHeight: 70,
    flexGrow: 1
  },
  productBarcodeView: {
    marginTop: 5
  },
  productQuantityView: {
  },
  viewButton: {
    backgroundColor: '#EEF2FC',
    marginVertical: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  viewButtonPress: {
    backgroundColor: '#2D3083',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: '#212323',
    borderWidth: 1,
    marginVertical: 15
  },
  viewButtonText: {
    color: '#676869',
    fontSize: 20
  },
  viewButtonPressText: {
    color: '#FFFFFF',
    fontSize: 20
  },
  addButton: {
    margin: 5,
    marginLeft: 0,
    borderRadius: 50,
    borderColor: '#2D3083',
    borderWidth: 1,
    height: 50,
    width: 50,
    backgroundColor: '#2D3083',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProductPage;
