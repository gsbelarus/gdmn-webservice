import React from 'react';
import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { authApi } from '../api/auth';
import { timeout, createCancellableSignal } from '../helpers/utils';
import { useStore } from '../store';
import ReferencesList from '../screens/App/References/ReferencesList';
import ViewReference from '../screens/App/References/ViewReference';
import DetailsReference from '../screens/App/References/DetailsReference';

import config from '../config/index';

type ReferenceStackParamList = {
  ReferencesList: undefined;
  ViewReference: undefined;
  DetailsReference: undefined;
};

const Stack = createStackNavigator<ReferenceStackParamList>();

const ReferencesNavigator = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen key="ReferencesList" name="ReferencesList" component={ReferencesList} options={{ headerShown: false }} />
      <Stack.Screen key="ViewReference" name="ViewReference" component={ViewReference} options={{ headerShown: false }} />
      <Stack.Screen key="DetailsReference" name="DetailsReference" component={DetailsReference} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
