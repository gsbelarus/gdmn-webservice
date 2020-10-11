import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ReferenceDetailScreen, ViewReferenceScreen, ReferenceListScreen, RemainsContactsViewScreen, RemainsViewScreen } from '../screens/App/References';

type ReferenceStackParamList = {
  ReferenceList: undefined;
  Reference: { docId: number };
  ReferenceDetail: undefined;
  Remains: undefined;
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
      <Stack.Screen key="Reference" name="Reference" component={ViewReferenceScreen} options={{ title: '' }} />
      <Stack.Screen
        key="ReferenceDetail"
        name="ReferenceDetail"
        component={ReferenceDetailScreen}
        options={{ title: '' }}
      />
      <Stack.Screen key="RemainsView" name="RemainsView" options={{ title: 'Остатки ТМЦ' }} component={RemainsViewScreen}/>
      <Stack.Screen key="Remains" name="Remains" component={RemainsContactsViewScreen} options={{ title: 'Остатки ТМЦ' }} />
    </Stack.Navigator>
  );
};

export default ReferencesNavigator;
