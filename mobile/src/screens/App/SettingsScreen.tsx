import { useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Divider, Avatar, Button } from 'react-native-paper';

import { IResponse, IMessage, IReference, IContact, IDocumentType, IGood, IRemain } from '../../../../common';
import SettingsItem from '../../components/SettingsItem';
import config from '../../config';
import { timeout } from '../../helpers/utils';
import { useAuthStore, useAppStore, useServiceStore } from '../../store';

const SettingsScreen = () => {
  const { colors /* , dark */ } = useTheme();
  const { apiService } = useServiceStore();
  const {
    actions: appActions,
    state: { settings, documents },
  } = useAppStore();
  const {
    state: { companyID },
    actions: authActions,
  } = useAuthStore();

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
              appActions.setContacts([]);
              appActions.setDocumentTypes([]);
              appActions.setGoods([]);
              appActions.setRemains([]);
              appActions.setDocuments([]);
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
    if (documents.some((document) => document.head?.status <= 1)) {
      Alert.alert('Внимание!', 'Нельзя обновить справочники, если есть документы со статусами "Черновик" и "Готово".', [
        {
          text: 'OK',
          onPress: () => ({}),
        },
      ]);
      return;
    }

    const getMessages = async () => {
      if (config.debug.useMockup) {
        const mockRef = (await import('../../mockData/References.json')) as IReference[];
        const mockContacts = mockRef.find((itm) => itm.name === 'contacts')?.data as IContact[];
        appActions.setContacts(mockContacts);
      } else {
        try {
          const response = await timeout<IResponse<IMessage[]>>(5000, apiService.data.getMessages(companyID));
          if (!response.result) {
            Alert.alert('Запрос не был отправлен', '', [{ text: 'Закрыть', onPress: () => ({}) }]);
            return;
          }
          const messages = response.data.filter((message) => message.body.type === 'data');
          if (messages.length !== 0) {
            const sortMessages = messages.sort((curr, next) => next.head.dateTime.localeCompare(curr.head.dateTime));
            /* Обработка данных по справочникам */
            const ref = (sortMessages[0].body.payload as unknown) as IReference[];
            const contacts = ref.find((itm) => itm.name === 'contacts')?.data as IContact[];
            appActions.setContacts(contacts);
            const documentTypes = ref.find((itm) => itm.name === 'documenttypes')?.data as IDocumentType[];
            appActions.setDocumentTypes(documentTypes);
            const goods = ref.find((itm) => itm.name === 'goods')?.data as IGood[];
            appActions.setGoods(goods);
            const remains = (ref.find((itm) => itm.name === 'remains')?.data as unknown) as IRemain[];
            appActions.setRemains(remains);

            apiService.data.deleteMessage(companyID, messages[0].head.id);
            // appActions.setReferences((sortMessages[0].body.payload as unknown) as IReference[]);
          }
        } catch (err) {
          Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть', onPress: () => ({}) }]);
        }
      }
      Alert.alert('Данные получены', 'Справочники обновлены', [{ text: 'Закрыть', onPress: () => ({}) }]);
    };

    getMessages();
  }, [apiService.data, appActions, companyID, documents]);

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={localStyles.content}>
        <Avatar.Icon size={48} icon="face-outline" />
        <Button icon="logout" mode="contained" onPress={logOut}>
          Выход
        </Button>
      </View>
      <View style={localStyles.content}>
        <Button mode="contained" onPress={() => authActions.setCompanyID(undefined)}>
          Сменить организацию
        </Button>
      </View>
      <View style={localStyles.content}>
        <Button mode="contained" onPress={sendGetReferencesRequest}>
          Проверить обновления
        </Button>
      </View>
      <View style={localStyles.content}>
        <Button mode="contained" onPress={deleteAllData}>
          Удалить все данные
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
      <Divider />
      {/* <SettingsItem
        label="Dark theme"
        value={settings?.dakrTheme}
        onValueChange={() => {
          appActions.setSettings({ ...settings, dakrTheme: !settings?.dakrTheme })
        }}
      />*/}
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export { SettingsScreen };
