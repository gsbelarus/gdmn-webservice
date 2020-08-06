import { useScrollToTop, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Searchbar, IconButton, Checkbox, Paragraph } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { IField } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';

/* interface IField {
  id: number;
  value: string;
}
 */
export interface ISelectItemRef {
  cancel(): void;
}

interface ISelectList {
  name: string;
  type: string;
  data: IField[];
}

export type Props = StackScreenProps<RootStackParamList, 'SelectItemScreen'>;

const SelectItemScreen = forwardRef<ISelectItemRef, Props>(({ route, navigation }, ref) => {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<ISelectList>(undefined);
  const [checkedItem, setCheckedItem] = useState<null | number>(null);

  useEffect(() => {
    // console.log('params', route.params);
    if (!route.params?.list) {
      return;
    }

    const { list, selected } = route.params;

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

  const renderItem = useCallback(
    ({ item }: { item: IField }) => {
      return <LineItem item={item} checked={item.id === checkedItem} onSelect={setCheckedItem} />;
    },
    [checkedItem],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="check-circle"
          size={30}
          onPress={() =>
            navigation.navigate('SettingsGettingDocument', {
              item: { fieldName: filteredList?.type, id: checkedItem },
            })
          }
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
});

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

export { SelectItemScreen };

const localStyles = StyleSheet.create({
  /*   avatar: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  }, */
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
