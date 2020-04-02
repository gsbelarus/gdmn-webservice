import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { SettingsScreen } from '../screens/App/SettingsScreen';

type SettingsStackParamList = {
  Settings: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen key="Settings" name="Settings" component={SettingsScreen} options={{ title: 'Настройки' }} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
