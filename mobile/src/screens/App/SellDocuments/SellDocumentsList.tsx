import { MaterialCommunityIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';

import { IDocumentType, IResponse, IMessageInfo } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { timeout } from '../../../helpers/utils';
import statuses from '../../../mockData/Otves/documentStatuses.json';
import { ISellDocument, ISellHead } from '../../../model';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';
import styles from '../../../styles/global';

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
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            Подразделение: {fromContact ? fromContact.name : ''}
          </Text>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            Экспедитор: {expeditor ? expeditor.name : ''}
          </Text>
          <Text style={[localStyles.company, localStyles.field, { color: colors.text }]}>
            {toContact ? toContact.name : ''}
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
                    ? item.head.docnumber.includes(searchText)
                    : value === 'state' && status
                    ? status.name.includes(searchText)
                    : value === 'toContact' && toContact
                    ? toContact.name.includes(searchText)
                    : value === 'fromContact' && fromContact
                    ? fromContact.name.includes(searchText)
                    : value === 'expeditor' && expeditor
                    ? expeditor.name.includes(searchText)
                    : true,
                )
              : true;
          })
        : [],
    );
  }, [appState.contacts, appState.documents, appState.settingsSearch, searchText]);

  const renderItem = ({ item }: { item: ISellDocument }) => <DocumentItem item={item} />;

  const sendUpdateRequest = async () => {
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
          Alert.alert('Запрос отправлен!', '', [
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
          Alert.alert('Запрос не был отправлен', '', [
            {
              text: 'Закрыть',
              onPress: () => ({}),
            },
          ]);
        }
      })
      .catch((err: Error) =>
        Alert.alert('Ошибка!', err.message, [
          {
            text: 'Закрыть',
            onPress: () => ({}),
          },
        ]),
      );
  };

  return (
    <View style={[localStyles.flex1, { backgroundColor: colors.card }]}>
      <View style={localStyles.flexDirectionRow}>
        <Searchbar
          placeholder="Поиск по номеру"
          onChangeText={setSearchText}
          value={searchText}
          style={localStyles.flexGrow}
        />
        <TouchableOpacity style={localStyles.iconSettings} onPress={() => navigation.navigate('SettingsSearchScreen')}>
          <MaterialIcons size={25} color={colors.primary} name="settings" />
        </TouchableOpacity>
      </View>
      {data.length === 0 ? (
        <Text style={[styles.title, localStyles.flexGrow]}>Не найдено</Text>
      ) : (
        <FlatList
          ref={ref}
          data={data}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
      )}
      <View style={localStyles.buttons}>
        <TouchableOpacity
          style={[
            styles.circularButton,
            localStyles.button,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={sendUpdateRequest}
        >
          <Entypo size={30} color={colors.card} name="arrow-up" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.circularButton,
            localStyles.button,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => navigation.navigate('SettingsGettingDocument')}
        >
          <Entypo size={30} color={colors.card} name="arrow-down" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.circularButton,
            localStyles.button,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => navigation.navigate('CreateSellDocument')}
        >
          <MaterialIcons size={30} color={colors.card} name="note-add" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { SellDocumentsListScreen };

const localStyles = StyleSheet.create({
  alignItems: {
    alignItems: 'flex-end',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  button: {
    alignItems: 'center',
    margin: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  company: {
    fontSize: 12,
    fontWeight: 'bold',
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
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
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
});
