import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import config from '../config';
import DocumentsNavigator from './DocumentsNavigator';
import ReferencesNavigator from './ReferencesNavigator';
import SettingsNavigator from './SettingsNavigator';

type TabsStackParams = {
  Documents: undefined;
  References: undefined;
  Settings: undefined;
};

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  return (
    <TabsStack.Navigator barStyle={styles.tabBar}>
      <TabsStack.Screen
        name="Documents"
        component={config.system[0].component === 'DocumentsNavigator' ? DocumentsNavigator : undefined}
        options={{
          title: config.system[0].options.title,
          tabBarLabel: config.system[0].options.tabBarLabel,
          tabBarIcon: config.system[0].options.tabBarIcon,
          tabBarColor: config.system[0].options.tabBarColor,
        }}
      />
      <TabsStack.Screen
        name="References"
        component={ReferencesNavigator}
        options={{
          tabBarLabel: 'Справочники',
          tabBarIcon: 'view-list',
          tabBarColor: '#9FD5C9',
          tabBarBadge: true,
          title: 'Test',
        }}
      />
      <TabsStack.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: 'Настройки',
          tabBarLabel: 'Настройки',
          tabBarIcon: 'settings-box',
          tabBarColor: '#FAD4D6',
        }}
      />
    </TabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    padding: 10,
  },
  tabBar: {
    backgroundColor: 'white',
  },
});

export default TabsNavigator;
