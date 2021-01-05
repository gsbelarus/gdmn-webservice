import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import SellDocumentsNavigator from './SellDocumentsNavigator';
import ReferencesNavigator from './ReferencesNavigator';
import SettingsNavigator from './SettingsNavigator';

export type TabsStackParams = {
  Documents: undefined;
  References: undefined;
  Settings: undefined;
  SellDocuments: undefined;
};

const TabsStack = createMaterialBottomTabNavigator<TabsStackParams>();

const TabsNavigator = () => {
  const { colors } = useTheme();
  return (
    <TabsStack.Navigator barStyle={[styles.tabBar, { backgroundColor: colors.background }]}>
      <TabsStack.Screen
        name="SellDocuments"
        component={SellDocumentsNavigator}
        options={{
          title: 'Документы',
          tabBarLabel: 'Документы',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={26} name="file-document-outline" color={color} />,
        }}
      />
      <TabsStack.Screen
        name="References"
        component={ReferencesNavigator}
        options={{
          tabBarLabel: 'Справочники',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={26} name="book-multiple-outline" color={color} />,
            tabBarBadge: false,
        }}
      />
      <TabsStack.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={26} name="cog-outline" color={color} />,
        }}
      />
    </TabsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
});

export default TabsNavigator;
