import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, AsyncStorage, Button, Alert, ScrollView} from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { TextInput } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';

const ProductsListPage = (): JSX.Element => {

  const navigate = useNavigation();
  const [text, onChangeText] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      setData(JSON.parse(await AsyncStorage.getItem('goods')));
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      'Bar code has been scanned',
      data,
      [
        {
          text: 'OK',
          onPress: () => {setDoScanned(false); onChangeText(data)}
        },
        {
          text: 'CANCEL',
          onPress: () => {}
        }
      ],
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {
        doScanned
          ? <>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button title={'Tap to scan again'} onPress={() => setScanned(false)} />}
          </>
          : <>
          <View style={{justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', margin: 15}}>
            <View style={{flex: 1, marginRight: 15}}>
              <TextInput
                style={styles.input}
                onChangeText={text => onChangeText(text)}
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
            <TouchableOpacity
              onPress={() => setDoScanned(true)}
            >
              <MaterialCommunityIcons
                name="barcode-scan"
                size={35}
                color={'#9A9FA1'}
              />
            </TouchableOpacity>
          </View>
        <ScrollView style={{flex: 2}}>
          {
            data.filter(item => item.BARCODE.toLowerCase().includes(text.toLowerCase()) || item.NAME.toLowerCase().includes(text.toLowerCase())).map( (item, idx) => (
              <TouchableOpacity key={idx} onPress={() => { navigate.setParams({'id': idx}); navigate.navigate('ProductDetailPage', {id: idx})}}>
                <View style={styles.productView}>
                  <View style={styles.productTextView}>
                    <View style={styles.productIdView}>
                      <Text style={styles.productId}>{idx}</Text>
                    </View>
                    <View style={styles.productNameTextView}>
                      <Text numberOfLines={5} style={styles.productTitleView}>{item.NAME}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>)
            )
          }
        </ScrollView> 
        <StatusBar barStyle = "light-content" />
      </>
      }
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
    marginTop: 5,
    marginHorizontal: 5,
    width: '90%',
    justifyContent: 'center',
    color: '#000000',
    fontWeight: 'bold'
  },
  productTitleView: {
    fontWeight: 'bold',
    textAlignVertical: 'center',
    flexGrow: 1
  },
  input: {
    borderColor: '#70667D',
    borderWidth: 1,
    fontSize: 18
  }
});

export default ProductsListPage;
