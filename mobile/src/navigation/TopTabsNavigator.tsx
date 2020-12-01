import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

import { DocumentListScreen } from '../screens/App/Documents/DocumentList';

export type TopTabsStackParams = {
  CurrentDocumentsList: undefined;
  ArchiveDocumentsList: { status: number };
};

const TopTabsStack = createMaterialTopTabNavigator<TopTabsStackParams>();

const TopTabsNavigator = () => {
  return (
    <TopTabsStack.Navigator initialRouteName={'CurrentDocumentsList'} swipeEnabled>
      <TopTabsStack.Screen
        name="CurrentDocumentsList"
        component={DocumentListScreen}
        options={{
          tabBarLabel: 'Текущие',
        }}
      />
      <TopTabsStack.Screen
        name="ArchiveDocumentsList"
        component={DocumentListScreen}
        initialParams={{ status: 5 }}
        options={{
          tabBarLabel: 'Архив',
        }}
      />
    </TopTabsStack.Navigator>
  );
};

export default TopTabsNavigator;
