import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { DocumentsList, ViewDocument, HeadDocument } from '../screens/App/Documents/';


export type DocumentStackParamList = {
  DocumentsList: undefined;
  ViewDocument: { docId: number };
  HeadDocument: undefined;
};

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentsNavigator = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen key="DocumentsList" name="DocumentsList" component={DocumentsList} options={{ title: 'Документы' }} />
      <Stack.Screen key="ViewDocument" name="ViewDocument" component={ViewDocument} initialParams={{ docId: 0 }} options={{ title: '' }} />
      <Stack.Screen key="HeadDocument" name="HeadDocument" component={HeadDocument} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
