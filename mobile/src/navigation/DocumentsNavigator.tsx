import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { IListItem } from '../model/types';
import {
  DocumentEditScreen,
  DocumentViewScreen,
  DocumentListScreen,
  DocumentLineEditScreen,
  GoodListScreen,
  DocumentRequestScreen,
  FilterEditScreen,
} from '../screens/App/Documents';
import { ScanBarcodeScreen, SelectDateScreen, SelectItemScreen } from '../screens/App/Documents/components/';

export type DocumentStackParamList = {
  //DocumentList: undefined;
  DocumentEdit: { docId: number };
  DocumentView: { docId: number };
  FilterEdit: undefined;
  DocumentLineEdit: { docId: number; prodId: number; lineId: number };
  GoodList: { docId: number };
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
};

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DocumentView">
      <Stack.Screen
        key="DocumentView"
        name="DocumentView"
        component={DocumentViewScreen}
        initialParams={{ docId: 0 }}
        options={{ title: '', animationTypeForReplace: 'pop' }}
      />
      <Stack.Screen key="DocumentEdit" name="DocumentEdit" component={DocumentEditScreen} options={{ title: '' }} />
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
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
