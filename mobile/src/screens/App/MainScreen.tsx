import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useStore } from '../../store';
import { Documents } from './Documents';
import { Settings } from './Settings';
import Contacts from './References';

type AppStackParams = {
  Documents: undefined;
  References: undefined;
  Settings: undefined;
};

const AppBottomTabs = createMaterialBottomTabNavigator<AppStackParams>();

export const MainScreen = () => {
  return (
    <AppBottomTabs.Navigator barStyle={styles.tabBar}>
      <AppBottomTabs.Screen
        name="Documents"
        component={Documents}
        options={{
          tabBarLabel: 'Документы',
          tabBarIcon: 'file-document-box',
          tabBarColor: '#C9E7F8'
        }}
      />
      <AppBottomTabs.Screen
        name="References"
        component={Contacts}
        options={{
          tabBarLabel: 'Справочники',
          tabBarIcon: 'view-list',
          tabBarColor: '#9FD5C9',
          tabBarBadge: true,
          title: 'Test'

        }}
      />
      <AppBottomTabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: 'settings-box',
          tabBarColor: '#FAD4D6'
        }}
      />
    </AppBottomTabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  buttons: {
    flexDirection: 'row',
    padding: 10
  },
  button: {
    margin: 8
  }
});
