import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Text, Searchbar, Button } from 'react-native-paper';
import { IContact, IRefData } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

interface IField {
  id: number;
  name?: string;
  [fieldName: string]: unknown;
}

//type Props = StackScreenProps<ReferencesStackParamList, 'RemainsView'>;

const LineItem = React.memo(({ item }: { item: IField }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RemainsView', { item });
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

const RemainsContactListViewScreen = () => {
  const { colors } = useTheme();

  const { state: appState, actions: appActions } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IRefData[]>();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);

  const contacts = useMemo(() => appState.references?.contacts?.data as IContact[], [appState.references?.contacts?.data]);

  useEffect(() => {
    if (appState.forms?.remainsParams) {
      return;
    }
    appActions.setForm({
      name: 'remainsParams',
      contactId: 0,
    });
  }, [appActions, appState.forms?.remainsParams]);


  useEffect(() => {
    if (!contacts) {
      return;
    }
    setFilteredList(contacts?.filter((i) => (i.name ? i.name.toUpperCase().includes(searchQuery.toUpperCase()) : true)));
  }, [contacts, searchQuery]);

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
              {appState.references?.contacts?.name}
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

export { RemainsContactListViewScreen };

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
  price: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    padding: 10,
  },
  picker: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
  },
  pickerText: {
    alignSelf: 'center',
    flexGrow: 1,
    padding: 10,
  },
  pickerButton: {
    alignSelf: 'center',
    padding: 0,
    textAlign: 'right',
  },
  fieldContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    margin: 5,
  },
});
