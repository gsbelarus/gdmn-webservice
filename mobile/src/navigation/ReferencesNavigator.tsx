import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { DetailsReferenceScreen, ViewReferenceScreen, ReferencesListScreen } from '../screens/App/References';

type ReferenceStackParamList = {
  ReferencesList: undefined;
  ViewReference: {docId: number};
  DetailsReference: undefined;
};

const Stack = createStackNavigator<ReferenceStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReferencesList">
      <Stack.Screen
        key="ReferencesList"
        name="ReferencesList"
        component={ReferencesListScreen}
        options={{ title: 'Справочники' }}
      />
      <Stack.Screen key="ViewReference" name="ViewReference" component={ViewReferenceScreen} options={{ title: '' }} />
      <Stack.Screen
        key="DetailsReference"
        name="DetailsReference"
        component={DetailsReferenceScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
