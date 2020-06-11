import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Divider, Avatar, Button } from 'react-native-paper';

import SettingsItem from '../../components/SettingsItem';
import { useAuthStore, useAppStore, useServiceStore } from '../../store';
// AppStore

// const THEME_PERSISTENCE_KEY = 'THEME_TYPE';

const SettingsScreen = () => {
  const { colors, dark } = useTheme();
  const { apiService } = useServiceStore();
  const {
    actions: appActions,
    state: { settings },
  } = useAppStore();
  const { actions: authActions } = useAuthStore();

  const logOut = async () => {
    const res = await apiService.auth.logout();
    if (res.result) {
      authActions.logOut();
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={localStyles.content}>
        <Avatar.Icon size={48} icon="face-outline" />
        <Button mode="contained" onPress={() => authActions.setCompanyID(undefined)}>
          Сменить орг.
        </Button>
        <Button icon="logout" mode="contained" onPress={logOut}>
          Выход
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export { SettingsScreen };
