import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, AsyncStorage, View, StyleSheet } from 'react-native';
import { Divider, Avatar, Button } from 'react-native-paper';

import { authApi } from '../../api/auth';
import SettingsItem from '../../components/SettingsItem';
import SubTitle from '../../components/SubTitle';
import { useStore } from '../../store';
import styles from '../../styles/global';

const THEME_PERSISTENCE_KEY = 'THEME_TYPE';

type SettingsStackParamList = {
  SettingsList: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsScreen = () => {
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
      <View style={localeStyles.content}>
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

const localeStyles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export { SettingsScreen };
