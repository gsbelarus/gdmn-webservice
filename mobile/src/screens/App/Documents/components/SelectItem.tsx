import { useScrollToTop, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Searchbar, Checkbox, Paragraph } from 'react-native-paper';
import Reactotron from 'reactotron-react-native';

import { HeaderRight } from '../../../../components/HeaderRight';
import ItemSeparator from '../../../../components/ItemSeparator';
import SubTitle from '../../../../components/SubTitle';
// import { IField } from '../../../model';
import { IListItem } from '../../../../model/types';
import { DocumentStackParamList } from '../../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../../store';

type Props = StackScreenProps<DocumentStackParamList, 'SelectItem'>;

type ParentScreen = keyof Pick<DocumentStackParamList, 'DocumentEdit'>;

export const SelectItemScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  const { list, isMulti, formName, parentScreen, fieldName, title, value } = route.params;

  const { state, actions } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IListItem[]>(undefined);
  const [checkedItem, setCheckedItem] = useState<number[]>([]);

  // const [parentScreen, setParentScreen] = useState('');
  // const [title, setTitle] = useState('');
  // const [fieldName, setFieldName] = useState('');
  // const [isMultiSelect, setIsMultiSelect] = useState<boolean>(false);
  // const [list, setList] = useState<IListItem[]>(undefined);

  useEffect(() => {
    setCheckedItem(value);
  }, [searchQuery, value]);

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
      setCheckedItem((prev) => (isMulti ? [...prev, id] : [id]));
    },
    [isMulti],
  );

  const renderItem = useCallback(
    ({ item }: { item: IListItem }) => {
      return <LineItem item={item} checked={checkedItem?.includes(item.id)} onSelect={selectItem} />;
    },
    [checkedItem, selectItem],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            navigation.setOptions({ animationTypeForReplace: 'push' });
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            actions.setForm({
              name: formName,
              ...state.forms[formName],
              [fieldName]: isMulti ? checkedItem : checkedItem[0],
            });
            navigation.goBack();
            /*  parentScreen
              ? navigation.navigate(parentScreen as ParentScreen, {
                  docId: 0,
                  [fieldName]: isMultiSelect ? checkedItem : checkedItem[0],
                })
              : null; */
          }}
        />
      ),
    });
  }, [actions, checkedItem, fieldName, formName, isMulti, navigation, state.forms]);

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
