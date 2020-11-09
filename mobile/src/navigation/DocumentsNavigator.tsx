import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { IListItem } from '../model/types';
import {
  DocumentEditScreen,
  DocumentViewScreen,
  DocumentListScreen,
  DocumentLineEditScreen,
  GoodGroupListScreen,
  GoodListScreen,
  DocumentRequestScreen,
  FilterEditScreen,
} from '../screens/App/Documents';
import { InfoContactScreen } from '../screens/App/Documents/InfoContact';
import {
  ScanBarcodeScreen,
  ScanBarcodeScreen2,
  SelectDateScreen,
  SelectItemScreen,
} from '../screens/App/Documents/components/';

export type DocumentStackParamList = {
  DocumentList: undefined;
  DocumentEdit: { docId: number };
  DocumentView: { docId: number };
  FilterEdit: undefined;
  InfoContact: undefined;
  DocumentLineEdit: { docId: number; prodId: number; lineId: number };
  GoodGroupList: { docId: number };
  GoodList: { docId: number; group: number };
  DocumentRequest: undefined;
  SelectItem: {
    formName: string;
    fieldName: string;
    title: string;
    isMulti?: boolean;
    list: IListItem[];
    value: number[];
  };
  SelectDate: {
    formName: string;
    fieldName: string;
    title: string;
    value: string;
  };
  ScanBarcode: {
    docId: number;
  };
  ScanBarcode2: {
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
      <Stack.Screen key="InfoContact" name="InfoContact" component={InfoContactScreen} options={{ title: '' }} />
      <Stack.Screen
        key="GoodGroupList"
        name="GoodGroupList"
        component={GoodGroupListScreen}
        options={{ title: 'Группа товаров' }}
      />
      <Stack.Screen key="GoodList" name="GoodList" component={GoodListScreen} options={{ title: '' }} />
      <Stack.Screen
        key="DocumentLineEdit"
        name="DocumentLineEdit"
        component={DocumentLineEditScreen}
        options={{ title: '' }}
      />
      <Stack.Screen key="FilterEdit" name="FilterEdit" component={FilterEditScreen} options={{ title: '' }} />
      <Stack.Screen
        key="DocumentRequest"
        name="DocumentRequest"
        component={DocumentRequestScreen}
        options={{ title: 'Загрузить документы' }}
      />
      <Stack.Screen key="SelectItem" name="SelectItem" options={{ title: '' }} component={SelectItemScreen} />
      <Stack.Screen key="SelectDate" name="SelectDate" options={{ title: '' }} component={SelectDateScreen} />
      <Stack.Screen key="ScanBarCodeScreen" name="ScanBarcode" component={ScanBarcodeScreen} />
      <Stack.Screen key="ScanBarCodeScreen2" name="ScanBarcode2" component={ScanBarcodeScreen2} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
