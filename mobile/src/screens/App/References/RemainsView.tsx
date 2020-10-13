import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';

import { IGood, IReference, IRem, IRemains } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { formatValue } from '../../../helpers/utils';
import { useAppStore } from '../../../store';

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
          <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
          <View style={localStyles.flexDirectionRow}>
            <Text>
              Цена: {formatValue({ type: 'number', decimals: 2 }, (item.price as number) ?? 0)} Остаток: {item.remains}
            </Text>
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

  const { item: contactItem }: { item: IReference } = route.params;

  const { state } = useAppStore();

  const remains = useMemo(
    () =>
      ((state.references?.remains?.data as unknown) as IRemains[])?.find((itm) => itm.contactId === contactItem?.id)
        ?.data,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.references?.remains?.data],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goods = useMemo(() => state.references?.goods?.data as IGood[], [state.references?.good?.data]);

  useEffect(() => {
    console.log(contactItem);
  }, [contactItem]);

  useEffect(() => {
    if (!remains) {
      return;
    }

    setFilteredList(
      remains
        .map((rem) => ({ ...goods?.find((good) => good.id === rem.goodId), price: rem.price, remains: rem.q }))
        .filter((i) => (i.name ? i.name?.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        .filter((i) => (i.barcode ? i.barcode?.toUpperCase().includes(searchQuery.toUpperCase()) : true))
        .sort((a, b) => (a.name < b.name ? -1 : 1)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remains, searchQuery, goods, contactItem?.id]);

  const ref = React.useRef<FlatList<IField>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IField }) => <LineItem item={item} />;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[localStyles.content, { backgroundColor: colors.card }]}>
        <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{contactItem?.name}</SubTitle>
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
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
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
