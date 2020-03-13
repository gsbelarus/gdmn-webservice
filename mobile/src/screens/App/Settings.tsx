import React from 'react';
import { ScrollView, AsyncStorage, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Divider, Avatar, Button, Title, Text } from 'react-native-paper';
import SettingsItem from '../../components/SettingsItem';
import { useStore } from '../../store';

const THEME_PERSISTENCE_KEY = 'THEME_TYPE';

export const Settings = () => {
  const { colors, dark } = useTheme();
  const {
    state,
    actions: { logOut }
  } = useStore();

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Title style={{textAlign: 'center'}}>Пользователь</Title>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12
        }}
      >
        <Avatar.Icon size={48} icon="face-outline" />
        <Text>{String(state.loggedIn)}</Text>
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
