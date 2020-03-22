import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { DocumentsListScreen, ViewDocumentScreen, HeadDocumentScreen } from '../screens/App/Documents';

export type DocumentStackParamList = {
  DocumentsListScreen: undefined;
  ViewDocument: { docId: number };
  HeadDocument: undefined;
};

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DocumentsListScreen">
      <Stack.Screen
        key="DocumentsList"
        name="DocumentsListScreen"
        component={DocumentsListScreen}
        options={{ title: 'Документы' }}
      />
      <Stack.Screen
        key="ViewDocument"
        name="ViewDocument"
        component={ViewDocumentScreen}
        initialParams={{ docId: 0 }}
        options={{ title: '' }}
      />
      <Stack.Screen key="HeadDocument" name="HeadDocument" component={HeadDocumentScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
