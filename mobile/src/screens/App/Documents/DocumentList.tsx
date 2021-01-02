import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Searchbar, FAB, IconButton } from 'react-native-paper';

import { IDocumentStatus, IResponse, IMessageInfo, IDocument, IContact } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { statusColors } from '../../../constants';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { timeout } from '../../../helpers/utils';
import statuses from '../../../model/docStates';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';

const Statuses: IDocumentStatus[] = statuses;

const DocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state } = useAppStore();

  const contacts = useMemo(() => state.references?.contacts?.data as IContact[], [state.references?.contacts?.data]);

  const getContact = useCallback(
    (id: number | number[]): IContact =>
      contacts?.find((contact) => (Array.isArray(id) ? id.includes(contact.id) : contact.id === id)),
    [contacts],
  );

  const docHead = useMemo(() => item?.head, [item?.head]);
  const fromContact = useMemo(() => getContact(docHead?.fromcontactId), [docHead.fromcontactId, getContact]);

  const docDate = useMemo(() => new Date(item?.head?.date).toLocaleDateString('BY-ru'), [item?.head?.date]);

  const status = useMemo(() => Statuses.find((type) => type.id === item?.head?.status), [item?.head?.status]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DocumentView', { docId: item?.id });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: statusColors[item?.head?.status || 0] }]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <View style={localStyles.directionRow}>
            <Text style={[localStyles.name, { color: colors.text }]}>{`№ ${docHead?.docnumber} от ${docDate}`}</Text>
            <Text style={[localStyles.number, localStyles.field, { color: statusColors[item?.head?.status] }]}>
              {status ? status.name : ''}
            </Text>
          </View>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>{fromContact?.name || ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const DocumentListScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const ref = React.useRef<FlatList<IDocument>>(null);
  useScrollToTop(ref);

  const {
    apiService,
    state: { isLoading },
  } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions: appActions } = useAppStore();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState(appState.documents as IDocument[]);

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

        return docHead?.docnumber?.includes(searchText);
        // const fromContact = getContact(docHead?.fromcontactId);

        // const toContact = getContact(docHead?.tocontactId);

        // const status = Statuses.find((type) => type.id === item?.head?.status);

        // console.log('Вызов окна DocumentLst');

        // return appState.forms?.filterParams?.fieldSearch
        //   ? (appState.forms?.filterParams?.fieldSearch as string[]).some((value: string) =>
        //       value === 'number'
        //         ? item?.head.docnumber?.includes(searchText)
        //         : value === 'state' && status
        //         ? status.name.includes(searchText)
        //         : value === 'toContact' && toContact
        //         ? toContact.name.includes(searchText)
        //         : value === 'fromContact' && fromContact
        //         ? fromContact.name.includes(searchText)
        //         : true,
        //     )
        //   : true;
      }) || [],
    );
  }, [appState.documents, searchText, getContact, appState.forms?.filterParams?.fieldSearch]);

  const renderItem = ({ item }: { item: IDocument }) => <DocumentItem item={item} />;

  const sendUpdateRequest = useCallback(async () => {
    const documents = appState.documents?.filter((document) => document?.head?.status === 1);

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
          Alert.alert('Документы отправлены!', '', [
            {
              text: 'Закрыть',
              onPress: () => {
                documents?.forEach((item) => {
                  appActions.updateDocumentStatus({ id: item?.id, status: item?.head?.status + 1 });
                });
              },
            },
          ]);
        } else {
          Alert.alert('Документы не были отправлены', '', [{ text: 'Закрыть' }]);
        }
      })
      .catch((err: Error) => Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]));
  }, [appActions, apiService.baseUrl.timeout, apiService.data, appState.documents, state.companyID]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft: () => <IconButton icon="file-send" size={26} onPress={sendUpdateRequest} />,
      headerRight: () => (
        <IconButton
          icon="menu"
          size={28}
          onPress={() =>
            showActionSheet([
              /*  {
                title: 'Загрузить',
                onPress: () => navigation.navigate('DocumentRequest'),
              }, */
              {
                title: 'Создать документ',
                onPress: () => {
                  navigation.navigate('DocumentEdit');
                },
              },
              {
                title: 'Выгрузить документы',
                onPress: sendUpdateRequest,
              },
              {
                title: 'Удалить документы',
                type: 'destructive',
                onPress: appActions.deleteAllDocuments,
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
  }, [appActions.deleteAllDocuments, navigation, sendUpdateRequest, showActionSheet]);

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
            onEndReached={() => ({})}
            ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
          />

          <FAB
            style={[localStyles.fabAdd, { backgroundColor: colors.primary }]}
            icon="file-plus"
            onPress={() => {
              // appActions.clearForm('DocumentEdit');
              navigation.navigate('DocumentEdit');
            }}
          />
        </>
      )}
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
  // iconSettings: {
  //   width: 36,
  // },
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
