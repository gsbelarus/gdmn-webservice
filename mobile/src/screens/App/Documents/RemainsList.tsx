import { Feather } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Searchbar, IconButton } from 'react-native-paper';

import { IGood } from '../../../../../common';
import { IRem, IRemain, IRemainData, IRemains } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const RemainItem = React.memo(({ item }: { item: IRem }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const docId = useRoute<RouteProp<DocumentStackParamList, 'RemainsList'>>().params?.docId;

  return (
    <TouchableOpacity
      style={[localStyles.item, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate('DocumentLineEdit', { prodId: item.id, docId, modeCor: false, price: item.price, remains: item.remains });
      }}
    >
      <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
        <Feather name="box" size={20} color={'#FFF'} />
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
        <View style={localStyles.flexDirectionRow}>
          <Text>Цена: {item.price}</Text>
          <Text>  Остаток: {item.remains}</Text>
        </View>
        <View style={localStyles.barcode}>
          {/* <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.alias}333333</Text> */}
          <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.barcode}</Text>
        </View>
      </View>

    </TouchableOpacity>
  );
});

const RemainsListScreen = () => {
  const route = useRoute<RouteProp<DocumentStackParamList, 'RemainsList'>>();
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [doScanned, setDoScanned] = useState(false);
  const [text, onChangeText] = useState('');
  const { state } = useAppStore();

  //const docId = useRoute<RouteProp<DocumentStackParamList, 'RemainsList'>>().params?.docId;
  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  const goods = useMemo(() => state.references?.goods?.data as IGood[], [state.references?.goods?.data]);

  const remains = useMemo(() => (state.references?.remains.data as IRemain[])?.find(rem => rem.contactId === document?.head?.fromcontactId).data as IRemainData[], [state.references?.remains?.data]);

  //список остатков + поля из справочника тмц
  const goodRemains = useMemo(() => remains.map(rem => ({...goods.find(good => good.id === rem.goodId), price: rem.price, remains: rem.q})), [goods, remains])

  const ref = React.useRef<FlatList<IRem>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IRem }) => <RemainItem item={item} />;

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    Alert.alert('Сохранить результат?', data, [
      {
        text: 'Да',
        onPress: () => {
          setDoScanned(false);
          onChangeText(data);
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
            data={goodRemains.filter(item =>
                item.barcode.toLowerCase().includes(text.toLowerCase()) ||
                item.name.toLowerCase().includes(text.toLowerCase()),
            )}
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
    paddingLeft: 8,
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
  barcode: {
    paddingRight: 0
  }
});
