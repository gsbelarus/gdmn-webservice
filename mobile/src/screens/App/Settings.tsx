import React from 'react';
import { ScrollView, AsyncStorage, YellowBox, Platform, StatusBar, I18nManager } from 'react-native';
import { Divider } from 'react-native-paper';
import SettingsItem from '../../components/SettingsItem';

export const Settings = () => {
  return (
    <ScrollView /* style={{ backgroundColor: theme.colors.background }} */>
      <SettingsItem label="Удалять документы после синхронизации" value={true} onValueChange={() => {}} />
      <Divider />
      <SettingsItem label="Синхронизировать" value={true} onValueChange={() => {}} />
    </ScrollView>
  );
};
