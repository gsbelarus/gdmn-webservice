import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Text, Searchbar, Button, IconButton } from 'react-native-paper';

import { IReference } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
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
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ViewReferenceScreen = ({ route }) => {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IReference>();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);

  const { item: refItem }: { item: IReference } = route.params;

  useEffect(() => {
    // console.log('params', route.params);
    if (!refItem) {
      return;
    }

    setFilteredList({
      ...refItem,
      data: refItem.data.filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true)),
    });
  }, [refItem, searchQuery]);

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
          <View style={[localStyles.content, { backgroundColor: colors.card }]}>
            <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>
              {filteredList?.name}
            </SubTitle>
            <ItemSeparator />
            <View style={localStyles.flexDirectionRow}>
              <Searchbar
                placeholder="Поиск"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={
                  filteredList && filteredList.type === 'weighedgoods'
                    ? [localStyles.flexGrow, localStyles.searchBar]
                    : localStyles.searchBar
                }
              />
              {filteredList && filteredList.type === 'weighedgoods' ? (
                <IconButton
                  icon="barcode-scan"
                  size={26}
                  style={localStyles.iconSettings}
                  onPress={() => setDoScanned(true)}
                />
              ) : undefined}
            </View>
            <ItemSeparator />
            <FlatList
              ref={ref}
              data={
                filteredList && filteredList.type === 'weighedgoods'
                  ? filteredList?.data.filter((item) =>
                      searchQuery.length === 13 && !Number.isNaN(searchQuery)
                        ? item.id.toString().includes(Number(searchQuery).toString().slice(0, -1)) ||
                          item.id.toString().includes(Number(searchQuery).toString())
                        : item.id.toString().includes(Number(searchQuery).toString()),
                    )
                  : filteredList?.data
              }
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

export { ViewReferenceScreen };

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
    padding: 8,
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
