import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

import {
  IResponse,
  IMessageInfo,
  IContact,
  IRemain,
  IGood,
  IDocumentType,
  IDocument,
  IDataMessage,
} from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { timeout, getDateString, isMessagesArray } from '../../../helpers/utils';
import { IListItem, ITara, IWeighedGoods } from '../../../model';
import { IFormParams } from '../../../model/sell';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore, useAuthStore, useServiceStore } from '../../../store';

type Props = StackScreenProps<RootStackParamList, 'SettingsGettingDocument'>;

const SettingsGettingDocumentScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions: appActions } = useAppStore();
  const navigation = useNavigation();

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const sendUpdateRequest = useCallback(() => {
    timeout(
      5000,
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
          // Alert.alert('Запрос отправлен!', '', [{ text: 'Закрыть' }]);
        } else {
          // Alert.alert('Запрос не был отправлен', '', [{ text: 'Закрыть' }]);
        }
      })
      .catch((err: Error) => Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]));
  }, [apiService.data, state.companyID]);

  useEffect(() => {
    if (!appState.formParams) {
      // Инициализируем параметры
      appActions.setFormParams({
        dateBegin: yesterday.toISOString().slice(0, 10),
        dateEnd: today.toISOString().slice(0, 10),
      });
    }
  }, [appActions, appState.formParams, today, yesterday]);

  useEffect(() => {
    if (!route?.params) {
      return;
    }
    appActions.setFormParams(route.params);
  }, [appActions, route]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const getListItems = useCallback(
    (contacts: IContact[]) => contacts.map((item) => ({ id: item.id, value: item.name } as IListItem)),
    [],
  );
  const people: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === '2'), [appState.contacts]);
  const listPeople = useMemo(() => getListItems(people), [getListItems, people]);
  const companies: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === '3'), [
    appState.contacts,
  ]);

  const listCompanies = useMemo(() => getListItems(companies), [companies, getListItems]);

  const sendDocumentRequest = useCallback(() => {
    timeout(
      5000,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_SellDocuments',
          params: [
            {
              dateBegin: (appState.formParams as IFormParams)?.dateBegin
                ? new Date((appState.formParams as IFormParams)?.dateBegin).toISOString()
                : yesterday.toISOString(),
              dateEnd: (appState.formParams as IFormParams)?.dateBegin
                ? new Date((appState.formParams as IFormParams)?.dateEnd).toISOString()
                : today.toISOString(),
              expiditor: Array.isArray((appState.formParams as IFormParams)?.expiditor)
                ? (appState.formParams as IFormParams)?.expiditor[0]
                : (appState.formParams as IFormParams)?.expiditor,
              toContact: Array.isArray((appState.formParams as IFormParams)?.toContact)
                ? (appState.formParams as IFormParams)?.toContact[0]
                : (appState.formParams as IFormParams)?.toContact,
            },
          ],
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Запрос отправлен!', 'Подождите 2 минуты, затем проверьте обновления.', [
            {
              text: 'Закрыть',
              onPress: () => {
                appActions.clearFormParams();
              },
            },
          ]);
        } else {
          Alert.alert('Запрос не был отправлен', '', [
            {
              text: 'Закрыть',
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
  }, [apiService.data, state.companyID, appState.formParams, yesterday, today, appActions]);

  const sendSubscribe = useCallback(async () => {
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
                appActions.setDocuments([...appState.documents, ...newDocuments]);
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
              case 'weighedGoods': {
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

      const messagesForDocuments = response.data.filter(
        (message) => message.body.type === 'response' && message.body.payload?.name === 'post_documents',
      );
      if (messagesForDocuments.length > 0) {
        messagesForDocuments.forEach((message) => {
          if (Array.isArray(message.body.payload.params) && message.body.payload.params.length > 0) {
            message.body.payload.params.forEach((paramDoc) => {
              if (paramDoc.result) {
                const document = appState.documents.find((doc) => doc.id === paramDoc.docId);
                if (document && document.head.status === 2) {
                  appActions.editStatusDocument({ id: paramDoc.docId, status: 3 });
                }
              }
            });
          }
          apiService.data.deleteMessage(state.companyID, message.head.id);
        });
        Alert.alert('Данные получены', 'Справочники обновлены', [{ text: 'Закрыть', onPress: () => ({}) }]);
      }
    } catch (err) {
      Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть', onPress: () => ({}) }]);
    }
  }, [apiService.data, appActions, appState.documents, state.companyID]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            appActions.clearFormParams();
            navigation.navigate('SellDocuments');
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            // sendUpdateRequest();
            sendDocumentRequest();
            // sendSubscribe();
            appActions.clearFormParams();
            navigation.navigate('SellDocuments');
          }}
        />
      ),
    });
  }, [appActions, navigation, sendDocumentRequest, sendSubscribe, sendUpdateRequest]);

  const ReferenceItem = useCallback(
    (props: { value: string; onPress: () => void; color?: string }) => {
      return (
        <TouchableOpacity {...props}>
          <View style={[localStyles.picker, { borderColor: colors.border }]}>
            <Text style={[localStyles.pickerText, { color: colors.text }]}>{props.value || 'Выберите из списка'}</Text>
            <MaterialCommunityIcons style={localStyles.pickerButton} name="menu-right" size={30} color="black" />
          </View>
        </TouchableOpacity>
      );
    },
    [colors.border, colors.text],
  );

  return (
    <View style={[localStyles.container, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>Загрузка заявок</SubTitle>
      <ScrollView>
        <View style={[localStyles.areaChips, { borderColor: colors.border }]} key={0}>
          <Text style={localStyles.subdivisionText}>Дата документа</Text>
          <Text style={localStyles.subdivisionText}>с: </Text>
          <View style={[localStyles.areaChips, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={localStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'SettingsGettingDocument',
                  fieldName: 'dateBegin',
                  title: 'Дата начала',
                  value: (appState.formParams as IFormParams)?.dateBegin,
                })
              }
            >
              <Text style={[localStyles.textDate, { color: colors.text }]}>
                {getDateString((appState.formParams as IFormParams)?.dateBegin || yesterday.toISOString())}
              </Text>
              <MaterialIcons style={localStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
          <Text style={localStyles.subdivisionText}>по: </Text>
          <View style={[localStyles.areaChips, { borderColor: colors.border }]} key={1}>
            <TouchableOpacity
              style={localStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'SettingsGettingDocument',
                  fieldName: 'dateEnd',
                  title: 'Дата окончания',
                  value: (appState.formParams as IFormParams)?.dateEnd,
                })
              }
            >
              <Text style={[localStyles.textDate, { color: colors.text }]}>
                {getDateString((appState.formParams as IFormParams)?.dateEnd || today.toUTCString())}
              </Text>
              <MaterialIcons style={localStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[localStyles.area, { borderColor: colors.border }]} key={2}>
          <Text style={localStyles.subdivisionText}>Экспедитор:</Text>
          <ReferenceItem
            value={selectedItem(listPeople, (appState.formParams as IFormParams)?.expiditor)?.value}
            onPress={() =>
              navigation.navigate('SelectItemScreen', {
                parentScreen: 'SettingsGettingDocument',
                fieldName: 'expiditor',
                title: 'Экспедитор',
                list: listPeople,
                value: (appState.formParams as IFormParams)?.expiditor,
              })
            }
          />
        </View>
        <View style={[localStyles.area, { borderColor: colors.border }]} key={4}>
          <Text style={localStyles.subdivisionText}>Организация:</Text>
          <ReferenceItem
            value={selectedItem(listCompanies, (appState.formParams as IFormParams)?.toContact)?.value}
            onPress={() =>
              navigation.navigate('SelectItemScreen', {
                parentScreen: 'SettingsGettingDocument',
                fieldName: 'toContact',
                title: 'Организация',
                list: listCompanies,
                value: (appState.formParams as IFormParams)?.toContact,
              })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export { SettingsGettingDocumentScreen };

const localStyles = StyleSheet.create({
  area: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 5,
    minHeight: 80,
    padding: 5,
  },
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  container: {
    flex: 1,
  },
  containerDate: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
  },
  marginRight: {
    marginRight: 10,
  },
  picker: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 5,
  },
  pickerButton: {
    flex: 1,
    marginRight: 10,
    textAlign: 'right',
  },
  pickerText: {
    alignSelf: 'center',
    flex: 10,
    fontSize: 16,
  },
  subdivisionText: {
    marginBottom: 5,
    textAlign: 'left',
  },
  text: {
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
  },
  textDate: {
    flex: 0.95,
    flexGrow: 4,
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    padding: 10,
  },
});
