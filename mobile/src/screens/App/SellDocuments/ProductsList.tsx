import { Feather } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';

import { IGood } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { IWeighedGoods } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';

const GoodItem = React.memo(({ item }: { item: IGood }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const docId = useRoute<RouteProp<RootStackParamList, 'SellProductsList'>>().params?.docId;

  return (
    <TouchableOpacity
      style={[localStyles.item, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate('SellProductDetail', { prodId: item.id, docId, modeCor: false });
      }}
    >
      <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
        <Feather name="box" size={20} color={'#FFF'} />
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.alias}</Text>
        <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.barcode}</Text>
      </View>
    </TouchableOpacity>
  );
});

const WeighedGoodItem = React.memo(({ item }: { item: IWeighedGoods }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state } = useAppStore();
  const [nameGood, setNameGood] = useState('');

  useEffect(() => {
    const findGood = state.goods.find((good) => good.id === item.goodkey);
    findGood ? setNameGood(findGood.name) : undefined;
  }, [item, state]);

  const docId = useRoute<RouteProp<RootStackParamList, 'SellProductsList'>>().params?.docId;

  return (
    <TouchableOpacity
      style={[localStyles.item, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate('SellProductDetail', { prodId: item.goodkey, docId, modeCor: false, weighedGood: item.id });
      }}
    >
      <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
        <Feather name="box" size={20} color={'#FFF'} />
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>{nameGood}</Text>
        <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.id}</Text>
      </View>
    </TouchableOpacity>
  );
});

const SellProductsListScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SellProductsList'>>();
  const { colors } = useTheme();
  const [text, onChangeText] = useState('');
  const { state } = useAppStore();

  const ref = React.useRef<FlatList<IGood>>(null);
  const refWeighed = React.useRef<FlatList<IWeighedGoods>>(null);
  useScrollToTop(ref);
  useScrollToTop(refWeighed);

  const renderItem = ({ item }: { item: IGood }) => <GoodItem item={item} />;
  const renderItemWieghed = ({ item }: { item: IWeighedGoods }) => <WeighedGoodItem item={item} />;

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <>
        <Searchbar
          placeholder={`Штрих-код ${route.params.weighedGood ? '' : 'или название'}`}
          onChangeText={onChangeText}
          value={text}
          style={localStyles.searchBar}
        />
        <ItemSeparator />
        {route.params.weighedGood ? (
          <FlatList
            ref={refWeighed}
            data={
              !Number.isNaN(text)
                ? state.weighedGoods.filter((item) =>
                    text.length >= 12
                      ? item.id.toString().includes(Number(text).toString().slice(0, -1)) ||
                        item.id.toString().includes(Number(text).toString())
                      : item.id.toString().includes(Number(text).toString()),
                  )
                : state.weighedGoods
            }
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItemWieghed}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
          />
        ) : (
          <FlatList
            ref={ref}
            data={state.goods.filter(
              (item) =>
                item.barcode.toLowerCase().includes(text.toLowerCase()) ||
                item.name.toLowerCase().includes(text.toLowerCase()),
            )}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
          />
        )}
      </>
    </View>
  );
};

export { SellProductsListScreen };

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
    paddingLeft: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    alignSelf: 'flex-end',
    fontSize: 12,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
});
