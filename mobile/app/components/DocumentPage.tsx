import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, AsyncStorage, ScrollView, Alert} from 'react-native';
import { useNavigation, useFocusEffect } from 'react-navigation-hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { path } from '../../App';
import statuses from '../../assets/documentStatuses.json';

const DocumentPage = (): JSX.Element => {

  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [dataContact, setDataContact] = useState([]);
  const [dataDocTypes, setDataDocTypes] = useState([]);
  const [user, setUser] = useState();

  useFocusEffect(React.useCallback(() => {
    const getData = async() => {
      setData(JSON.parse(await AsyncStorage.getItem('docs')));
      setDataContact(JSON.parse(await AsyncStorage.getItem('contacts')));
      setDataDocTypes(JSON.parse(await AsyncStorage.getItem('documenttypes')));
      const getMe = await fetch(
        `${path}me`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }
      ).then(res => res.json());
      getMe.status === 200 && getMe.result !== 'not authenticated'
      ? setUser(getMe.result)
      : undefined;
    }
    getData();
  }, []));

  const sendUpdateRequest = async () => {
    if(user) {
      const result = await fetch(
        `${path}messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            head: {
              companyId: user.companies[0]
            },
            body: {
              type: "cmd",
              payload: {
                name: "post_documents",
                params: data
              }
            }
          })
        }
      ).then(res => res.json());
      if(result.status === 200) {
        Alert.alert(
          'Успех!',
          '',
          [
            {
              text: 'OK',
              onPress: () => {}
            },
          ]
        )
      } else {
        Alert.alert(
          'Запрос не был отправлен',
          '',
          [
            {
              text: 'OK',
              onPress: () => {}
            },
          ]
        )
      }
    } else {
      Alert.alert(
        'Упс!',
        'Что-то пошло не так!',
        [
          {
            text: 'OK',
            onPress: () => {}
          },
        ]
      )
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}}>
        {
          data ? data.map( (item, idx) => <View style={styles.deleteView}>
            <TouchableOpacity key={idx} onPress={() => { navigation.navigate('ProductPage', {docId: item.id})}}>
              <View style={styles.productView} key={idx}>
                <View style={styles.productTextView}>
                  <View style={styles.productIdView}>
                    <Text style={styles.productId}>{idx + 1}</Text>
                  </View>
                  <View style={styles.productNameTextView}>
                    <Text numberOfLines={5} style={styles.productTitleView}>{item.head && dataDocTypes && dataDocTypes.find(type => type.id === item.head.doctype) ? dataDocTypes.find(type => type.id === item.head.doctype).name : ''}</Text>
                    <Text numberOfLines={5} style={styles.productBarcodeView}>{item.head && dataContact && dataContact !== [] && dataContact.find(contact => contact.id === item.head.fromcontactId) ? dataContact.find(contact => contact.id === item.head.fromcontactId).name : ''}</Text>
                    <Text numberOfLines={5} style={styles.productBarcodeView}>{item.head && statuses.find(status => status.id === item.head.status) ? statuses.find(status => status.id === item.head.status).name : ''}</Text>
                  </View>
                </View>
                <View style={styles.productNumView}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text numberOfLines={5} style={styles.productPriceView}>{item && item.head ? new Date(item.head.date).toLocaleDateString() : ''}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={styles.deleteButton} 
              onPress={async () => {
                const docs = JSON.parse(await AsyncStorage.getItem('docs'));
                await AsyncStorage.setItem('docs', JSON.stringify(docs.filter(doc => doc.id !== item.id)));
                setData(JSON.parse(await AsyncStorage.getItem('docs')));
              }}
            >
              <MaterialIcons
                size={25}
                color='#2D3083' 
                name='delete-forever' 
              />
            </TouchableOpacity>
            <View style={{...styles.productNumView, alignSelf: 'flex-end'}}></View>
            </View>
          </View>
          )
          : undefined
        }
      </ScrollView>
      <View style={{ flexDirection: 'column', justifyContent: "flex-end", }}>
        <TouchableOpacity
          style={styles.createButton} 
          onPress={() => navigation.navigate('DocumentFilterPage')}
        >
          <Text style={styles.createButtonText}>Создать новый документ</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.sendButton} 
        onPress={async() => sendUpdateRequest()
          //await AsyncStorage.removeItem('docs');
        }
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
    flex: 1
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
  productNameTextView: {
    maxHeight: 75,
    minHeight: 45,
    marginTop: 5,
    marginHorizontal: 5,
    width: '75%',
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
    marginTop: 5
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
  },
  deleteView: {
    flexDirection: 'row'
  },
  deleteButton: {
    marginTop: 15,
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default DocumentPage;
