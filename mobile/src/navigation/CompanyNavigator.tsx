import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { SettingsScreen } from '../screens/App/SettingsScreen';

type CompanyStackParamList = {
  SelecteCompany: undefined;
};

const Stack = createStackNavigator<CompanyStackParamList>();

const CompanyNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen key="SelecteCompany" name="SelecteCompany" component={SettingsScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default CompanyNavigator;
