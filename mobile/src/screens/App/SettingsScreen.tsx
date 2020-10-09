import { useTheme } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Divider, Avatar, Button, Text, IconButton } from 'react-native-paper';
import Reactotron from 'reactotron-react-native';

import { IResponse, IMessage, IReference, IContact, IGood, IRemain, IDocument, IRefData } from '../../../../common';
import { IDataMessage } from '../../../../common/models';
import SettingsItem from '../../components/SettingsItem';
import { useActionSheet } from '../../helpers/useActionSheet';
import { timeout, isMessagesArray, appStorage } from '../../helpers/utils';
import { useAuthStore, useAppStore, useServiceStore } from '../../store';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state: AuthState } = useAuthStore();
  const {
    actions: appActions,
    state: { settings, documents, references, forms },
  } = useAppStore();
  const {
    state: { companyID, userID },
    actions: authActions,
  } = useAuthStore();

  const [isLoading, setLoading] = useState(false);

  const showActionSheet = useActionSheet();

  const logOut = useCallback(
    () =>
      (async () => {
        const res = await apiService.auth.logout();
        if (res.result) {
          authActions.logOut();
        }
      })(),
    [apiService.auth, authActions],
  );

  const deleteAllData = useCallback(
    () =>
      (async () => {
        Alert.alert('Внимание!', 'Удалить все данные?', [
          {
            text: 'Да',
            onPress: () => {
              appActions.setDocuments([]);
              appActions.setReferences(undefined);
            },
          },
          {
            text: 'Отмена',
          },
        ]);
      })(),
    [appActions],
  );

  const sendGetReferencesRequest = useCallback(() => {
    if (documents?.some((document) => document.head?.status <= 1)) {
      Alert.alert('Внимание!', 'Нельзя обновить справочники, если есть документы со статусами "Черновик" и "Готово".', [
        {
          text: 'OK',
        },
      ]);
      return;
    }

    const getMessages = async () => {
      try {
        // const response = await apiService.data.subscribe(companyID);
        const response = await timeout<IResponse<IMessage[]>>(10000, apiService.data.getMessages(companyID));

        // console.log(response);

        if (!response.result) {
          Alert.alert('Запрос не был отправлен', '', [{ text: 'Закрыть', onPress: () => ({}) }]);
          return;
        }

        if (!isMessagesArray(response.data)) {
          Alert.alert('Получены неверные данные.', 'Попробуйте ещё раз.', [{ text: 'Закрыть' }]);
          return;
        }

        let isUpdated = false;
        response.data?.forEach((message) => {
          if (message.body.type === 'data') {
            // Сообщение содержит данные
            ((message.body.payload as unknown) as IDataMessage[]).forEach((dataSet) => {
              switch (dataSet.type) {
                case 'get_SellDocuments': {
                  const addDocuments = dataSet.data as IDocument[];
                  appActions.setDocuments([...documents, ...addDocuments]);
                  break;
                }
                case 'documenttypes':
                case 'contacts':
                case 'goodgroups':
                case 'remains':
                case 'goods': {
                  // TODO: преобразовывать json данные в модель данных
                  const refObj = (dataSet as unknown) as IReference<any[]>;
                  appActions.setReference(refObj);
                  break;
                }
                /* case 'documenttypes': {
                  const documentTypes = (dataSet as unknown) as IReference<IRefData[]>;
                  appActions.setReference(documentTypes);
                  break;
                }
                case 'contacts': {
                  const contacts = (dataSet as unknown) as IReference<IContact[]>;
                  appActions.setReference(contacts);
                  break;
                }
                case 'goods': {
                  const goods = (dataSet as unknown) as IReference<IGood[]>;
                  appActions.setReference(goods);
                  break;
                }
                case 'remains': {
                  const remains = (dataSet as unknown) as IReference<IRemain[]>;
                  appActions.setReference(remains);
                  break;
                } */
                default:
                  break;
              }
            });
            apiService.data.deleteMessage(companyID, message.head.id);
          }
          if (message.body.type === 'cmd') {
            // Сообщение содержит команду
            apiService.data.deleteMessage(companyID, message.head.id);
          }
          isUpdated = true;
        });

        /* Обработка сообщений, которые связаны с документами */
        const messagesForDocuments = response.data.filter(
          (message) => message.body.type === 'response' && message.body.payload?.name === 'post_documents',
        );
        if (messagesForDocuments.length > 0) {
          messagesForDocuments.forEach((message) => {
            if (Array.isArray(message.body.payload.params) && message.body.payload.params.length > 0) {
              message.body.payload.params.forEach((paramDoc) => {
                if (paramDoc.result) {
                  const document = documents?.find((doc) => doc.id === paramDoc.docId);
                  if (document?.head?.status === 2) {
                    appActions.updateDocumentStatus({ id: paramDoc.docId, status: 3 });
                  }
                }
              });
            }
            apiService.data.deleteMessage(companyID, message.head.id);
          });
          isUpdated = true;
          // Alert.alert('Данные получены', 'Справочники обновлены', [{ text: 'Закрыть' }]);
        }
        Alert.alert('Данные получены', 'Справочники обновлены', [{ text: 'Закрыть' }]);
      } catch (err) {
        Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [apiService.data, appActions, companyID, documents]);

  return (
    <>
      <View style={[localStyles.profileContainer, { backgroundColor: colors.primary }]}>
        <View style={localStyles.profileIcon}>
          <Avatar.Icon size={50} icon="account-badge" style={{ backgroundColor: colors.primary }} />
        </View>
        <View style={localStyles.profileInfo}>
          <Text style={[localStyles.profileInfoTextUser, { color: colors.background }]}>
            {AuthState.profile?.userName || ''}
          </Text>
          <Text style={[localStyles.profileInfoTextCompany, { color: colors.card }]}>
            {AuthState.profile?.companyName || ''}
          </Text>
        </View>
        <IconButton
          icon="dots-vertical"
          color={colors.card}
          size={30}
          onPress={() =>
            showActionSheet([
              {
                title: 'Сменить пользователя',
                onPress: logOut,
              },
              {
                title: 'Сменить организацию',
                onPress: async () => {
                  await appStorage.removeItem(`${userID}/companyId`);
                  authActions.setCompanyID({ companyId: null, companyName: undefined });
                },
              },
              {
                title: 'Удалить все данные',
                type: 'destructive',
                onPress: deleteAllData,
              },
              {
                title: 'Отмена',
                type: 'cancel',
              },
            ])
          }
        />
      </View>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View>
          <Button
            mode="text"
            icon={'update'}
            style={localStyles.refreshButton}
            disabled={isLoading}
            loading={isLoading}
            onPress={sendGetReferencesRequest}
          >
            Проверить обновления
          </Button>
          <Button
            mode="text"
            onPress={async () => {
              const log = await appStorage.getItem(`${AuthState.userID}/${AuthState.companyID}/REFERENCES`);
              Reactotron.display({
                name: 'Mobile Storage',
                preview: log,
                value: log,
                important: true,
              });
            }}
          >
            Проверить хранилище
          </Button>
          <Button
            mode="text"
            onPress={async () => {
              Reactotron.display({
                name: 'settings',
                preview: 'settings',
                value: settings,
                important: true,
              });
              Reactotron.display({
                name: 'documents',
                preview: 'documents',
                value: documents,
                important: true,
              });
              Reactotron.display({
                name: 'references',
                preview: 'references',
                value: references,
                important: true,
              });
              Reactotron.display({
                name: 'forms',
                preview: 'forms',
                value: forms,
                important: true,
              });
            }}
          >
            Проверить стейт
          </Button>
        </View>
        <Divider />
        <SettingsItem
          label="Синхронизировать"
          value={settings?.synchronization}
          onValueChange={() => appActions.setSettings({ ...settings, synchronization: !settings?.synchronization })}
        />
        <Divider />
        <SettingsItem
          label="Удалять документы после обработки на сервере"
          value={settings?.autodeletingDocument}
          onValueChange={() =>
            appActions.setSettings({ ...settings, autodeletingDocument: !settings?.autodeletingDocument })
          }
        />
      </ScrollView>
    </>
  );
};

const localStyles = StyleSheet.create({
  content: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  profileIcon: {
    justifyContent: 'space-around',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileInfoTextCompany: {
    fontSize: 14,
    fontWeight: '300',
  },
  profileInfoTextUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    margin: 20,
  },
});

export { SettingsScreen };
