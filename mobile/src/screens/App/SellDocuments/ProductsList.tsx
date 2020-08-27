import { Feather } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Searchbar, IconButton } from 'react-native-paper';

import { IGood } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const GoodItem = React.memo(({ item }: { item: IGood }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const docId = useRoute<RouteProp<RootStackParamList, 'SellProductsList'>>().params?.docId;

  return (
    <TouchableOpacity
      style={[localStyles.item, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate('SellProductDetail', { prodId: item.id, docId, modeCor: false });
      }}
    >
      <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
        <Feather name="box" size={20} color={'#FFF'} />
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.alias}</Text>
        <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.barcode}</Text>
      </View>
    </TouchableOpacity>
  );
});

const SellProductsListScreen = () => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);
  const [text, onChangeText] = useState('');
  const { state } = useAppStore();

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

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    Alert.alert('Сохранить результат?', data, [
      {
        text: 'Да',
        onPress: () => {
          setDoScanned(false);
          onChangeText(data);
          setScanned(false);
        },
      },
      {
        text: 'Нет',
        onPress: () => {
          // setDoScanned(false);
          // onChangeText(data);
          setScanned(false);
        },
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
            onBarCodeScanned={({ _, data }) => (scanned ? undefined : handleBarCodeScanned(data))}
            style={StyleSheet.absoluteFillObject}
          />
          <Button
            onPress={() => {
              setScanned(false);
              setDoScanned(false);
            }}
          >
            Назад
          </Button>
        </>
      ) : (
        <>
          <View style={localStyles.flexDirectionRow}>
            <Searchbar
              placeholder="Штрих-код или название"
              onChangeText={onChangeText}
              value={text}
              style={[localStyles.flexGrow, localStyles.searchBar]}
            />
            <IconButton
              icon="barcode-scan"
              size={26}
              style={localStyles.iconSettings}
              onPress={() => setDoScanned(true)}
            />
          </View>
          <ItemSeparator />
          {/*  <View style={[localStyles.filter, { borderColor: colors.border }]}>
            <TextInput
              style={[
                styles.input,
                localStyles.textInput,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                },
              ]}
              onChangeText={onChangeText}
              value={text}
              clearButtonMode={'always'}
              placeholder="Введите шрих-код или название"
              placeholderTextColor={colors.border}
              autoCapitalize="sentences"
              underlineColorAndroid="transparent"
              selectionColor={'black'}
              returnKeyType="done"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => onChangeText('')} style={localStyles.barcodeButton}>
              <MaterialCommunityIcons name="eraser" size={35} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDoScanned(true)} style={localStyles.barcodeButton}>
              <MaterialCommunityIcons name="barcode-scan" size={35} color={colors.primary} />
            </TouchableOpacity>
          </View> */}
          {!state.goods.find(
            (item) =>
              item.barcode.toLowerCase().includes(text.toLowerCase()) ||
              item.name.toLowerCase().includes(text.toLowerCase()),
          ) ? (
            <Text style={styles.title}>Не найдено</Text>
          ) : (
            //TODO: ListEmptyComponent - компонент для если список пустой
            <FlatList
              ref={ref}
              data={state.goods.filter(
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

export { SellProductsListScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  barcodeButton: {
    alignItems: 'flex-end',
    flex: 1,
  },
  content: {
    height: '100%',
  },
  details: {
    // borderWidth: 1,
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 3,
  },
  fieldDesciption: {
    opacity: 0.5,
  },
  filter: {
    borderBottomWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    flexDirection: 'row',
    margin: 5,
    padding: 5,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
  },
  iconSettings: {
    width: 36,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    alignSelf: 'flex-end',
    fontSize: 12,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  textInput: {
    flex: 6,
    fontSize: 14,
    height: 35,
    marginTop: 0,
  },
});
