import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import {
  DocumentsListScreen,
  ViewDocumentScreen,
  HeadDocumentScreen,
  CreateDocumentScreen,
  ProductsListScreen,
  ProductDetailScreen,
} from '../screens/App/Documents';

export type DocumentStackParamList = {
  DocumentsListScreen: undefined;
  ViewDocument: { docId: number };
  HeadDocument: { docId: number };
  CreateDocument: { docId?: number };
  ProductsList: { docId: number };
  ProductDetail: { prodId: number; docId: number, modeCor: boolean };
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
      <Stack.Screen
        key="ProductsList"
        name="ProductsList"
        component={ProductsListScreen}
        options={{ title: 'Товары' }}
      />
      <Stack.Screen
        key="ProductDetail"
        name="ProductDetail"
        component={ProductDetailScreen}
        initialParams={{ prodId: 0 }}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
