import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, AsyncStorage, Alert} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from 'react-navigation-hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { baseUrl } from '../helpers/utils';
import statuses from '../assets/documentStatuses.json';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
import { styles } from '../styles/global';

interface IDocument {
  id: string;
  head: IHead;
  lines: ILine[];
}

interface IHead {
  doctype: number;
  fromcontactId: number;
  tocontactId: number;
  date: string;
  status: number;
}

interface ILine {
  id: string;
  goodId: number;
  quantity: number;
}

interface IUser {
  id: string;
  userName: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

const LineDocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];
  const [dataContact, setDataContact] = useState([]);
  const [dataDocTypes, setDataDocTypes] = useState([]);

  useEffect(() => {
    const getData = async() => {
      setDataContact(JSON.parse(await AsyncStorage.getItem('contacts')));
      setDataDocTypes(JSON.parse(await AsyncStorage.getItem('documenttypes')));
    }
    getData();
  }, [])

  return (
    <View style={localeStyles.deleteView}>
      <TouchableOpacity onPress={() => { /*navigation.navigate('ProductPage', {docId: item.id})*/}}>
        <View style={localeStyles.productView}>
          <View style={localeStyles.productTextView}>
            <View style={localeStyles.productNameTextView}>
              <Text numberOfLines={5} style={localeStyles.productTitleView}>{item.head && dataDocTypes && dataDocTypes.find(type => type.id === item.head.doctype) ? dataDocTypes.find(type => type.id === item.head.doctype).name : ''}</Text>
              <Text numberOfLines={5} style={localeStyles.productBarcodeView}>{item.head && dataContact && dataContact !== [] && dataContact.find(contact => contact.id === item.head.fromcontactId) ? dataContact.find(contact => contact.id === item.head.fromcontactId).name : ''}</Text>
              <Text numberOfLines={5} style={{...localeStyles.productTitleView, color: statusColors[item.head.status], fontWeight: 'bold' }}>{item.head && statuses.find(status => status.id === item.head.status) ? statuses.find(status => status.id === item.head.status).name : ''}</Text>
            </View>
          </View>
          <View style={localeStyles.productNumView}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text numberOfLines={5} style={localeStyles.productPriceView}>{item && item.head ? new Date(item.head.date).toLocaleDateString() : ''}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
        <TouchableOpacity
          style={localeStyles.deleteButton} 
          onPress={async () => {
            if(item.head.status === 2) {
              Alert.alert(
                'Предупреждение!',
                'Документ со статусом "Отправлено" не может быть удалён.',
                [
                  {
                    text: 'OK'
                  },
                ],
              );
            } else {
              Alert.alert(
                'Предупреждение!',
                'Вы действительно хотите удалить этот документ? После удаления нельзя восстановить.',
                [
                  {
                    text: 'OK',
                    onPress: async() => {
                      const docs = JSON.parse(await AsyncStorage.getItem('docs'));
                      await AsyncStorage.setItem('docs', JSON.stringify(docs.filter(doc => doc.id !== item.id)));
                      //setData(JSON.parse(await AsyncStorage.getItem('docs')));
                    }
                  },
                  {
                    text: 'Отмена'
                  },
                ],
              );
            }
          }}
        >
          <MaterialIcons
            size={25}
            color='#2D3083' 
            name='delete-forever' 
          />
        </TouchableOpacity>
        <View style={{...localeStyles.productNumView, alignSelf: 'flex-end'}}></View>
      </View>
    </View>
  );
});

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

const DocumentPage = (): JSX.Element => {

  const navigation = useNavigation();
  const [data, setData] = useState<IDocument[]>([]);
  const [user, setUser] = useState<IUser>();
  const ref = React.useRef<FlatList<IDocument>>(null);

  const renderItem = ({ item }: { item: IDocument }) => <LineDocumentItem item={item} />;

  useFocusEffect(React.useCallback(() => {
    const getData = async() => {
      setData(JSON.parse(await AsyncStorage.getItem('docs')));
      const getMe = await fetch(
        `${baseUrl}/me`,
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
        `${baseUrl}/messages`,
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
                params: data.filter(doc => doc.head.status === 1)
              }
            }
          })
        }
      ).then(res => res.json());
      if(result.status === 200) {
        setData(data.map(doc => {return doc.head.status === 1 ? {...doc, head: { ...doc.head, status: doc.head.status + 1}} : doc}))
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
    <View style={localeStyles.container}>
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <View style={{ flexDirection: 'column', justifyContent: "flex-end", }}>
        <TouchableOpacity
          style={localeStyles.createButton} 
          onPress={() => navigation.navigate('DocumentFilterPage')}
        >
          <Text style={localeStyles.createButtonText}>Создать новый документ</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={localeStyles.sendButton} 
        onPress={async() => sendUpdateRequest()
          //await AsyncStorage.removeItem('docs');
        }
      >
        <Text style={localeStyles.sendButtonText}>Отправить</Text>
      </TouchableOpacity>
      <StatusBar barStyle = "light-content" />
    </View>
  );
}

const localeStyles = StyleSheet.create({
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
    alignItems: 'center',
    paddingLeft: 48
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
    width: '100%',
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
    flex: 1,
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default DocumentPage;
