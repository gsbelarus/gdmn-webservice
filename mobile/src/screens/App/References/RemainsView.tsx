import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect, useMemo } from 'react';
import { useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Text, Searchbar, Button, IconButton } from 'react-native-paper';

import { IReference } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { IListItem, IRemainsParams } from '../../../model/types';
import { RemainsStackParamList } from '../../../navigation/RemainsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

interface IField {
  id: number;
  name?: string;
  price?: number;
  q?: number;
  [fieldName: string]: unknown;
}

type Props = StackScreenProps<RemainsStackParamList, 'RemainsView'>;

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
        <View style={localStyles.details}>
          <Text style={[localStyles.price, { color: colors.text }]}>{item.price ?? ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const RemainsViewScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  console.log('RemainsViewScreen');
  const navigation = useNavigation();

  const { state: appState, actions: appActions } = useAppStore();
  const { contactId } = useMemo(() => {
    return ((appState.forms?.remainsParams as unknown) || {}) as IRemainsParams;
  }, [appState.forms?.remainsParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IReference>();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);

  const contacts = useMemo(() => appState.references?.contacts?.data, [appState.references?.contacts?.data]);

  const listContacts = useMemo(() => contacts?.map((item) => ({ id: item.id, value: item.name })), [contacts]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const { item: refItem }: { item: IReference } = route.params;

  useEffect(() => {
    if (appState.forms?.documentParams) {
      return;
    }
    appActions.setForm({
      name: 'remainsParams',
      contactId: undefined
    })
  }, [appActions, contactId]);

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

  const ReferenceItem = useCallback(
    (item: { value: string; onPress: () => void; color?: string; disabled?: boolean }) => {
      return (
        <TouchableOpacity
          {...item}
          onPress={item.disabled ? null : item.onPress}
          style={[localStyles.picker, { borderColor: colors.border }]}
        >
          <Text style={[localStyles.pickerText, { color: colors.text }]}>{item.value || 'не выбрано'}</Text>
          {!item.disabled && (
            <MaterialCommunityIcons
              style={localStyles.pickerButton}
              name="menu-right"
              size={30}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>
      );
    },
    [colors.border, colors.primary, colors.text],
  );

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
              {filteredList?.name}
            </SubTitle>
            <ItemSeparator />
            <View style={localStyles.flexDirectionRow}>
              <Searchbar
                placeholder="Поиск"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={localStyles.searchBar}
              />
            </View>
            <ItemSeparator />
             <ReferenceItem
              value={selectedItem(listContacts, contactId)?.value}
              onPress={() =>
                navigation.navigate('SelectItem1', {
                  formName: 'remainsParams',
                  fieldName: 'contactId',
                  title: 'Подразделение',
                  list: listContacts,
                  value: contactId,
                })
              }
            />
            <FlatList
              ref={ref}
              data={filteredList?.data}
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
});
