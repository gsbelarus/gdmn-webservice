import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

import DocumentsNavigator from './DocumentsNavigator';
import LocationNavigator from './LocationNavigator';
import ReferencesNavigator from './ReferencesNavigator';
import SettingsNavigator from './SettingsNavigator';

export type TabsStackParams = {
  Documents: undefined;
  References: undefined;
  Location: undefined;
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
          title: 'Документы',
          tabBarLabel: 'Документы',
          tabBarIcon: ({ color }) => <TabBarIcon name="file-document-box-multiple" color={color} />,
        }}
      />
      <TabsStack.Screen
        name="References"
        component={ReferencesNavigator}
        options={{
          tabBarLabel: 'Справочники',
          tabBarIcon: ({ color }) => <TabBarIcon name="view-list" color={color} />,
          // tabBarBadge: true,
        }}
      />
      <TabsStack.Screen
        name="Location"
        component={LocationNavigator}
        options={{
          tabBarLabel: 'Геолокация',
          tabBarIcon: ({ color }) => <TabBarIcon name="compass-outline" color={color} />,
          // tabBarBadge: true,
        }}
      />
      <TabsStack.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings-box" color={color} />,
        }}
      />
    </TabsStack.Navigator>
  );
};

function TabBarIcon(props: { name: string; color: string }) {
  return <MaterialCommunityIcons size={26} {...props} />;
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default TabsNavigator;
