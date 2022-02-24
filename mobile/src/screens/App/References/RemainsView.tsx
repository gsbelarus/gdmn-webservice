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
import { Text, Searchbar, Avatar } from 'react-native-paper';

import { IContact, IGood, IReference, IRemains, IRemGood } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { formatValue, getRemGoodListByContact } from '../../../helpers/utils';
import { useAppStore } from '../../../store';

const maxFiltered = 200;
interface IFilteredList {
  searchQuery: string;
  goodRemains: IRemGood[];
  displayList: IRemGood[];
};

const keyExtractor = (item: IRemGood) => String(item.good.id);

const RemainsViewScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();

  // начальная searchQuery должна совпадать с начальной searchQuery в filteredList
  const { item: contactItem }: { item: IReference } = route.params;
  const { state } = useAppStore();
  const remains = (state.references?.remains?.data as unknown) as IRemains[];
  const goods = state.references?.goods?.data as IGood[];
  const contacts = state.references?.contacts?.data as IContact[];
  const [goodRemains] = useState<IRemGood[]>( () => contactItem?.id
    ? getRemGoodListByContact(contacts, goods, remains, contactItem?.id)
    : []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    goodRemains,
    displayList: goodRemains, //.slice(0, maxFiltered)
  });

  const LineItem = useCallback(
    ({ item }: { item: IRemGood }) => {
      return (
        <TouchableOpacity
          style={localStyles.item}
          onPress={() => {
            navigation.navigate('ReferenceDetail', { item: { ...item.good, price: item.price, remains: item.remains }});
          }}
        >
          <View style={{ backgroundColor: colors.card }}>
            <Avatar.Icon size={38} icon="cube-outline" style={{ backgroundColor: colors.primary }} />
          </View>
          <View style={localStyles.details}>
            <Text style={[localStyles.name, { color: colors.text }]}>{item.good.name}</Text>
            <Text style={localStyles.itemInfo}>
              {item.remains} {item.good.value} - {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)} руб.
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [colors.card, colors.primary, colors.text, navigation],
  );

  const RC = useMemo( () => <RefreshControl refreshing={!goodRemains} title="загрузка данных..." />, [goodRemains]);

  const { vStyle, stStyle } = useMemo( () => ({
    vStyle: [localStyles.content, { backgroundColor: colors.card }],
    stStyle: [localStyles.title, { backgroundColor: colors.background }]
  }), [colors]);

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          goodRemains,
          displayList: goodRemains }); //.slice(0, maxFiltered) });
      } else {
        const lower = searchQuery.toLowerCase();

        const fn = isNaN(Number(lower))
          ? ({ good }: IRemGood) =>
            good.name?.toLowerCase().includes(lower)
          : ({ good }: IRemGood) =>
            good.barcode?.includes(searchQuery) ||
            good.name?.toLowerCase().includes(lower);

        let gr;

        if (
          filteredList.searchQuery
          &&
          searchQuery.length > filteredList.searchQuery.length
          &&
          searchQuery.startsWith(filteredList.searchQuery)
        ) {
          gr = filteredList.goodRemains.filter(fn);
        } else {
          gr = goodRemains.filter(fn);
        }

        setFilteredList({
          searchQuery,
          goodRemains: gr,
          displayList: gr, //.slice(0, maxFiltered)
        });
      }
    }
  }, [goodRemains, filteredList, searchQuery]);

  const ref = React.useRef<FlatList<IRemGood>>(null);

  useScrollToTop(ref);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={vStyle}>
        <SubTitle style={stStyle}>{contactItem?.name}</SubTitle>
        <ItemSeparator />
        <View style={localStyles.flexDirectionRow}>
          <Searchbar
            placeholder="Поиск"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={sbStyle}
          />
        </View>
        <ItemSeparator />
        <FlatList
          ref={ref}
          data={filteredList.displayList}
          refreshControl={RC}
          keyExtractor={keyExtractor}
          renderItem={LineItem}
          ItemSeparatorComponent={ItemSeparator}
          removeClippedSubviews={true} // Unmount components when outside of window
          initialNumToRender={6}
          maxToRenderPerBatch={6} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export { RemainsViewScreen };

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
  details: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 3,
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
    minHeight: 50,
  },
  itemInfo: {
    fontSize: 12,
    opacity: 0.5,
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

const sbStyle = [localStyles.flexGrow, localStyles.searchBar];
