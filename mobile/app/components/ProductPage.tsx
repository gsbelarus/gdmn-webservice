import React from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';

const ProductPage = (): JSX.Element => {

  const {navigate} = useNavigation();

  const data = [{
    id: 1,
    title: 'Томат "Черри очень очень очень очень очень очень длинное предлинное название", Испания 0.75 кг',
    barcode: 1234567890111,
    price: '10,55 руб.',
    quantity: '1,03 кг.'
  },
  {
    id: 2,
    title: 'Томат "Черри", Испания 0.75 кг',
    barcode: 1234567890111,
    price: '7,55 руб.',
    quantity: '0,55 кг.'
  },
  {
    id: 3,
    title: 'Томат, Беларусь 0.75 кг',
    barcode: 1234567890111,
    price: '7,55 руб.',
    quantity: '0,55 кг.'
  }];

  return (
    <View style={styles.container}>
      <View style={styles.documentHeader}>
        <Text numberOfLines={5} style={styles.documentHeaderText}>Инвентаризация №00001</Text>
        <Text numberOfLines={5} style={styles.documentHeaderText}>Розничный склад</Text>
        <Text numberOfLines={5} style={styles.documentHeaderText}>05.02.2020</Text>
      </View>
      <View style={{flex: 1}}>
        {
          data.map( (item, idx) => <View style={styles.productView} key={idx}>
            <View style={styles.productTextView}>
              <View style={styles.productIdView}>
                <Text style={styles.productId}>{item.id}</Text>
              </View>
              <View style={styles.productNameTextView}>
                <Text numberOfLines={5} style={styles.productTitleView}>{item.title}</Text>
                <Text numberOfLines={5} style={styles.productBarcodeView}>{item.barcode}</Text>
              </View>
            </View>
            <View style={styles.productNumView}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Ionicons 
                  size={20}
                  color='#8C8D8F' 
                  name='md-pricetag' 
                /> 
                <Text numberOfLines={5} style={styles.productPriceView}>{item.price}</Text>
              </View>
              <Text numberOfLines={5} style={styles.productQuantityView}>{item.quantity}</Text>
            </View>
          </View>)
        }
      </View>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', margin: 10}}>
        <TouchableOpacity
          style={styles.addButton} 
          onPress={() => navigate('MessagePage')}
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
    flex: 1,
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
    flexDirection: 'column',
  },
  productTextView: {
    flexDirection: 'row',
    margin: 5,
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
    color: '#000000',
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
    marginTop: 5,
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