import { useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Divider, Avatar, Button } from 'react-native-paper';

import { IResponse, IMessage, IReference } from '../../../../common';
import SettingsItem from '../../components/SettingsItem';
import { timeout } from '../../helpers/utils';
import { useAuthStore, useAppStore, useServiceStore } from '../../store';
// AppStore

// const THEME_PERSISTENCE_KEY = 'THEME_TYPE';

const SettingsScreen = () => {
  const { colors, dark } = useTheme();
  const { apiService } = useServiceStore();
  const {
    actions: appActions,
    state: { settings, documents },
  } = useAppStore();
  const {
    state: { companyID },
    actions: authActions,
  } = useAuthStore();

  const logOut = async () => {
    const res = await apiService.auth.logout();
    if (res.result) {
      authActions.logOut();
    }
  };

  const sendGetReferencesRequest = useCallback(() => {
    if (!documents.some((document) => document.head.status <= 1)) {
      timeout(5000, apiService.data.getMessages(companyID))
        .then((response: IResponse<IMessage[]>) => {
          if (response.result) {
            Alert.alert('Успех!', 'Справочники обновлены.', [
              {
                text: 'OK',
                onPress: () => {
                  const messages = response.data.filter((message) => message.body.type === 'data');
                  if (messages.length !== 0) {
                    const sortMessages = messages.sort((curr, next) =>
                      next.head.dateTime.localeCompare(curr.head.dateTime),
                    );
                    appActions.setReferences((sortMessages[0].body.payload as unknown) as IReference[]);
                  }
                },
              },
            ]);
          } else {
            Alert.alert('Запрос не был отправлен', '', [
              {
                text: 'OK',
                onPress: () => ({}),
              },
            ]);
          }
        })
        .catch((err: Error) =>
          Alert.alert('Ошибка!', err.message, [
            {
              text: 'OK',
              onPress: () => ({}),
            },
          ]),
        );
    } else {
      Alert.alert(
        'Предупреждение',
        'Нельзя проверять обновления, если есть документы со статусами "Черновик" и "Готово".',
        [
          {
            text: 'OK',
            onPress: () => ({}),
          },
        ],
      );
    }
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
      <SettingsItem
        label="Dark theme"
        value={dark}
        onValueChange={() => {
          //AsyncStorage.setItem(THEME_PERSISTENCE_KEY, dark ? 'light' : 'dark');
          // Переделать в глобал стейт
          // setTheme(t => (t.dark ? DefaultTheme : DarkTheme));
        }}
      />
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
