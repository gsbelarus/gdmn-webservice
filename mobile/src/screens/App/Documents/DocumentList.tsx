/* eslint-disable react-hooks/exhaustive-deps */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Searchbar, FAB, IconButton } from 'react-native-paper';

import { IDocumentStatus, IResponse, IMessageInfo, IDocument, IContact, IMessage } from '../../../../../common';
import { IOutlet } from '../../../../../common/base';
import ItemSeparator from '../../../components/ItemSeparator';
import { statusColors } from '../../../constants';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { isMessagesArray, timeout } from '../../../helpers/utils';
import statuses from '../../../model/docStates';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';
// import { statusColors}

interface IUpdateDocumentResponse {
  id: string;
  status: 'ok' | 'fail';
  error?: string;
}

const Statuses: IDocumentStatus[] = statuses;

const DocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  // const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];
  const navigation = useNavigation();
  const { state } = useAppStore();

  const contacts = useMemo(() => state.references?.contacts?.data as IContact[], [state.references?.contacts?.data]);

  const getContact = useCallback(
    (id: number | number[]): IContact =>
      contacts?.find((contact) => (Array.isArray(id) ? id.includes(contact.id) : contact.id === id)),
    [contacts],
  );

  const outlets = useMemo(() => state.references?.outlets?.data as IOutlet[], [state.references?.outlets?.data]);

  const getOutlet = useCallback(
    (id: number | number[]): IContact =>
      outlets?.find((outlet) => (Array.isArray(id) ? id.includes(outlet.id) : outlet.id === id)),
    [contacts],
  );

  const docHead = useMemo(() => item?.head, [item?.head]);
  const fromContact = useMemo(() => getContact(docHead?.contactId), [docHead?.contactId, getContact]);
  const toContact = useMemo(() => getOutlet(docHead?.outletId), [docHead?.outletId, getOutlet]);

  const docDate = useMemo(() => new Date(item?.head?.date).toLocaleDateString('ru-RU'), [item?.head?.date]);
  const docOnDate = useMemo(() => new Date(item?.head?.ondate).toLocaleDateString('ru-RU'), [item?.head?.ondate]);

  const status = useMemo(() => Statuses.find((type) => type.id === item?.head?.status), [item?.head?.status]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DocumentView', { docId: item?.id });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: statusColors[item?.head?.status || 0] }]}>
          <MaterialCommunityIcons name="file-document-box" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <View style={localStyles.directionRow}>
            <Text style={[localStyles.number, localStyles.field, localStyles.field, { color: colors.text }]}>
              Дата: {docDate}
            </Text>
            <Text style={[localStyles.number, localStyles.field, { color: statusColors[item?.head?.status] }]}>
              {status ? status.name : ''}
            </Text>
          </View>
          <View style={localStyles.flexDirectionRow}>
            <Text style={[localStyles.number, localStyles.nameNotBold, localStyles.field, { color: colors.text }]}>
              Дата отгрузки:  
            </Text>
            <Text style={[localStyles.number, localStyles.name, localStyles.field, { color: colors.text }]}>
             {' ' + docOnDate}
            </Text>
          </View>
          <Text style={[localStyles.name, localStyles.field, { color: colors.text }]}>
            Организация: {fromContact?.name || ''}
          </Text>
          <Text style={[localStyles.name, localStyles.field, { color: colors.text }]}>
            Магазин: {toContact?.name || ''}
          </Text>
          {item?.head?.status === 4 ? (
            <Text style={[localStyles.number, localStyles.field, { color: statusColors[item?.head?.status || 0] }]}>
              Причина: {item?.head?.error || 'не известна'}
            </Text>
          ) : undefined}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const DocumentListScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const ref = React.useRef<FlatList<IDocument>>(null);
  useScrollToTop(ref);

  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions } = useAppStore();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState(appState.documents as IDocument[]);
  // const [isBottom, setIsBottom] = useState(false);

  const showActionSheet = useActionSheet();

  const contacts = useMemo(() => appState.references?.contacts?.data as IContact[], [
    appState.references?.contacts?.data,
  ]);

  const getContact = useCallback(
    (id: number | number[]): IContact =>
      contacts?.find((contact) => (Array.isArray(id) ? id.includes(contact.id) : contact.id === id)),
    [contacts],
  );

  useEffect(() => {
    setData(
      appState.documents?.filter((item) => {
        const docHead = item?.head;

        const fromContact = getContact(docHead?.contactId);

        const toContact = getContact(docHead?.outletId);

        const status = Statuses.find((type) => type.id === item?.head?.status);

        return appState.forms?.filterParams?.fieldSearch
          ? (appState.forms?.filterParams?.fieldSearch as string[]).some((value: string) =>
              value === 'contactId' && toContact
                ? toContact.name.includes(searchText)
                : value === 'state' && status
                ? status.name.includes(searchText)
                : value === 'number'
                ? item?.head.docnumber?.includes(searchText)
                : value === 'outletId' && fromContact
                ? fromContact.name.includes(searchText)
                : true,
            )
          : true;
      }) || [],
    );
  }, [appState.documents, appState.forms?.filterParams?.fieldSearch, searchText, getContact]);

  const renderItem = ({ item }: { item: IDocument }) => <DocumentItem item={item} />;

  const sendUpdateRequest = useCallback(async () => {
    const documents = appState.documents?.filter((document) => document?.head?.status === 1);

    if (documents.length > 0) {
      timeout(
        apiService.baseUrl.timeout,
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
            Alert.alert('заявки отправлены!', '', [
              {
                text: 'Закрыть',
                onPress: () => {
                  documents?.forEach((item) => {
                    actions.updateDocumentStatus({ id: item?.id, status: item?.head?.status + 1 });
                  });
                },
              },
            ]);
          } else {
            Alert.alert('заявки не были отправлены', '', [{ text: 'Закрыть' }]);
          }
        })
        .catch((err: Error) => Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]));
    }
  }, [actions, apiService.baseUrl.timeout, apiService.data, appState.documents, state.companyID]);

  const deleteTrades = useCallback(async () => {
    if (appState.documents) {
      const deleteDocs = appState.documents.filter((document) => document?.head?.status === 3);
      if (deleteDocs.length > 0) {
        deleteDocs.forEach((document) => {
          actions.deleteDocument(document.id);
        });
      }
    }
  }, [actions, appState.documents]);

  const checkUpdateRequest = useCallback(async () => {
    const response = await timeout<IResponse<IMessage[]>>(
      apiService.baseUrl.timeout,
      apiService.data.getMessages(state.companyID),
    );

    if (!response.result) {
      Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть', onPress: () => ({}) }]);
      return;
    }

    if (!isMessagesArray(response.data)) {
      Alert.alert('Получены неверные данные.', 'Попробуйте ещё раз.', [{ text: 'Закрыть' }]);
      return;
    }
    response.data?.forEach((message) => {
      if (message.body.type === 'update_data') {
        (message.body.payload.params as IUpdateDocumentResponse[]).forEach((result) => {
          if ((appState.documents as IDocument[])?.find((doc) => doc.id === Number(result.id))?.head.status === 2) {
            actions.updateDocumentStatus({
              id: Number(result.id),
              status: result.status === 'ok' ? 3 : 4,
              error: result.error,
            });
          }
        });
      }
      apiService.data.deleteMessage(state.companyID, message.head.id);
    });
  }, [actions, state.companyID, apiService.data, appState.documents, apiService.baseUrl.timeout]);

  React.useLayoutEffect(() => {
    navigation.dangerouslyGetParent()?.setOptions({
      headerLeft: () => <IconButton icon="file-send" size={26} onPress={sendUpdateRequest} />,
      headerRight: () => (
        <IconButton
          icon="menu"
          size={28}
          onPress={() =>
            showActionSheet([
              /*{
                title: 'Загрузить',
                onPress: () => navigation.navigate('DocumentRequest'),
              },*/
              {
                title: 'Создать заявка',
                onPress: () => {
                  navigation.navigate('DocumentEdit');
                },
              },
              {
                title: 'Выгрузить заявки',
                onPress: sendUpdateRequest,
              },
              {
                title: 'Проверить статус заявок',
                onPress: checkUpdateRequest,
              },
              {
                title: 'Удалить заявки',
                type: 'destructive',
                onPress: actions.deleteAllDocuments,
              },
              {
                title: 'Удалить заявки (для обработанных)',
                type: 'destructive',
                onPress: deleteTrades,
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
  }, [actions.deleteAllDocuments, navigation, sendUpdateRequest, showActionSheet]);
  /*
  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 60;
    console.log(layoutMeasurement.height, contentSize.height);
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom &&
      layoutMeasurement.height - paddingToBottom < contentSize.height
    );
  }; */

  return (
    <View style={[localStyles.flex1, { backgroundColor: colors.card }]}>
      <View style={localStyles.flexDirectionRow}>
        <Searchbar
          placeholder="Поиск"
          onChangeText={setSearchText}
          value={searchText}
          style={[localStyles.flexGrow, localStyles.searchBar]}
        />
        <IconButton
          icon="settings"
          size={24}
          style={localStyles.iconSettings}
          onPress={() => navigation.navigate('FilterEdit')}
        />
      </View>
      <ItemSeparator />
      <FlatList
        ref={ref}
        data={
          route.params?.status !== undefined
            ? data?.filter((item) => item.head?.status === route.params.status)
            : data?.filter((item) => item.head?.status !== 5)
        }
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        /*         onScroll={({ nativeEvent }) => {
          setIsBottom(isCloseToBottom(nativeEvent));
        }} */
        scrollEventThrottle={400}
        ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
      />
      {/*  <FAB
        style={[localStyles.fabSync, { backgroundColor: colors.primary }]}
        icon="arrow-down-bold"
        onPress={() => navigation.navigate('DocumentRequest')}
      />
      <FAB
        style={[localStyles.fabSync, { backgroundColor: colors.primary }]}
        icon="arrow-up-bold"
        onPress={sendUpdateRequest}
      />
       */}
      {route.params?.status === undefined ? (
        <FAB
          style={[localStyles.fabAdd, { backgroundColor: colors.primary }]}
          icon="file-document-box-plus"
          onPress={() => navigation.navigate('DocumentEdit')}
        />
      ) : undefined}
    </View>
  );
};

export { DocumentListScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  /*   company: {
    fontSize: 12,
    fontWeight: 'bold',
  }, */
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
  /*
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
  }, */
  field: {
    opacity: 0.7,
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
  nameNotBold: {
    fontSize: 14,
  },
  number: {
    fontSize: 12,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
});
