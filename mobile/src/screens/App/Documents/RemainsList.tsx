import { useScrollToTop, useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Searchbar, IconButton, Avatar } from 'react-native-paper';

import { IGood } from '../../../../../common';
import { IContact, IRemGood, IRemains } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import { formatValue, getRemGoodListByContact } from '../../../helpers/utils';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';

interface IFilteredList {
  searchQuery: string;
  goodRemains: IRemGood[];
  // displayList: IRemGood[];
};

const keyExtractor = (item: IRemGood) => String(item.good.id);

type Props = StackScreenProps<RootStackParamList, 'DocumentView'>;

const RemainsListScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state } = useAppStore();

  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  const remains = (state.references?.remains?.data as unknown) as IRemains[];
  const goods = state.references?.goods?.data as IGood[];
  const contacts = state.references?.contacts?.data as IContact[];
  const [goodRemains] = useState<IRemGood[]>( () => document?.head?.fromcontactId
    ? getRemGoodListByContact(contacts, goods, remains, document?.head?.fromcontactId)
    : []
  );

  const RC = useMemo( () => <RefreshControl refreshing={!goodRemains} title="загрузка данных..." />, [goodRemains]);
  const EC = useMemo( () => <Text style={localStyles.emptyList}>Список пуст</Text>, [] );

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState<IFilteredList>({
    searchQuery: '',
    goodRemains,
    // displayList: goodRemains, //.slice(0, maxFiltered)
  });

  useEffect(() => {
    if (searchQuery !== filteredList.searchQuery) {
      if (!searchQuery) {
        setFilteredList({
          searchQuery,
          goodRemains,
          // displayList: goodRemains.slice(0, maxFiltered)
          });
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
          // displayList: gr.slice(0, maxFiltered)
        });
      }
    }
  }, [goodRemains, filteredList, searchQuery]);

  const RemainsItem = useCallback(({ item }: { item: any }) => {
    const barcode = !!item.good.barcode;

    return (
      <TouchableOpacity
        style={[localStyles.item, { backgroundColor: colors.card }]}
        onPress={() => {
          navigation.navigate('DocumentLineEdit', {
            prodId: item.good.id,
            docId,
            price: item.price,
            remains: item.remains,
          });
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
          {barcode && (
            <View style={localStyles.barcode}>
              <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>
                {item.good.barcode}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [colors.card, colors.primary, colors.text, navigation],);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="barcode-scan"
          size={24}
          onPress={() =>
            navigation.navigate(state.settings?.barcodeReader ? 'ScanBarcodeReader' : 'ScanBarcode', {
              docId: document?.id || -1,
            })
          }
        />
      ),
    });
  }, [document?.id, navigation, state.settings?.barcodeReader]);

  const ref = React.useRef<FlatList<IRemGood>>(null);
  useScrollToTop(ref);
  console.log(123443);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <Searchbar
        placeholder="Штрих-код или название"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={localStyles.searchBar}
      />
      <ItemSeparator />
      <FlatList
        ref={ref}
        data={filteredList.goodRemains}
        keyExtractor={keyExtractor}
        renderItem={RemainsItem}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={RC}
        ListEmptyComponent={EC}
        removeClippedSubviews={true} // Unmount compsonents when outside of window
        initialNumToRender={6}
        maxToRenderPerBatch={6} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
    </View>
  );
};

export { RemainsListScreen };

const localStyles = StyleSheet.create({
  barcode: {
    alignItems: 'flex-end',
  },
  content: {
    height: '100%',
  },
  details: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 3,
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fieldDesciption: {
    opacity: 0.5,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
    marginVertical: 2,
    paddingLeft: 4,
  },
  itemInfo: {
    fontSize: 12,
    opacity: 0.4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
});
