import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Divider, Avatar, Button } from 'react-native-paper';

import SettingsItem from '../../components/SettingsItem';
import { useAuthStore } from '../../store';

// const THEME_PERSISTENCE_KEY = 'THEME_TYPE';

const SettingsScreen = () => {
  const { colors, dark } = useTheme();
  const { actions, state, api } = useAuthStore();

  const logOut = async () => {
    const res = await api.auth.logout();
    if (res.result) {
      actions.logOut();
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View style={localStyles.content}>
        <Avatar.Icon size={48} icon="face-outline" />
        <Button mode="contained" onPress={() => actions.setCompanyID(undefined)}>
          Сменить орг.
        </Button>
        <Button icon="logout" mode="contained" onPress={logOut}>
          Выход
        </Button>
      </View>
      <Divider />
      <SettingsItem
        label="Синхронизировать"
        value={state.synchronization}
        onValueChange={() => actions.setSynchonization(!state.synchronization)}
      />
      <Divider />
      <SettingsItem
        label="Удалять документы после обработки на сервере"
        value={state.autodeletingDocument}
        onValueChange={() => actions.setAutodeletingDocument(!state.autodeletingDocument)}
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
