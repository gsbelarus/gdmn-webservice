import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import products from '../../../mockData/Goods.json';
import { IGood } from '../../../model/inventory';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import styles from '../../../styles/global';

const GoodItem = React.memo(({ item }: { item: IGood }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const docId = useRoute< RouteProp<DocumentStackParamList, 'ProductsList'> >().params?.docId;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ProductDetail', { prodId: item.id, docId, modeCor: false });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={localStyles.letter}>{item.name.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={localStyles.details}>
          <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.barcode}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ProductsListScreen = () => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);
  const [text, onChangeText] = useState('');

  const ref = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IGood }) => <GoodItem item={item} />;

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
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

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      {hasPermission === null ? (
        <Text style={styles.title}>Запрос на получение доступа к камере</Text>
      ) : hasPermission === false ? (
        <Text style={styles.title}>Нет доступа к камере</Text>
      ) : undefined}
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
          <View
            style={{
              justifyContent: 'space-around',
              flexDirection: 'row',
              alignItems: 'center',
              margin: 15,
            }}
          >
            <View style={{ flex: 1, marginRight: 15 }}>
              <TextInput
                style={[
                  styles.input,
                  {
                    fontSize: 14,
                    backgroundColor: colors.card,
                    color: colors.text,
                    marginTop: 0,
                    height: 30,
                    paddingTop: 0,
                  },
                ]}
                onChangeText={(text) => onChangeText(text)}
                value={text}
                placeholder="Введите шрих-код или название"
                placeholderTextColor={colors.border}
                multiline={false}
                autoCapitalize="sentences"
                underlineColorAndroid="transparent"
                selectionColor={'black'}
                returnKeyType="done"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity onPress={() => setDoScanned(true)}>
              <MaterialCommunityIcons name="barcode-scan" size={35} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {!products.find(
            (item) =>
              item.barcode.toLowerCase().includes(text.toLowerCase()) ||
              item.name.toLowerCase().includes(text.toLowerCase()),
          ) ? (
            <Text style={styles.title}>Не найдено</Text>
          ) : (
            <FlatList
              ref={ref}
              data={products.filter(
                (item) =>
                  item.barcode.toLowerCase().includes(text.toLowerCase()) ||
                  item.name.toLowerCase().includes(text.toLowerCase()),
              )}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderItem}
              ItemSeparatorComponent={ItemSeparator}
            />
          )}
        </>
      )}
    </View>
  );
};

export { ProductsListScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  content: {
    height: '100%',
  },
  details: {
    margin: 8,
  },
  fieldDesciption: {
    opacity: 0.5,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
});
