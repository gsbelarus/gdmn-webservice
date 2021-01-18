import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, FAB } from 'react-native-paper';

import {
  IReference,
  IMessageInfo,
  IResponse,
  IDataMessage,
  IDocument,
  IDocumentType,
  IContact,
  IGood,
  IRemain,
} from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { timeout, isMessagesArray } from '../../../helpers/utils';
import { ITara, IWeighedGoods } from '../../../model';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';

const ReferenceItem = React.memo(({ item }: { item: IReference }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Reference', { item });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ReferenceListScreen = () => {
  const { colors } = useTheme();
  const { state } = useAuthStore();
  const { state: AppState } = useAppStore();
  const {
    apiService,
    state: { serverUrl },
  } = useServiceStore();

  const ref = React.useRef<FlatList<IReference>>(null);
  useScrollToTop(ref);

  const references: IReference[] = useMemo(
    () => [
      {
        id: 0,
        name: 'Типы документов',
        type: 'documenttypes',
        data: AppState.documentTypes,
      },
      {
        id: 1,
        name: 'Контакты',
        type: 'contacts',
        data: AppState.contacts,
      },
      {
        id: 2,
        name: 'Товары',
        type: 'goods',
        data: AppState.goods,
      },
      {
        id: 3,
        name: 'Тары',
        type: 'boxings',
        data: AppState.boxings,
      },
      {
        id: 4,
        name: 'Взвешенные товары',
        type: 'weighedgoods',
        data: AppState.weighedGoods,
      },
    ],
    [AppState.documentTypes, AppState.contacts, AppState.goods, AppState.boxings, AppState.weighedGoods],
  );

  const renderItem = ({ item }: { item: IReference }) => <ReferenceItem item={item} />;

  const sendUpdateRequest = useCallback(() => {
    timeout(
      serverUrl?.timeout,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_references',
          params: ['documenttypes', 'goodgroups', 'goods', 'remains', 'contacts', 'boxings', 'weighedGoods'],
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Запрос отправлен!', 'Подождите 2 минуты, затем проверьте обновления.', [{ text: 'Закрыть' }]);
        } else {
          Alert.alert('Запрос не был отправлен', '', [{ text: 'Закрыть' }]);
        }
      })
      .catch((err: Error) => Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]));
  }, [apiService.data, serverUrl?.timeout, state.companyID]);

  /*   const sendSubscribe = useCallback(async () => {
    try {
      const response = await apiService.data.subscribe(state.companyID);
      console.log(response);
      if (!response.result) {
        Alert.alert('Запрос не был отправлен', '', [{ text: 'Закрыть', onPress: () => ({}) }]);
        return;
      }
      if (!isMessagesArray(response.data)) {
        Alert.alert('Получены неверные данные.', 'Попробуйте ещё раз.', [{ text: 'Закрыть', onPress: () => ({}) }]);
      }

      response.data?.forEach((message) => {
        if (message.body.type === 'data') {
          // Сообщение содержит данные
          ((message.body.payload as unknown) as IDataMessage[]).forEach((dataSet) => {
            switch (dataSet.type) {
              case 'get_SellDocuments': {
                const newDocuments = dataSet.data as IDocument[];
                appActions.setDocuments([...AppState.documents, ...newDocuments]);
                break;
              }
              case 'documenttypes': {
                const documentTypes = dataSet.data as IDocumentType[];
                appActions.setDocumentTypes(documentTypes);
                break;
              }
              case 'contacts': {
                const contacts = dataSet.data as IContact[];
                appActions.setContacts(contacts);
                break;
              }
              case 'goods': {
                const goods = dataSet.data as IGood[];
                appActions.setGoods(goods);
                break;
              }
              case 'remains': {
                const remains = dataSet.data as IRemain[];
                appActions.setRemains(remains);
                break;
              }
              case 'boxings': {
                const boxings = dataSet.data as ITara[];
                appActions.setBoxings(boxings);
                break;
              }
              case 'weighedgoods': {
                const weighedGoods = dataSet.data as IWeighedGoods[];
                appActions.setWeighedGoods(weighedGoods);
                break;
              }
              default:
                break;
            }
          });
          apiService.data.deleteMessage(state.companyID, message.head.id);
          Alert.alert('Данные получены', 'Справочники обновлены', [{ text: 'Закрыть', onPress: () => ({}) }]);
        }
        if (message.body.type === 'cmd') {
          // Сообщение содержит команду
          apiService.data.deleteMessage(state.companyID, message.head.id);
        }
      });
    } catch (err) {
      Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть', onPress: () => ({}) }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiService.data, state.companyID]); */

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <FlatList
        ref={ref}
        data={references.filter((i) => i.data?.length)}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export { ReferenceListScreen };

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
    margin: 8,
  },
  fieldDesciption: {
    opacity: 0.5,
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
