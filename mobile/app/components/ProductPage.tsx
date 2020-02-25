import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, AsyncStorage, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from 'react-navigation-hooks';

const ProductPage = (): JSX.Element => {

  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [doc, setDoc] = useState();
  const [docType, setDocType] = useState();
  const [contact, setContact] = useState();
  const [remains, setRemains] = useState();

  useFocusEffect(React.useCallback(() => {
    const getData = async() => {
      const docId = navigation.getParam('docId');
      const docs = JSON.parse(await AsyncStorage.getItem('docs')).find(item => item.id === docId)
      setDoc(docs);
      setData(docs!.lines ? JSON.parse(await AsyncStorage.getItem('goods')).filter(item => docs.lines.find(line => line.goodId === item.id)) : []);
      setRemains(JSON.parse(await AsyncStorage.getItem('remains')));
      setDocType(JSON.parse(await AsyncStorage.getItem('documenttypes')).find(item => item.id === docs.head.doctype));
      setContact(JSON.parse(await AsyncStorage.getItem('contacts')).find(item => item.id === docs.head.fromcontactId));
    }
    getData();
  }, []));

  return (
    <View style={styles.container}>
      <View style={styles.documentHeader}>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{docType ? docType.name : ''}</Text>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{contact ? contact.name : ''}</Text>
        <Text numberOfLines={5} style={styles.documentHeaderText}>{doc ? new Date(doc.head.date).toLocaleDateString() : ''}</Text>
      </View>
      <ScrollView style={{flex: 1}}>
        {
          data.map( (item, idx) => <View style={styles.productView} key={idx}>
            <View style={styles.productTextView}>
              <View style={styles.productIdView}>
                <Text style={styles.productId}>{idx + 1}</Text>
              </View>
              <View style={styles.productNameTextView}>
                <Text numberOfLines={5} style={styles.productTitleView}>{item.name}</Text>
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
                <Text numberOfLines={5} style={styles.productPriceView}>{remains && remains.find(remain => remain.goodId === item.id) ? remains.find(remain => remain.goodId === item.id).price : ''}</Text>
              </View>
              <Text numberOfLines={5} style={styles.productQuantityView}>{doc ? doc.lines.find(line => line.goodId === item.id).quantity : ''}</Text>
            </View>
          </View>)
        }
      </ScrollView>
      {
        doc?.head.status === 1
          ? (
            <TouchableOpacity
              style={styles.createButton} 
              onPress={ async() => {
                const docId = navigation.getParam('docId');
                const docs = JSON.parse(await AsyncStorage.getItem('docs'));
                await AsyncStorage.setItem(
                  'docs',
                  JSON.stringify(
                    docs.map(currDoc => {return currDoc.id === docId ? {...currDoc, head: {...currDoc.head, status: 0}} : currDoc})
                  )
                );
                setDoc(JSON.parse(await AsyncStorage.getItem('docs')).find(item => item.id === docId))
              }}
            >
              <Text style={styles.createButtonText}>Вернуть статус "Черновик"</Text>
            </TouchableOpacity>
          )
          : doc?.head.status === 0
            ? <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', margin: 10}}>
              <TouchableOpacity
                style={styles.addButton} 
                onPress={() => {
                  Alert.alert(
                    'Подтвердите действие',
                    'Статус будет изменён на "Готово". После этого редактирование документа будет невозможно.',
                    [
                      {
                        text: 'OK',
                        onPress: async() => {
                          if(doc.head.status == 0) {
                            const docId = navigation.getParam('docId');
                            const docs = JSON.parse(await AsyncStorage.getItem('docs'));
                            await AsyncStorage.setItem(
                              'docs',
                              JSON.stringify(
                                docs.map(currDoc => {return currDoc.id === docId ? {...currDoc, head: {...currDoc.head, status: currDoc.head.status + 1}} : currDoc})
                              )
                            );
                            setDoc(JSON.parse(await AsyncStorage.getItem('docs')).find(item => item.id === docId))
                          }
                        }
                      },
                      {
                        text: 'Отмена',
                        onPress: () => {}
                      },
                    ]
                  )
                }}
              >
                <AntDesign
                  size={20}
                  color='#FFF' 
                  name='check' 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton} 
                onPress={() => navigation.navigate('ProductsListPage', {idDoc: navigation.getParam('docId'), contactId: doc.head.fromcontactId})}
              >
                <MaterialIcons
                  size={20}
                  color='#FFF' 
                  name='add' 
                />
              </TouchableOpacity>
            </View>
            : undefined
      }  
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

export default ProductPage;
