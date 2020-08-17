import { useScrollToTop, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Searchbar, IconButton, Checkbox, Paragraph } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { IField } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';

interface ISelectList {
  name: string;
  type: string;
  data: IField[];
}

type Props = StackScreenProps<RootStackParamList, 'SelectItemScreen'>;

export const SelectItemScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<ISelectList>(undefined);
  const [checkedItem, setCheckedItem] = useState<number[]>([]);

  const [isMultiSelect, setIsMultiSelect] = useState<boolean>(false);

  useEffect(() => {
    if (!route.params?.list) {
      return;
    }
    console.log('params af', Object.keys(route.params));

    const { list, selected, isMulti } = route.params;

    setIsMultiSelect(isMulti || false);

    if (selected) {
      setCheckedItem(selected);
    }

    setFilteredList({
      ...list,
      data: list.data.filter((i) => i.value.toUpperCase().includes(searchQuery.toUpperCase())),
    });
  }, [route.params, route.params?.list, searchQuery]);

  const refList = React.useRef<FlatList<IField>>(null);
  useScrollToTop(refList);

  const selectItem = useCallback(
    (id: number) => {
      setCheckedItem((prev) => (isMultiSelect ? [...prev, id] : [id]));
    },
    [isMultiSelect],
  );

  const renderItem = useCallback(
    ({ item }: { item: IField }) => {
      return <LineItem item={item} checked={checkedItem.includes(item.id)} onSelect={selectItem} />;
    },
    [checkedItem, selectItem],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="check-circle"
          size={30}
          //onPress={() => navigation.navigate('CreateSellDocument', { [filteredList?.type]: checkedItem })}
          onPress={() => navigation.navigate('SettingsGettingDocument', { [filteredList?.type]: checkedItem })}
        />
      ),
    });
  }, [checkedItem, filteredList?.type, navigation]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{filteredList?.name}</SubTitle>
      <ItemSeparator />
      <Searchbar placeholder="Поиск" onChangeText={setSearchQuery} value={searchQuery} style={localStyles.searchBar} />
      <ItemSeparator />
      <FlatList
        ref={refList}
        data={filteredList?.data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

const LineItem = React.memo(
  ({ item, checked, onSelect }: { item: IField; checked: boolean; onSelect: (id: number) => void }) => {
    return (
      <TouchableOpacity onPress={() => onSelect(item.id)}>
        <View style={localStyles.row}>
          <Paragraph style={localStyles.details}>{item.value}</Paragraph>
          <Checkbox status={checked ? 'checked' : 'unchecked'} />
        </View>
      </TouchableOpacity>
    );
  },
);

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
  details: {
    margin: 10,
  },
  item: {
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    padding: 10,
  },
});
