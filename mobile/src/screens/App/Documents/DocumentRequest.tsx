/* eslint-disable react-hooks/exhaustive-deps */
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
  IDocument,
  IDataMessage,
  IReference,
} from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { timeout, getDateString, isMessagesArray } from '../../../helpers/utils';
import { IListItem, IFormParams } from '../../../model/types';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore, useAuthStore, useServiceStore } from '../../../store';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentRequest'>;

const DocumentRequestScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions: appActions } = useAppStore();
  const navigation = useNavigation();

  const documentParams = useMemo(() => (appState.forms?.documentParams as unknown) as IFormParams, [
    appState.forms?.documentParams,
  ]);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const sendUpdateRequest = useCallback(() => {
    timeout(
      apiService.baseUrl.timeout,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_references',
          params: ['documenttypes', 'goodgroups', 'goods', 'remains', 'contacts'],
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
  }, [apiService.baseUrl.timeout, apiService.data, state.companyID]);

  // useEffect(() => {
  //   if (!documentParams) {
  //     // Инициализируем параметры
  //     appActions.setFormParams({
  //       dateBegin: yesterday.toISOString().slice(0, 10),
  //       dateEnd: today.toISOString().slice(0, 10),
  //     });
  //   }
  // }, [appActions, documentParams, today, yesterday]);

  // useEffect(() => {
  //   if (!route?.params) {
  //     return;
  //   }
  //   appActions.setFormParams(route.params);
  // }, [appActions, route]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const getListItems = (contacts: IContact[]): IListItem[] =>
    contacts.map((item) => ({ id: item.id, value: item.name }));

  const contacts = useMemo(() => appState.references?.contacts || [], [appState.references?.contacts]);

  const departments: IContact[] = useMemo(
    () => ((contacts as unknown) as IContact[]).filter((item) => item.contactType === 4),
    [contacts],
  );

  const listDepartments = useMemo(() => getListItems(departments), [departments]);

  const sendDocumentRequest = useCallback(() => {
    timeout(
      apiService.baseUrl.timeout,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_InvDocuments',
          params: [
            {
              dateBegin: documentParams?.dateBegin
                ? new Date(documentParams?.dateBegin).toISOString()
                : yesterday.toISOString(),
              dateEnd: documentParams?.dateBegin
                ? new Date(documentParams?.dateEnd).toISOString()
                : today.toISOString(),
              fromContact: Array.isArray(documentParams?.fromContact)
                ? documentParams?.fromContact[0]
                : documentParams?.fromContact,
              toContact: Array.isArray(documentParams?.toContact)
                ? documentParams?.toContact[0]
                : documentParams?.toContact,
            },
          ],
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Запрос отправлен!', '', [
            {
              text: 'Закрыть',
              onPress: () => {
                appActions.clearForm('DocumentRequest');
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
  }, [
    apiService.baseUrl.timeout,
    apiService.data,
    state.companyID,
    documentParams?.dateBegin,
    documentParams?.dateEnd,
    documentParams?.fromContact,
    documentParams?.toContact,
    yesterday,
    today,
    appActions,
  ]);

  const sendSubscribe = useCallback(async () => {
    try {
      const response = await apiService.data.subscribe(state.companyID);

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
          ((message.body.payload as unknown) as IDataMessage[])?.forEach((dataSet) => {
            switch (dataSet.type) {
              case 'get_SellDocuments': {
                const addDocuments = dataSet.data as IDocument[];
                appActions.setDocuments([...appState.documents, ...addDocuments]);
                break;
              }
              case 'documenttypes': {
                const documentTypes = dataSet.data as IReference<IContact[]>;
                appActions.setReference(documentTypes);
                break;
              }
              case 'contacts': {
                const con = dataSet.data as IReference<IContact[]>;
                appActions.setReference(con);
                break;
              }
              case 'goods': {
                const goods = dataSet.data as IReference<IContact[]>;
                appActions.setReference(goods);
                break;
              }
              case 'remains': {
                const remains = dataSet.data as IReference<IContact[]>;
                appActions.setReference(remains);
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
        messagesForDocuments?.forEach((message) => {
          if (Array.isArray(message.body.payload?.params) && message.body.payload.params.length > 0) {
            message.body.payload?.params?.forEach((paramDoc) => {
              if (paramDoc.result) {
                const document = appState.documents.find((doc) => doc.id === paramDoc.docId);
                if (document?.head.status === 2) {
                  appActions.updateDocumentStatus({ id: paramDoc.docId, status: 3 });
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
            appActions.clearForm('DocumentRequest');
            navigation.navigate('SellDocuments');
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            sendUpdateRequest();
            sendDocumentRequest();
            sendSubscribe();
            appActions.clearForm('DocumentRequest');
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
          <View style={[localeStyles.picker, { borderColor: colors.border }]}>
            <Text style={[localeStyles.pickerText, { color: colors.text }]}>{props.value || 'Выберите из списка'}</Text>
            <MaterialCommunityIcons style={localeStyles.pickerButton} name="menu-right" size={30} color="black" />
          </View>
        </TouchableOpacity>
      );
    },
    [colors.border, colors.text],
  );

  return (
    <View style={[localeStyles.container, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Загрузка заявок</SubTitle>
      <ScrollView>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
          <Text style={localeStyles.subdivisionText}>Дата документа</Text>
          <Text style={localeStyles.subdivisionText}>с: </Text>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={localeStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDate', {
                  fieldName: 'dateBegin',
                  title: 'Дата начала',
                  value: documentParams?.dateBegin,
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString(documentParams?.dateBegin || yesterday.toISOString())}
              </Text>
              <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
          <Text style={localeStyles.subdivisionText}>по: </Text>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
            <TouchableOpacity
              style={localeStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDate', {
                  fieldName: 'dateEnd',
                  title: 'Дата окончания',
                  value: documentParams?.dateEnd,
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString(documentParams?.dateEnd || today.toUTCString())}
              </Text>
              <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[localeStyles.area, { borderColor: colors.border }]} key={2}>
          <Text style={localeStyles.subdivisionText}>Отправитель:</Text>
          <ReferenceItem
            value={selectedItem(departments, documentParams?.fromContact)?.value}
            onPress={() =>
              navigation.navigate('SelectItem', {
                fieldName: 'fromContact',
                title: 'Подразделение',
                list: listDepartments,
                value: [documentParams?.fromContact],
              })
            }
          />
        </View>
        <View style={[localeStyles.area, { borderColor: colors.border }]} key={4}>
          <Text style={localeStyles.subdivisionText}>Получатель:</Text>
          <ReferenceItem
            value={selectedItem(departments, documentParams?.toContact)?.value}
            onPress={() =>
              navigation.navigate('SelectItem', {
                fieldName: 'toContact',
                title: 'Подразделение',
                list: listDepartments,
                value: [documentParams?.toContact],
              })
            }
          />
          {/* TODO: добавить тип документ */}
        </View>
      </ScrollView>
    </View>
  );
};

export { DocumentRequestScreen };

const localeStyles = StyleSheet.create({
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
