import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Searchbar, FAB, Colors, IconButton } from 'react-native-paper';
import Reactotron from 'reactotron-react-native';

import { IResponse, IMessageInfo } from '../../../../../common';
import { IContact, IDocumentType } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import { statusColors, statuses } from '../../../constants';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { timeout } from '../../../helpers/utils';
import { ISellDocument, ISellHead } from '../../../model';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';

const Statuses: IDocumentType[] = statuses;

interface IDocInfo {
  id: number;
  docDate: string;
  docNumber: string;
  fromContact: IContact;
  toContact: IContact;
  expeditor: IContact;
  status: IDocumentType;
}

const DocumentItem = React.memo(
  ({ item: { id, docDate, docNumber, expeditor, fromContact, status, toContact } }: { item: IDocInfo }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ViewSellDocument', { docId: id });
        }}
      >
        <View style={[localStyles.item, { backgroundColor: colors.card }]}>
          <View style={[localStyles.avatar, { backgroundColor: statusColors[status.id] }]}>
            <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
          </View>
          <View style={localStyles.details}>
            <View style={localStyles.directionRow}>
              <Text style={[localStyles.name, { color: colors.text }]}>
                {`№ ${docNumber} от ${docDate.split('-').reverse().join('.')}`}
              </Text>
              <Text style={[localStyles.number, localStyles.field, { color: statusColors[status.id] }]}>
                {status?.name || ''}
              </Text>
            </View>
            <Text style={[localStyles.name, { color: colors.text }]}>{toContact?.name || ''}</Text>
            <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
              Подразделение: {fromContact?.name || ''}
            </Text>
            <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
              Экспедитор: {expeditor?.name || ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const SellDocumentsListScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const ref = React.useRef<FlatList<IDocInfo>>(null);
  useScrollToTop(ref);

  const {
    apiService,
    state: { isLoading, serverUrl },
  } = useServiceStore();

  const { state } = useAuthStore();
  const { state: appState, actions } = useAppStore();

  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<IDocInfo[] | undefined>(undefined);

  const showActionSheet = useActionSheet();

  const docList: IDocInfo[] | undefined = useMemo(() => {
    if (!appState.contacts) {
      return;
    }

    return (appState.documents as ISellDocument[])?.map((item) => {
      const docHead = item.head as ISellHead;

      const fromContact = appState.contacts?.find((contact) => contact.id === docHead?.fromcontactId);

      const toContact = appState.contacts?.find((contact) => contact.id === docHead?.tocontactId);

      const expeditor = appState.contacts?.find((contact) => contact.id === docHead?.expeditorId);

      const status = Statuses.find((type) => type.id === docHead.status);

      const docDate = new Date(docHead.date).toISOString().slice(0, 10);

      return { id: item.id, docDate, docNumber: item.head.docnumber, fromContact, toContact, expeditor, status };
    });
  }, [appState.contacts, appState.documents]);

  useEffect(() => {
    const docs = docList?.filter(
      (value) =>
        value.docDate.toUpperCase().includes(searchText.toUpperCase()) ||
        value.docNumber.toUpperCase().includes(searchText.toUpperCase()) ||
        value.expeditor?.name.toUpperCase().includes(searchText.toUpperCase()) ||
        value.fromContact?.name.toUpperCase().includes(searchText.toUpperCase()) ||
        value.toContact?.name.toUpperCase().includes(searchText.toUpperCase()),
    );
    setData(docs);
  }, [docList, searchText]);

  const renderItem = ({ item }: { item: IDocInfo }) => <DocumentItem item={item} />;

  const sendUpdateRequest = useCallback(async () => {
    const documents = appState.documents.filter((document) => document.head.status === 1);

    timeout(
      serverUrl?.timeout,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'data',
        payload: {
          name: 'SellDocument',
          params: documents,
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Документы отправлены!', '', [
            {
              text: 'Закрыть',
              onPress: () => {
                documents.forEach((item) => {
                  actions.editStatusDocument({ id: item.id, status: item.head.status + 1 });
                });
              },
            },
          ]);
        } else {
          Alert.alert('Документы не были отправлены', '', [{ text: 'Закрыть' }]);
        }
      })
      .catch((err: Error) => Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]));
  }, [actions, apiService.data, appState.documents, serverUrl?.timeout, state.companyID]);

  const updateStatus = useCallback(() => {
    const documents = appState.documents.filter((document) => document.head.status === 0);
    documents.forEach((document) => actions.editStatusDocument({ id: document.id, status: 1 }));
  }, [actions, appState.documents]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="menu"
          size={28}
          onPress={() =>
            showActionSheet([
              {
                title: 'Создать документ',
                onPress: () => {
                  navigation.navigate('CreateSellDocument');
                },
              },
              {
                title: 'Загрузить документы',
                onPress: () => navigation.navigate('SettingsGettingDocument'),
              },
              {
                title: 'Выгрузить документы',
                onPress: sendUpdateRequest,
              },
              {
                title: 'Черновики в готово',
                onPress: updateStatus,
              },
              {
                title: 'Удалить документы',
                type: 'destructive',
                onPress: actions.deleteAllDocuments,
              },
              {
                title: 'Отмена',
                type: 'cancel',
              },
            ])
          }
        />
      ),
    });
  }, [actions.deleteAllDocuments, navigation, sendUpdateRequest, showActionSheet, updateStatus]);

  return (
    <View style={[localStyles.flex1, { backgroundColor: colors.card }]}>
      {!isLoading && (
        <>
          <>
            <View style={localStyles.flexDirectionRow}>
              <Searchbar
                placeholder="Поиск по номеру"
                onChangeText={setSearchText}
                value={searchText}
                style={[localStyles.flexGrow, localStyles.searchBar]}
              />
            </View>
            <ItemSeparator />
          </>
          <FlatList
            ref={ref}
            data={data}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            scrollEventThrottle={400}
            ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
          />
          <FAB
            style={[localStyles.fabSync, { backgroundColor: colors.primary }]}
            icon="arrow-down-bold"
            onPress={() => navigation.navigate('SettingsGettingDocument')}
          />
          <FAB
            style={[localStyles.fabImport, { backgroundColor: colors.primary }]}
            icon="arrow-up-bold"
            onPress={sendUpdateRequest}
          />
          <FAB
            style={[localStyles.fabAdd, { backgroundColor: colors.primary }]}
            icon="file-plus"
            onPress={() => navigation.navigate('CreateSellDocument')}
          />
        </>
      )}
    </View>
  );
};

export { SellDocumentsListScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  details: {
    margin: 8,
    marginRight: 0,
    flex: 1,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fabAdd: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  fabImport: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 160,
  },
  fabSync: {
    backgroundColor: Colors.blue600,
    bottom: 0,
    left: 0,
    margin: 20,
    position: 'absolute',
    // right: 80,
  },
  field: {
    opacity: 0.5,
  },
  flex1: {
    flex: 1,
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
    padding: 8,
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
