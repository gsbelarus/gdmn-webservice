import { useScrollToTop, useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Searchbar, IconButton, Avatar } from 'react-native-paper';

import { IGood } from '../../../../../common';
import { IModelData, IModelRem, IModelRemGoods, IRem, IRemains } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import { formatValue } from '../../../helpers/utils';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';

interface IField extends IGood {
  remains?: number;
  price?: number;
}

const RemainsItem = React.memo(({ item }: { item: IField }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const docId = useRoute<RouteProp<DocumentStackParamList, 'RemainsList'>>().params?.docId;
  const barcode = !!item.barcode;

  return (
    <TouchableOpacity
      style={[localStyles.item, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate('DocumentLineEdit', {
          prodId: item.id,
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
        <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={localStyles.itemInfo}>
          цена: {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)}, остаток: {item.remains}
        </Text>
        {barcode && (
          <View style={localStyles.barcode}>
            <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>
              {item.barcode}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

type Props = StackScreenProps<DocumentStackParamList, 'DocumentView'>;

const RemainsListScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const [text, onChangeText] = useState('');
  const { state } = useAppStore();

  const [list, setList] = useState<IField[]>([]);

  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  // const goods = useMemo(() => state.references?.goods?.data as IGood[], [state.references?.goods?.data]);

  // const remains = useMemo(
  //   () =>
  //     ((state.references?.remains?.data as unknown) as IRemains[])?.find(
  //       (rem) => rem.contactId === document?.head?.fromcontactId,
  //     )?.data || [],
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [state.references?.remains?.data],
  // );

  // //список остатков + поля из справочника тмц
  // const goodRemains = useMemo(
  //   () =>
  //     remains?.map((item) => ({
  //       ...goods.find((good) => good.id === item.goodId),
  //       price: item.price,
  //       remains: item.q,
  //     })),
  //   [goods, remains],
  // );

  // const goodRemains: IField[] = useMemo(
  //   () => {
  //     const fields: IField[] = [];
  //     Object.values(
  //       (((state.models?.remains?.data as unknown) as IModelData)[document?.head?.fromcontactId] as IModelRemGoods)
  //         ?.goods,
  //     ).forEach((g: IModelRemGoods) =>
  //       g.remains.length > 0
  //         ? g.remains.forEach((r) => fields.push({ ...g, remains: r.q, price: r.price }))
  //         : fields.push({ ...g, remains: 0, price: 0 }),
  //     );
  //     return fields?.sort((a, b) => (a.name < b.name ? -1 : 1));
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [state.models?.remains?.data, document?.head?.fromcontactId],
  // );

  const goodRemains: IField[] = useMemo(
    () => {
      return Object.values(
        (((state.models?.remains?.data as unknown) as IModelData)[document?.head?.fromcontactId] as IModelRemGoods)
          ?.goods,
      )
        .reduce((r: IRem[], g: IModelRemGoods) => {
          if (g.remains.length > 0) {
            g.remains.forEach((rem) => r.push({ ...g, remains: rem.q, price: rem.price }));
          } else {
            r.push({ ...g, remains: 0, price: 0 });
          }
          return r;
        }, [])
        .sort((a: IField, b: IField) => (a.name < b.name ? -1 : 1));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.models?.remains?.data, document?.head?.fromcontactId],
  );

  useEffect(() => {
    setList(
      goodRemains?.filter(
        (item) =>
          item.barcode?.toLowerCase().includes(text.toLowerCase()) ||
          item.name?.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  }, [goodRemains, text]);

  const ref = React.useRef<FlatList<IField>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IField }) => <RemainsItem item={item} />;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="barcode-scan"
          size={24}
          onPress={() =>
            navigation.navigate(state.settings?.barcodeReader ? 'ScanBarcodeReader' : 'ScanBarcode', {
              docId: document.id,
            })
          }
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.id, navigation, state.settings?.barcodeReader]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <Searchbar
        placeholder="Штрих-код или название"
        onChangeText={onChangeText}
        value={text}
        style={localStyles.searchBar}
      />
      <ItemSeparator />
      <FlatList
        ref={ref}
        data={list}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
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
