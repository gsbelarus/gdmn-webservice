import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import DocumentsNavigator from './DocumentsNavigator';
import ReferencesNavigator from './ReferencesNavigator';
import SettingsNavigator from './SettingsNavigator';
import SellDocumentsNavigator from './SellDocumentsNavigator';

type TabsStackParams = {
  Documents: undefined;
  References: undefined;
  Settings: undefined;
  SellDocuments: undefined;
};

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  return (
    <TabsStack.Navigator barStyle={styles.tabBar}>
      <TabsStack.Screen
        name="SellDocuments"
        component={SellDocumentsNavigator}
        options={{
          title: 'Отвес-накладные',
          tabBarLabel: 'Отвесы',
          tabBarIcon: 'file-document-box',
          tabBarColor: '#CEE7E3',
        }}
      />
      <TabsStack.Screen
        name="Documents"
        component={DocumentsNavigator}
        options={{
          title: 'Документы',
          tabBarLabel: 'Документы',
          tabBarIcon: 'file-document-box',
          tabBarColor: '#C9E7F8',
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
