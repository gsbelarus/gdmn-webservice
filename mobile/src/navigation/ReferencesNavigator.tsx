import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ReferenceDetailScreen, ViewReferenceScreen, ReferenceListScreen } from '../screens/App/References';

type ReferenceStackParamList = {
  ReferenceList: undefined;
  Reference: { docId: number };
  ReferenceDetail: undefined;
};

const Stack = createStackNavigator<ReferenceStackParamList>();

const ReferencesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ReferenceList">
      <Stack.Screen
        key="ReferenceList"
        name="ReferenceList"
        component={ReferenceListScreen}
        options={{ title: 'Справочники' }}
      />
      <Stack.Screen key="Reference" name="Reference" component={ViewReferenceScreen} options={{ title: '' }} />
      <Stack.Screen
        key="ReferenceDetail"
        name="ReferenceDetail"
        component={ReferenceDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
