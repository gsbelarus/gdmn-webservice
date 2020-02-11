import React from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';

const DocumentPage = (): JSX.Element => {

  const {navigate} = useNavigation();

  const data = [{
    id: 1,
    title: 'Инвентаризация №00001',
    barcode: 'Розничный склад',
    price: '05.02.2020'
  },
  {
    id: 2,
    title: 'Инвентаризация №00001',
    barcode: 'Розничный склад',
    price: '05.02.2020'
  },
  {
    id: 3,
    title: 'Инвентаризация №00001',
    barcode: 'Розничный склад',
    price: '05.02.2020'
  }];

  return (
    <View style={styles.container}>
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
                <Text numberOfLines={5} style={styles.productPriceView}>{item.price}</Text>
              </View>
            </View>
          </View>)
        }
      </View>
      <View style={{flex: 1, flexDirection: 'column', justifyContent: "flex-end", }}>
        <TouchableOpacity
          style={styles.createButton} 
          onPress={() => navigate('DocumentFilterPage')}
        >
          <Text style={styles.createButtonText}>Создать новый документ</Text>
        </TouchableOpacity>
      </View>
        <TouchableOpacity
          style={styles.sendButton} 
          onPress={() => navigate('DocumentFilterPage')}
        >
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>
      <StatusBar barStyle = "light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFE0FF',
    flex: 1,
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
  sendButton: {
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#2D3083',
    color: '#FFFFFF',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 17
  },
  createButton: {
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#2D3083',
    color: '#FFFFFF',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 17
  }
});

export default DocumentPage;
