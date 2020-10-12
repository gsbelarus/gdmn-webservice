import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import {
  ReferenceDetailScreen,
  ReferenceViewScreen,
  ReferenceListScreen,
  RemainsContactListViewScreen,
  RemainsViewScreen,
} from '../screens/App/References';

type ReferenceStackParamList = {
  ReferenceList: undefined;
  Reference: { docId: number };
  ReferenceDetail: undefined;
  RemainsContactList: undefined;
  RemainsContactsView: undefined;
  RemainsView: undefined;
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
      <Stack.Screen key="Reference" name="Reference" component={ReferenceViewScreen} options={{ title: '' }} />
      <Stack.Screen
        key="ReferenceDetail"
        name="ReferenceDetail"
        component={ReferenceDetailScreen}
        options={{ title: '' }}
      />
      <Stack.Screen key="RemainsView" name="RemainsView" options={{ title: '' }} component={RemainsViewScreen} />
      <Stack.Screen
        key="RemainsContactList"
        name="RemainsContactList"
        component={RemainsContactListViewScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
