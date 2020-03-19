import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Settings } from '../screens/App/Settings';
import Contacts from '../screens/App/References';
import DocumentsNavigator from './DocumentsNavigator';

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
        component={DocumentsNavigator}
        options={{
          tabBarLabel: 'Документы',
          tabBarIcon: 'file-document-box',
          tabBarColor: '#C9E7F8'
        }}
      />
      <TabsStack.Screen
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
      <TabsStack.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: 'settings-box',
          tabBarColor: '#FAD4D6'
        }}
      />
    </TabsStack.Navigator>
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

export default TabsNavigator;
