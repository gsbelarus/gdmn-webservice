import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { Text, Searchbar } from 'react-native-paper';

import { IContact, IRefData, IRemains } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { useAppStore } from '../../../store';

interface IField {
  id: number;
  name?: string;
  [fieldName: string]: unknown;
}

const keyExtractor = (item: IField) => String(item.id);

const RemainsContactListViewScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { state: appState } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IRefData[]>();

  const LineItem = useCallback(
    ({ item }: { item: IField }) => {
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
    },
    [colors.card, colors.primary, colors.text, navigation],
  );

  const remains = (appState.references?.remains?.data as unknown) as IRemains[];
  const contacts = appState.references?.contacts?.data as IContact[];

  useEffect(() => {
    if (!remains) {
      return;
    }

    const contactList: IField[] = remains
      .reduce((prev: IField[], el) => {
        if (!prev.find((c) => c.id === el.contactId)) {
          const contact = contacts.find((c) => c.id === el.contactId);
          prev.push({ id: el.contactId, name: contact?.name || '' })
        }
        return prev;
      }, [])
      .filter((el) => el.name?.includes(searchQuery.toUpperCase()))
      .sort((a, b) => a.name!.localeCompare(b.name!) );

    setFilteredList(contactList);
  }, [remains, contacts, searchQuery]);

  const ref = React.useRef<FlatList<IField>>(null);
  useScrollToTop(ref);

  const RC = useMemo( () => <RefreshControl refreshing={!filteredList} title="загрузка данных..." />, [filteredList]);
  const EC = useMemo( () => filteredList ? <Text style={localStyles.emptyList}>Список пуст</Text> : null, [] );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[localStyles.content, { backgroundColor: colors.card }]}>
        <SubTitle style={[localStyles.title, { backgroundColor: colors.background }]}>
          {appState.references?.contacts?.name}
        </SubTitle>
        <ItemSeparator />
        {!!filteredList && (
          <>
            <View style={localStyles.flexDirectionRow}>
              <Searchbar
                placeholder="Поиск"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={[localStyles.flexGrow, localStyles.searchBar]}
              />
            </View>
            <ItemSeparator />
          </>
        )}
        <FlatList
          ref={ref}
          data={filteredList}
          keyExtractor={keyExtractor}
          renderItem={LineItem}
          refreshControl={RC}
          ListEmptyComponent={EC}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
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
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
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
