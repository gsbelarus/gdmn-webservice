import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BackdropExample from '../components/BackdropExample';

import { IListItem } from '../model/types';
import {
  DocumentEditScreen,
  DocumentViewScreen,
  DocumentListScreen,
  DocumentLineEditScreen,
  DocumentRequestScreen,
  FilterEditScreen,
  RemainsListScreen,
} from '../screens/App/Documents';
import {
  ScanBarcodeScreen,
  SelectDateScreen,
  SelectItemScreen,
  ScanBarcodeReaderScreen,
} from '../screens/App/Documents/components/';

export type DocumentStackParamList = {
  DocumentList: undefined;
  DocumentEdit: { docId: number };
  DocumentView: { docId: number };
  FilterEdit: undefined;
  DocumentLineEdit: {
    docId: number;
    prodId: number;
    quantity?: number;
    lineId?: number;
    price?: number;
    remains?: number;
  };
  GoodList: { docId: number };
  RemainsList: { docId: number };
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
  ScanBarcodeReader: {
    docId: number;
  };
  BackdropExample: undefined;
};

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentsNavigator = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="DocumentList"
      screenOptions={{ headerStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen
        key="BackdropExample"
        name="BackdropExample"
        component={BackdropExample}
        options={{
          title: 'Test',
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen
        key="DocumentList"
        name="DocumentList"
        component={DocumentListScreen}
        options={{
          title: 'Документы',
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen
        key="DocumentView"
        name="DocumentView"
        component={DocumentViewScreen}
        initialParams={{ docId: 0 }}
        options={{ title: '', animationTypeForReplace: 'pop' }}
      />
      <Stack.Screen key="DocumentEdit" name="DocumentEdit" component={DocumentEditScreen} options={{ title: '' }} />
      <Stack.Screen
        key="RemainsList"
        name="RemainsList"
        component={RemainsListScreen}
        options={{ title: '', headerBackTitle: 'Назад' }}
      />
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
      <Stack.Screen
        key="ScanBarCodeScreen"
        name="ScanBarcode"
        component={ScanBarcodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        key="ScanBarcodeReaderScreen"
        name="ScanBarcodeReader"
        component={ScanBarcodeReaderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
