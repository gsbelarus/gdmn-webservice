import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import {
  DocumentEditScreen,
  FilterEditScreen,
  DocumentViewScreen,
  DocumentListScreen,
  ProductEditScreen,
} from '../screens/App/Documents';

export type DocumentStackParamList = {
  DocumentList: undefined;
  DocumentEdit: { docId: number };
  DocumentView: { docId: number };
  FilterEdit: undefined;
  ProductEdit: { docId: number; prodId: number; lineId: number };
};

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DocumentList">
      <Stack.Screen
        key="DocumentList"
        name="DocumentList"
        component={DocumentListScreen}
        options={{ title: 'Документы' }}
      />
      <Stack.Screen
        key="DocumentView"
        name="DocumentView"
        component={DocumentViewScreen}
        initialParams={{ docId: 0 }}
        options={{ title: '', animationTypeForReplace: 'pop' }}
      />
      <Stack.Screen key="DocumentEdit" name="DocumentEdit" component={DocumentEditScreen} options={{ title: '' }} />
      <Stack.Screen key="FilterEdit" name="FilterEdit" component={FilterEditScreen} options={{ title: '' }} />
      <Stack.Screen key="ProductEdit" name="ProductEdit" component={ProductEditScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
