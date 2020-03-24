import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, AsyncStorage, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useFocusEffect } from 'react-navigation-hooks';

import styles from '../styles/global';

interface IContact {
  id: number;
  name: string;
  type: number;
}

interface IRemain {
  goodId: number;
  quantity: number;
  price: number;
  contactId: number;
}

interface IDocumentType {
  id: number;
  name: string;
}

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

const ProductPage = (): JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [data, setData] = useState([]);
  const [doc, setDoc] = useState<IDocument>();
  const [docType, setDocType] = useState<IDocumentType>();
  const [contact, setContact] = useState<IContact>();
  const [remains, setRemains] = useState<IRemain[]>();

  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        const docId = navigation.getParam('docId');
        const docs = JSON.parse(await AsyncStorage.getItem('docs')).find((item) => item.id === docId);
        setDoc(docs);
        setRemains(JSON.parse(await AsyncStorage.getItem('remains')));
        setDocType(
          JSON.parse(await AsyncStorage.getItem('documenttypes')).find((item) => item.id === docs.head.doctype),
        );
        setContact(
          JSON.parse(await AsyncStorage.getItem('contacts')).find((item) => item.id === docs.head.fromcontactId),
        );
      };
      getData();
    }, []),
  );

  useEffect(() => {
    const getData = async () => {
      setData(
        doc?.lines
          ? JSON.parse(await AsyncStorage.getItem('goods')).filter((item) =>
              doc?.lines.find((line) => line.goodId === item.id),
            )
          : [],
      );
    };
    getData();
  }, [doc]);

  return (
    <View style={localeStyles.container}>
      <View style={localeStyles.documentHeader}>
        <Text numberOfLines={5} style={localeStyles.documentHeaderText}>
          {docType ? docType.name : ''}
        </Text>
        <Text numberOfLines={5} style={localeStyles.documentHeaderText}>
          {contact ? contact.name : ''}
        </Text>
        <Text numberOfLines={5} style={localeStyles.documentHeaderText}>
          {doc ? new Date(doc.head.date).toLocaleDateString() : ''}
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {data.map((item, idx) => (
          <View style={localeStyles.productView} key={idx}>
            <View style={localeStyles.productTextView}>
              <View style={localeStyles.productIdView}>
                <Text style={localeStyles.productId}>{idx + 1}</Text>
              </View>
              <View style={localeStyles.productNameTextView}>
                <Text numberOfLines={5} style={localeStyles.productTitleView}>
                  {item.name}
                </Text>
                <Text numberOfLines={5} style={localeStyles.productBarcodeView}>
                  {item.barcode}
                </Text>
              </View>
              {doc?.head.status === 0 ? (
                <View style={{ justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    style={localeStyles.deleteButton}
                    onPress={async () => {
                      Alert.alert('Вы уверены, что хотите удалить?', '', [
                        {
                          text: 'OK',
                          onPress: async () => {
                            const docs = JSON.parse(await AsyncStorage.getItem('docs'));
                            const docId = docs.findIndex((curr) => curr.id === doc.id);
                            docs[docId] = {
                              ...doc,
                              lines: doc.lines.filter((line) => line.goodId !== item.id),
                            };
                            await AsyncStorage.setItem('docs', JSON.stringify(docs));
                            setDoc(docs[docId]);
                          },
                        },
                        {
                          text: 'Отмена',
                          onPress: () => {},
                        },
                      ]);
                    }}
                  >
                    <MaterialIcons size={25} color="#2D3083" name="delete-forever" />
                  </TouchableOpacity>
                </View>
              ) : undefined}
            </View>

            <View style={localeStyles.productNumView}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Ionicons size={20} color="#8C8D8F" name="md-pricetag" />
                <Text numberOfLines={5} style={localeStyles.productPriceView}>
                  {remains?.find((remain) => remain.goodId === item.id)
                    ? remains?.find((remain) => remain.goodId === item.id).price
                    : ''}
                </Text>
              </View>
              <Text numberOfLines={5} style={localeStyles.productQuantityView}>
                {doc?.lines?.find((line) => line.goodId === item.id)
                  ? doc?.lines?.find((line) => line.goodId === item.id).quantity
                  : ''}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {doc?.head.status === 1 ? (
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={styles.circularButton}
            onPress={async () => {
              const docId = navigation.getParam('docId');
              const docs = JSON.parse(await AsyncStorage.getItem('docs'));
              await AsyncStorage.setItem(
                'docs',
                JSON.stringify(
                  docs.map((currDoc) => {
                    return currDoc.id === docId ? { ...currDoc, head: { ...currDoc.head, status: 0 } } : currDoc;
                  }),
                ),
              );
              setDoc(JSON.parse(await AsyncStorage.getItem('docs')).find((item) => item.id === docId));
            }}
          >
            <Text style={styles.buttonText}>Сделать "Черновиком"</Text>
          </TouchableOpacity>
        </View>
      ) : doc?.head.status === 0 ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.circularButton}
              onPress={() => navigation.navigate('DocumentFilterPage', { docId: doc.id })}
            >
              <MaterialIcons size={25} color="#FFF" name="edit" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circularButton}
              onPress={async () => {
                Alert.alert('Вы уверены, что хотите удалить?', '', [
                  {
                    text: 'OK',
                    onPress: async () => {
                      const docs = JSON.parse(await AsyncStorage.getItem('docs'));
                      await AsyncStorage.setItem('docs', JSON.stringify(docs.filter((item) => item.id !== doc.id)));
                      setData(JSON.parse(await AsyncStorage.getItem('docs')));
                      navigation.navigate('DocumentPage');
                    },
                  },
                  {
                    text: 'Отмена',
                    onPress: () => {},
                  },
                ]);
              }}
            >
              <MaterialIcons size={25} color="#FFF" name="delete-forever" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 15 }}>
            <TouchableOpacity
              style={styles.circularButton}
              onPress={() => {
                Alert.alert(
                  'Подтвердите действие',
                  'Статус будет изменён на "Готово". После этого редактирование документа будет невозможно.',
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        if (doc.head.status == 0) {
                          const docId = navigation.getParam('docId');
                          const docs = JSON.parse(await AsyncStorage.getItem('docs'));
                          await AsyncStorage.setItem(
                            'docs',
                            JSON.stringify(
                              docs.map((currDoc) => {
                                return currDoc.id === docId
                                  ? { ...currDoc, head: { ...currDoc.head, status: currDoc.head.status + 1 } }
                                  : currDoc;
                              }),
                            ),
                          );
                          setDoc(JSON.parse(await AsyncStorage.getItem('docs')).find((item) => item.id === docId));
                        }
                      },
                    },
                    {
                      text: 'Отмена',
                      onPress: () => {},
                    },
                  ],
                );
              }}
            >
              <AntDesign size={25} color="#FFF" name="check" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circularButton}
              onPress={() =>
                navigation.navigate('ProductsListPage', {
                  idDoc: navigation.getParam('docId'),
                  contactId: doc.head.fromcontactId,
                })
              }
            >
              <MaterialIcons size={25} color="#FFF" name="add" />
            </TouchableOpacity>
          </View>
        </View>
      ) : doc?.head.status === 3 ? (
        <TouchableOpacity
          style={{ ...localeStyles.deleteDocumentButton, marginVertical: 10 }}
          onPress={async () => {
            Alert.alert('Вы уверены, что хотите удалить?', '', [
              {
                text: 'OK',
                onPress: async () => {
                  const docs = JSON.parse(await AsyncStorage.getItem('docs'));
                  await AsyncStorage.setItem('docs', JSON.stringify(docs.filter((item) => item.id !== doc.id)));
                  setData(JSON.parse(await AsyncStorage.getItem('docs')));
                  navigation.navigate('DocumentPage');
                },
              },
              {
                text: 'Отмена',
                onPress: () => {},
              },
            ]);
          }}
        >
          <MaterialIcons size={25} color="#FFF" name="delete-forever" />
        </TouchableOpacity>
      ) : undefined}
      <StatusBar barStyle="light-content" />
    </View>
  );
};

