import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { LocationScreen } from '../screens/App/LocationScreen';

type LocationStackParamList = {
  Location: undefined;
};

const Stack = createStackNavigator<LocationStackParamList>();

const LocationNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen key="Location" name="Location" component={LocationScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default LocationNavigator;
