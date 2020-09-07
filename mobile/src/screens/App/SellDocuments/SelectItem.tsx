import { useScrollToTop, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Searchbar, Checkbox, Paragraph } from 'react-native-paper';

import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
// import { IField } from '../../../model';
import { IListItem } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
// import { useAppStore } from '../../../store';

type Props = StackScreenProps<RootStackParamList, 'SelectItemScreen'>;

export const SelectItemScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  // const { state: appState, actions: appActions } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IListItem[]>(undefined);
  const [checkedItem, setCheckedItem] = useState<number[]>([]);

  const [parentScreen, setParentScreen] = useState('');
  const [title, setTitle] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [isMultiSelect, setIsMultiSelect] = useState<boolean>(false);
  const [list, setList] = useState<IListItem[]>(undefined);

  useEffect(() => {
    if (!route.params?.list) {
      return;
    }

    const {
      list: newList,
      isMulti,
      parentScreen: newParentScreen,
      fieldName: newFieldName,
      title: newTitle,
      value: newValue,
    } = route.params;

    setTitle(newTitle);
    setFieldName(newFieldName);
    setParentScreen(newParentScreen);
    setIsMultiSelect(isMulti || false);
    setList(newList);
    setCheckedItem(newValue);
  }, [route.params, route.params?.list, searchQuery]);

  useEffect(() => {
    if (!list) {
      return;
    }
    setFilteredList(list.filter((i) => i.value.toUpperCase().includes(searchQuery.toUpperCase())));
  }, [list, searchQuery]);

  const refList = React.useRef<FlatList<IListItem>>(null);
  useScrollToTop(refList);

  const selectItem = useCallback(
    (id: number) => {
      setCheckedItem((prev) => (isMultiSelect ? [...prev, id] : [id]));
    },
    [isMultiSelect],
  );

  const renderItem = useCallback(
    ({ item }: { item: IListItem }) => {
      return <LineItem item={item} checked={checkedItem?.includes(item.id)} onSelect={selectItem} />;
    },
    [checkedItem, selectItem],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderRight text="Отмена" onPress={() => navigation.goBack()} />,
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            parentScreen
              ? navigation.navigate(parentScreen as keyof RootStackParamList, { [fieldName]: checkedItem })
              : null;
          }}
        />
      ),
    });
  }, [checkedItem, colors.primary, fieldName, navigation, parentScreen]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{title}</SubTitle>
      <ItemSeparator />
      <Searchbar placeholder="Поиск" onChangeText={setSearchQuery} value={searchQuery} style={localStyles.searchBar} />
      <ItemSeparator />
      <FlatList
        ref={refList}
        data={filteredList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

const LineItem = React.memo(
  ({ item, checked, onSelect }: { item: IListItem; checked: boolean; onSelect: (id: number) => void }) => {
    const { colors } = useTheme();

    return (
      <TouchableOpacity onPress={() => onSelect(item.id)}>
        <View style={localStyles.row}>
          <Paragraph style={localStyles.details}>{item.value}</Paragraph>
          <Checkbox color={colors.primary} status={checked ? 'checked' : 'unchecked'} />
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
    flex: 9,
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