const localeStyles = StyleSheet.create({
  container: {
    backgroundColor: '#DFE0FF',
    flex: 1,
  },
  deleteButton: {
    alignItems: 'center',
    height: 25,
    justifyContent: 'center',
    marginTop: 15,
    width: 25,
  },
  deleteDocumentButton: {
    alignItems: 'center',
    backgroundColor: '#2D3083',
    borderColor: '#2D3083',
    borderRadius: 50,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 10,
    width: 50,
  },
  documentHeader: {
    backgroundColor: '#5053A8',
    flexDirection: 'row',
    height: 50,
  },
  documentHeaderText: {
    color: '#FFFFFF',
    flex: 1,
    fontWeight: 'bold',
    marginHorizontal: 2,
    marginVertical: 5,
    textAlignVertical: 'center',
  },
  productBarcodeView: {
    marginTop: 5,
  },
  productId: {
    color: '#000000',
    margin: 15,
    textAlignVertical: 'center',
  },
  productIdView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productNameTextView: {
    color: '#000000',
    fontWeight: 'bold',
    marginHorizontal: 5,
    marginTop: 5,
    maxHeight: 75,
    minHeight: 45,
    textAlignVertical: 'center',
    width: '75%',
  },
  productNameView: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#E6E7FF',
  },
  productNumView: {
    alignItems: 'center',
    backgroundColor: '#F0F0FF',
    flexDirection: 'row',
    height: 25,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingLeft: 48,
  },
  productPriceView: {
    marginLeft: 5,
  },
  productQuantityView: {},
  productTextView: {
    flexDirection: 'row',
    margin: 5,
  },
  productTitleView: {
    flexGrow: 1,
    fontWeight: 'bold',
    maxHeight: 70,
    minHeight: 25,
  },
  productView: {
    flexDirection: 'column',
  },
  viewButton: {
    alignItems: 'center',
    backgroundColor: '#EEF2FC',
    borderColor: '#212323',
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    marginVertical: 15,
  },
  viewButtonPress: {
    alignItems: 'center',
    backgroundColor: '#2D3083',
    borderColor: '#212323',
    borderRadius: 4,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginVertical: 15,
  },
  viewButtonPressText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  viewButtonText: {
    color: '#676869',
    fontSize: 20,
  },
});

export default ProductPage;
