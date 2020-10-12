
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Text, Searchbar, Button, IconButton } from 'react-native-paper';
import { IContact, IGood, IReference, IRem, IRemain, IRemains } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { formatValue } from '../../../helpers/utils';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

interface IField {
  id: number;
  name?: string;
  [fieldName: string]: unknown;
}

const LineItem = React.memo(({ item }: { item: IField }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ReferenceDetail', { item });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <Text style={[localStyles.name, { color: colors.text }]}>{item.name ?? item.id}</Text>
          <View style={localStyles.flexDirectionRow}>
            <Text>Цена: {formatValue({type: 'number', decimals: 2}, item.price as number)} Остаток: {item.remains}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const RemainsViewScreen = ({ route }) => {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IRem[]>();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);

  const { item: contactItem }: { item: IReference } = route.params;

  const { state } = useAppStore();

  const remains = useMemo(() => state.references?.remains?.data as IRemain[], [state.references?.remains?.data]);

  const goods = useMemo(() => state.references?.goods?.data as IGood[], [state.references?.good?.data]);

  const contactId = useMemo(() => contactItem.id, [contactItem.id]);

  const contactName = useMemo(() => (state.references?.contacts?.data as IContact[])?.find(cont => cont.id === contactId).name, [state.references?.contacts?.data, contactId]);

  useEffect(() => {
    if (!remains) {
      return;
    }
    setFilteredList(
      remains?.find(rem => rem.contactId === contactId)?.data?.map(rem =>
        ({...goods?.find(good => good.id === rem.goodId), price: rem.price, remains: rem.q}))
        .filter(i => (i.name ? i.name?.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        .filter(i => (i.barcode ? i.barcode?.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        .sort((a, b) => a.name < b.name ? -1 : 1)
    );
  }, [remains, searchQuery, contactId]);

  const ref = React.useRef<FlatList<IField>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IField }) => <LineItem item={item} />;

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
          setSearchQuery(data);
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
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
          <View style={[localStyles.content, { backgroundColor: colors.card }]}>
            <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>
              {contactName}
            </SubTitle>
            <ItemSeparator />
            <View style={localStyles.flexDirectionRow}>
              <Searchbar
                placeholder="Поиск"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={[localStyles.flexGrow, localStyles.searchBar]}
              />
            </View>
            <ItemSeparator />
            <FlatList
              ref={ref}
              data={filteredList}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderItem}
              ItemSeparatorComponent={ItemSeparator}
            />
          </View>
        )}
      </>
    </TouchableWithoutFeedback>
  );
};

export { RemainsViewScreen };

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
    margin: 10,
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
   // padding: 8,
    marginRight: 4,
    marginLeft: 4
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    padding: 10,
  },
});
