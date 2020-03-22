import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import TabsNavigator from './TabsNavigator';

type RootStackParamList = {
  BottomTabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        key="BottomTabs"
        name="BottomTabs"
        component={TabsNavigator}
        options={{
          headerShown: false,
          // title: 'Mobile inventory',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
