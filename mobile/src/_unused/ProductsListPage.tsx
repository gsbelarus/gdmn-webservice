import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, AsyncStorage, Alert, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';

import { styles } from '../styles/global';

const ProductsListPage = (): JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [text, onChangeText] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      const remains = JSON.parse(await AsyncStorage.getItem('remains')).filter(
        (item) => item.contactId === navigation.getParam('contactId'),
      );
      setGoods(
        JSON.parse(await AsyncStorage.getItem('goods')).filter((item) =>
          remains.find((remain) => remain.goodId === item.id),
        ),
      );
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert('Штрих-код был отсканирован', data, [
      {
        text: 'OK',
        onPress: () => {
          setDoScanned(false);
          onChangeText(data);
          setScanned(false);
        },
      },
      {
        text: 'CANCEL',
        onPress: () => {},
      },
    ]);
  };

  if (hasPermission === null) {
    return <Text>Запрос на получение доступа к камере</Text>;
  }
  if (hasPermission === false) {
    return <Text>Нет доступа к камере</Text>;
  }

  return (
    <View style={styles.container}>
      {doScanned ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && <Button onPress={() => setScanned(false)}>Сканировать ещё раз</Button>}
        </>
      ) : (
        <>
          <View style={{ justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', margin: 15 }}>
            <View style={{ flex: 1, marginRight: 15 }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => onChangeText(text)}
                value={text}
                placeholder="Type here to enter title or barCode"
                placeholderTextColor={'#9A9FA1'}
                multiline={true}
                autoCapitalize="sentences"
                underlineColorAndroid="transparent"
                selectionColor={'black'}
                returnKeyType="done"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity onPress={() => setDoScanned(true)}>
              <MaterialCommunityIcons name="barcode-scan" size={35} color={'#9A9FA1'} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 2 }}>
            {goods.find(
              (item) =>
                item.barcode.toLowerCase().includes(text.toLowerCase()) ||
                item.name.toLowerCase().includes(text.toLowerCase()),
            ) ? (
              goods
                .filter(
                  (item) =>
                    item.barcode.toLowerCase().includes(text.toLowerCase()) ||
                    item.name.toLowerCase().includes(text.toLowerCase()),
                )
                .map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() =>
                      navigation.navigate('ProductDetailPage', { id: item.id, idDoc: navigation.getParam('idDoc') })
                    }
                  >
                    <View style={localeStyles.productView}>
                      <View style={localeStyles.productTextView}>
                        <View style={localeStyles.productIdView}>
                          <Text style={localeStyles.productId}>{idx}</Text>
                        </View>
                        <View style={localeStyles.productNameTextView}>
                          <Text numberOfLines={5} style={localeStyles.productTitleView}>
                            {item.name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            ) : (
              <Text style={{ fontSize: 17, textAlign: 'center' }}>Товар не найден</Text>
            )}
          </ScrollView>
          <StatusBar barStyle="light-content" />
        </>
      )}
    </View>
  );
};

const localeStyles = StyleSheet.create({
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
    justifyContent: 'center',
    marginHorizontal: 5,
    marginTop: 5,
    width: '90%',
  },
  productTextView: {
    flexDirection: 'row',
    margin: 5,
  },
  productTitleView: {
    flexGrow: 1,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  productView: {
    flexDirection: 'column',
  },
});

export default ProductsListPage;
