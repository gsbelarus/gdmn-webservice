import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { IListItem } from '../model/types';
import {
  DocumentEditScreen,
  DocumentViewScreen,
  DocumentListScreen,
  ProductEditScreen,
  ProductListScreen,
  DocumentRequestScreen,
  FilterEditScreen,
} from '../screens/App/Documents';
import { ScanBarCodeScreen, SelectDateScreen, SelectItemScreen } from '../screens/App/Documents/components/';

export type DocumentStackParamList = {
  DocumentList: undefined;
  DocumentEdit: { docId: number | { [name: string]: string } };
  DocumentView: { docId: number };
  FilterEdit: undefined;
  ProductEdit: { docId: number; prodId: number; lineId: number };
  ProductList: { docId: number };
  DocumentRequest: undefined;
  SelectItemScreen: {
    parentScreen: keyof DocumentStackParamList;
    fieldName: string;
    title: string;
    isMulti?: boolean;
    list: IListItem[];
    value: number[];
  };
  SelectDateScreen: { parentScreen: keyof DocumentStackParamList; fieldName: string; title: string; value: string };
  ScanBarCodeScreen: {
    docId: number;
  };
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
      <Stack.Screen key="ProductList" name="ProductList" component={ProductListScreen} options={{ title: '' }} />
      <Stack.Screen key="ProductEdit" name="ProductEdit" component={ProductEditScreen} options={{ title: '' }} />
      <Stack.Screen key="FilterEdit" name="FilterEdit" component={FilterEditScreen} options={{ title: '' }} />
      <Stack.Screen
        key="DocumentRequest"
        name="DocumentRequest"
        component={DocumentRequestScreen}
        options={{ title: 'Загрузить документы' }}
      />
      <Stack.Screen key="SelectItem" name="SelectItemScreen" options={{ title: '' }} component={SelectItemScreen} />
      <Stack.Screen key="SelectDate" name="SelectDateScreen" options={{ title: '' }} component={SelectDateScreen} />
      <Stack.Screen key="ScanBarCodeScreen" name="ScanBarCodeScreen" component={ScanBarCodeScreen} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
