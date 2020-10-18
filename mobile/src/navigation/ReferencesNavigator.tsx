import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTheme } from 'react-native-paper';

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
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="ReferenceList"
      screenOptions={{ headerStyle: { backgroundColor: colors.background } }}
    >
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
        options={{ title: '', headerBackTitle: 'Назад' }}
      />
      <Stack.Screen
        key="RemainsView"
        name="RemainsView"
        options={{ title: '', headerBackTitle: 'Назад' }}
        component={RemainsViewScreen}
      />
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
