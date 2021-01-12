import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Searchbar, FAB, Colors, IconButton } from 'react-native-paper';

import { IResponse, IMessageInfo } from '../../../../../common';
import { IDocumentType } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { timeout } from '../../../helpers/utils';
import statuses from '../../../mockData/Otves/documentStatuses.json';
import { ISellDocument, ISellHead } from '../../../model';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';

const Statuses: IDocumentType[] = statuses;

const DocumentItem = React.memo(({ item }: { item: ISellDocument }) => {
  const { colors } = useTheme();
  const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];
  const navigation = useNavigation();
  const { state } = useAppStore();

  const docHead = item.head as ISellHead;

  const fromContact = state.contacts
    ? state.contacts.find((contact) => contact.id === docHead?.fromcontactId)
    : undefined;

  const toContact = state.contacts ? state.contacts.find((contact) => contact.id === docHead?.tocontactId) : undefined;

  const expeditor = state.contacts ? state.contacts.find((contact) => contact.id === docHead?.expeditorId) : undefined;

  const docDate = new Date(item.head?.date).toLocaleDateString();

  const status = Statuses.find((type) => type.id === item.head.status);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ViewSellDocument', { docId: item.id });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: statusColors[item.head.status] }]}>
          <MaterialCommunityIcons name="file-document-box" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <View style={localStyles.directionRow}>
            <Text style={[localStyles.name, { color: colors.text }]}>{`№ ${docHead.docnumber} от ${docDate}`}</Text>
            <Text style={[localStyles.number, localStyles.field, { color: statusColors[item.head.status] }]}>
              {status ? status.name : ''}
            </Text>
          </View>
          <Text style={[localStyles.name, { color: colors.text }]}>{toContact ? toContact.name : ''}</Text>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            Подразделение: {fromContact ? fromContact.name : ''}
          </Text>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            Экспедитор: {expeditor ? expeditor.name : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const SellDocumentsListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const ref = React.useRef<FlatList<ISellDocument>>(null);
  useScrollToTop(ref);

  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions } = useAppStore();

  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState(appState.documents as ISellDocument[]);

  const showActionSheet = useActionSheet();

  useEffect(() => {
    setData(
      appState.documents
        ? (appState.documents as ISellDocument[]).filter((item) => {
            const docHead = item.head as ISellHead;

            const fromContact = appState.contacts
              ? appState.contacts.find((contact) => contact.id === docHead?.fromcontactId)
              : undefined;

            const toContact = appState.contacts
              ? appState.contacts.find((contact) => contact.id === docHead?.tocontactId)
              : undefined;

            const expeditor = appState.contacts
              ? appState.contacts.find((contact) => contact.id === docHead?.expeditorId)
              : undefined;

            const status = Statuses.find((type) => type.id === item.head.status);

            return appState.settingsSearch
              ? appState.settingsSearch.some((value) =>
                  value === 'number'
                    ? item.head.docnumber.toUpperCase().includes(searchText.toUpperCase())
                    : value === 'state' && status
                    ? status.name.toUpperCase().includes(searchText.toUpperCase())
                    : value === 'toContact' && toContact
                    ? toContact.name.toUpperCase().includes(searchText.toUpperCase())
                    : value === 'fromContact' && fromContact
                    ? fromContact.name.toUpperCase().includes(searchText.toUpperCase())
                    : value === 'expeditor' && expeditor
                    ? expeditor.name.toUpperCase().includes(searchText.toUpperCase())
                    : true,
                )
              : true;
          })
        : [],
    );
  }, [appState.contacts, appState.documents, appState.settingsSearch, searchText]);

  const renderItem = ({ item }: { item: ISellDocument }) => <DocumentItem item={item} />;

  const sendUpdateRequest = useCallback(async () => {
    const documents = appState.documents.filter((document) => document.head.status === 1);

    timeout(
      5000,
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
  }, [actions, apiService.data, appState.documents, state.companyID]);

  const updateStatus = useCallback(() => {
    const documents = appState.documents.filter((document) => document.head.status === 0);
    documents.forEach((document) => actions.editStatusDocument({ id: document.id, status: 1 }));
  }, [actions, appState.documents]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="menu"
          size={24}
          onPress={() =>
            showActionSheet([
              {
                title: 'Загрузить',
                onPress: () => navigation.navigate('SettingsGettingDocument'),
              },
              {
                title: 'Выгрузить',
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
      <View style={localStyles.flexDirectionRow}>
        <Searchbar
          placeholder="Поиск по организации"
          onChangeText={setSearchText}
          value={searchText}
          style={[localStyles.flexGrow, localStyles.searchBar]}
        />
        <IconButton
          icon="settings"
          size={24}
          style={localStyles.iconSettings}
          onPress={() => navigation.navigate('SettingsSearchScreen')}
        />
      </View>
      <ItemSeparator />
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        /*  refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => navigation.navigate('SettingsGettingDocument')} />
        } */
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
        icon="plus"
        onPress={() => navigation.navigate('CreateSellDocument')}
      />
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
  iconSettings: {
    width: 36,
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
