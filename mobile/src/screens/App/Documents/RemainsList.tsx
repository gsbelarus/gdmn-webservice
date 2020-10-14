import { Feather } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Searchbar, IconButton, Avatar } from 'react-native-paper';

import { IGood } from '../../../../../common';
import { IRemains } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import { formatValue } from '../../../helpers/utils';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

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
        <View style={localStyles.itemInfo}>
          <Text>
            Цена: {formatValue({ type: 'number', decimals: 2 }, item.price ?? 0)} Остаток: {item.remains}
          </Text>
        </View>
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

const RemainsListScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);
  const [text, onChangeText] = useState('');
  const { state } = useAppStore();

  const [list, setList] = useState<IField[]>([]);

  //const docId = useRoute<RouteProp<DocumentStackParamList, 'RemainsList'>>().params?.docId;
  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goods = useMemo(() => state.references?.goods?.data as IGood[], [state.references?.goods?.data]);

  const remains = useMemo(
    () =>
      ((state.references?.remains?.data as unknown) as IRemains[])?.find(
        (rem) => rem.contactId === document?.head?.fromcontactId,
      )?.data || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.references?.remains?.data],
  );

  //список остатков + поля из справочника тмц
  const goodRemains = useMemo(
    () =>
      remains?.map((item) => ({
        ...goods.find((good) => good.id === item.goodId),
        price: item.price,
        remains: item.q,
      })),
    [goods, remains],
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

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  const handleBarCodeScanned = (barcodeData: string) => {
    setScanned(true);
    Alert.alert('Сохранить результат?', barcodeData, [
      {
        text: 'Да',
        onPress: () => {
          setDoScanned(false);
          onChangeText(barcodeData);
          setScanned(false);
        },
      },
      {
        text: 'Нет',
        onPress: () => {
          // setDoScanned(false);
          // onChangeText(data);
          setScanned(false);
        },
      },
    ]);
  };

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      {hasPermission === null ? (
        <Text style={styles.title}>Запрос на получение доступа к камере</Text>
      ) : hasPermission === false ? (
        <Text style={styles.title}>Нет доступа к камере</Text>
      ) : undefined}
      {doScanned ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={({ data }) => (scanned ? undefined : handleBarCodeScanned(data))}
            style={StyleSheet.absoluteFillObject}
          />
          <Button
            onPress={() => {
              setScanned(false);
              setDoScanned(false);
            }}
          >
            Назад
          </Button>
        </>
      ) : (
        <>
          <View style={localStyles.flexDirectionRow}>
            <Searchbar
              placeholder="Штрих-код или название"
              onChangeText={onChangeText}
              value={text}
              style={[localStyles.flexGrow, localStyles.searchBar]}
            />
            <IconButton
              icon="barcode-scan"
              size={26}
              style={localStyles.iconSettings}
              onPress={() => setDoScanned(true)}
            />
          </View>
          <ItemSeparator />
          <FlatList
            ref={ref}
            data={list}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
          />
        </>
      )}
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
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
  },
  iconSettings: {
    width: 36,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
    marginVertical: 2,
    paddingLeft: 4,
  },
  itemInfo: {
    opacity: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    // alignSelf: 'flex-end',
    fontSize: 12,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
});
