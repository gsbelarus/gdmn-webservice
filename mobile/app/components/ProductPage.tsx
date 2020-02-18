import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, AsyncStorage, ScrollView} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from 'react-navigation-hooks';

const ProductPage = (): JSX.Element => {

  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [doc, setDoc] = useState();
  const [docType, setDocType] = useState();
  const [contact, setContact] = useState();

    useFocusEffect(React.useCallback(() => {
      const getData = async() => {
        const docId = navigation.getParam('docId');
        const docLines = (JSON.parse(await AsyncStorage.getItem('docLines'))).filter(item => item.IDDOC === docId);
        setData(JSON.parse(await AsyncStorage.getItem('goods')).filter(item => docLines.find(line => line.GOODKEY === item.ID)));
        setDoc(JSON.parse(await AsyncStorage.getItem('docs')).find(item => item.IDDOC === docId));
      }
      getData();
    }, []));

  useEffect(() => {
    if(doc) {
      const getData = async() => {
        setDocType(JSON.parse(await AsyncStorage.getItem('docTypes')).find(item => item.ID === doc.DOCUMENTTYPE));
        setContact(JSON.parse(await AsyncStorage.getItem('contacts')).find(item => item.ID === doc.CONTACTKEY));
      }
      getData();
    }
  }, [doc])

  return (
    <View style={styles.container}>
      <View style={styles.documentHeader}>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{docType ? docType.NAME : 'unknow'}</Text>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{contact ? contact.NAME : 'unknow'}</Text>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{doc ? doc.DOCUMENTDATE : 'unknow'}</Text>
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
          onPress={() => navigation.navigate('ProductsListPage', {idDoc: navigation.getParam('docId')})}
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
