import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import {
  DocumentsListScreen,
  ViewDocumentScreen,
  HeadDocumentScreen,
  CreateDocumentScreen,
} from '../screens/App/Documents';

export type DocumentStackParamList = {
  DocumentsListScreen: undefined;
  ViewDocument: { docId: number };
  HeadDocument: { docId: number };
  CreateDocument: { docId?: number };
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
      <Stack.Screen
        key="CreateDocument"
        name="CreateDocument"
        component={CreateDocumentScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
