import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

/* import config from '../config';
import DocumentsNavigator from './DocumentsNavigator'; */
import ReferencesNavigator from './ReferencesNavigator';
import SellDocumentsNavigator from './SellDocumentsNavigator';
import SettingsNavigator from './SettingsNavigator';

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
          tabBarIcon: ({ color }) => <TabBarIcon name="file-document-box-multiple" color={color} />,
        }}
      />
      {/* <TabsStack.Screen
        name="Documents"
        component={config.system[0].component === 'DocumentsNavigator' ? DocumentsNavigator : undefined}
        options={{
          title: config.system[0].options.title,
          tabBarLabel: config.system[0].options.tabBarLabel,
          tabBarIcon: config.system[0].options.tabBarIcon,
          tabBarColor: config.system[0].options.tabBarColor,
        }}
      /> */}
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
