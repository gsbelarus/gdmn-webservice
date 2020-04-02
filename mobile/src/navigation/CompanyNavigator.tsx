import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { CompaniesScreen } from '../screens/App/CompaniesScreen';

type CompanyStackParamList = {
  SelecteCompany: undefined;
};

const Stack = createStackNavigator<CompanyStackParamList>();

const CompanyNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen key="SelecteCompany" name="SelecteCompany" component={CompaniesScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default CompanyNavigator;
