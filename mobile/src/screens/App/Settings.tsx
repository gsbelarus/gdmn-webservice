import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, AsyncStorage, View } from 'react-native';
import { Divider, Avatar, Button, Title } from 'react-native-paper';

import { authApi } from '../../api/auth';
import SettingsItem from '../../components/SettingsItem';
import { useStore } from '../../store';

const THEME_PERSISTENCE_KEY = 'THEME_TYPE';

export const Settings = () => {
  const { colors, dark } = useTheme();
  const { actions } = useStore();

  const logOut = async () => {
    const res = await authApi.logout();
    if (res.status === 200) {
      actions.logOut();
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Title style={{ textAlign: 'center' }}>Пользователь</Title>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Avatar.Icon size={48} icon="face-outline" />
        <Button icon="logout" mode="contained" onPress={logOut}>
          Выход
        </Button>
      </View>
      <Divider />
      <SettingsItem label="Синхронизировать" value={true} onValueChange={() => {}} />
      <Divider />
      <SettingsItem label="Удалять документы после обработки на сервере" value={true} onValueChange={() => {}} />
      <Divider />
      <SettingsItem
        label="Dark theme"
        value={dark}
        onValueChange={() => {
          AsyncStorage.setItem(THEME_PERSISTENCE_KEY, dark ? 'light' : 'dark');

          // Переделать в глобал стейт
          // setTheme(t => (t.dark ? DefaultTheme : DarkTheme));
        }}
      />
    </ScrollView>
  );
};
