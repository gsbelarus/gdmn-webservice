import { Feather } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Searchbar, IconButton } from 'react-native-paper';

import { IGood } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const GoodItem = React.memo(({ item }: { item: IGood }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const docId = useRoute<RouteProp<DocumentStackParamList, 'GoodList'>>().params?.docId;

  return (
    <TouchableOpacity
      style={[localStyles.item, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate('DocumentLineEdit', { prodId: item.id, docId, modeCor: false });
      }}
    >
      <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
        <Feather name="box" size={20} color={'#FFF'} />
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
        <View style={localStyles.addationaly}>
          <View>
            <Text style={[localStyles.fieldDesciption, { color: colors.text }]}>{item.pricefsn} p.</Text>
            <Text style={[localStyles.fieldDesciption, { color: colors.text }]}>{item.valuename}</Text>
          </View>
          <View>
            <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.alias}</Text>
            <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>
              {item.barcode}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

/* const WeighedGoodItem = React.memo(({ item }: { item: IWeighedGoods }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state } = useAppStore();
  const [nameGood, setNameGood] = useState('');

  useEffect(() => {
    const findGood = state.goods.find((good) => good.id === item.goodkey);
    findGood ? setNameGood(findGood.name) : undefined;
  }, [item, state]);

  const docId = useRoute<RouteProp<RootStackParamList, 'SellProductsList'>>().params?.docId;

  return (
    <TouchableOpacity
      style={[localStyles.item, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate('SellProductDetail', { prodId: item.goodkey, docId, modeCor: false, weighedGood: item.id });
      }}
    >
      <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
        <Feather name="box" size={20} color={'#FFF'} />
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>{nameGood}</Text>
        <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.id}</Text>
      </View>
    </TouchableOpacity>
  );
}); */

const GoodListScreen = () => {
  const route = useRoute<RouteProp<DocumentStackParamList, 'GoodList'>>();
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);
  const [text, onChangeText] = useState('');
  const { state } = useAppStore();

  const ref = React.useRef<FlatList<IGood>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IGood }) => <GoodItem item={item} />;
  // const renderItemWieghed = ({ item }: { item: IWeighedGoods }) => <WeighedGoodItem item={item} />;

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
            onBarCodeScanned={({ data }) => (scanned ? undefined : handleBarCodeScanned(data))}
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
          <FlatList
            ref={ref}
            data={((state.references?.goods?.data as unknown) as IGood[]).filter(
              (item) =>
                item.groupkey === route.params?.group &&
                (item.barcode.toLowerCase().includes(text.toLowerCase()) ||
                  item.name.toLowerCase().includes(text.toLowerCase())),
            )}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
          />
        </>
      )}
    </View>
  );
};

export { GoodListScreen };

const localStyles = StyleSheet.create({
  addationaly: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 3,
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fieldDesciption: {
    opacity: 0.5,
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
});
