import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { HeaderRight } from '../components/HeaderRight';
import { IListItem } from '../model';
// import { ProductDetailScreen, CreateDocumentScreen, ProductsListScreen } from '../screens/App/Documents';
import {
  SellProductDetailScreen,
  CreateSellDocumentScreen,
  SellProductsListScreen,
  BoxingDetailScreen,
  SettingsGettingDocumentScreen,
  SettingsSearchScreen,
  SelectBoxingsScreen,
} from '../screens/App/SellDocuments';
import { ScanBarCodeScreen } from '../screens/App/SellDocuments/ScanBarCode';
import { SelectDateScreen } from '../screens/App/SellDocuments/SelectDate';
import { SelectItemScreen } from '../screens/App/SellDocuments/SelectItem';
import { AppStoreProvider } from '../store';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
  BottomTabs: undefined;
  ProductDetail: {
    prodId: number;
    docId: number;
    modeCor: boolean;
    quantity?: string;
    batchNumber?: string;
  };
  CreateDocument: { docId?: number };
  ProductsList: { docId: number };
  SellProductDetail: {
    lineId: string;
    prodId: number;
    docId: number;
    modeCor: boolean;
    quantity?: string;
    batchNumber?: string;
    manufacturingDate?: string;
    weighedGood?: number;
  };
  CreateSellDocument: {
    docId: number;
    // [fieldName: string]: (number | string)[] | number;
    [fieldName: string]: unknown;
  };
  SellProductsList: { docId: number; weighedGood?: boolean };
  BoxingDetail: {
    boxingId: number;
    lineId: string;
    docId: number;
    prodId: number;
    modeCor: boolean;
  };
  SettingsSearchScreen: undefined;
  SettingsGettingDocument: {
    [fieldName: string]: number[] | Date | number | string;
  };
  SelectItemScreen: {
    parentScreen: keyof RootStackParamList;
    fieldName: string;
    title: string;
    isMulti?: boolean;
    list: IListItem[];
    value: number[];
  };
  SelectDateScreen: { parentScreen: keyof RootStackParamList; fieldName: string; title: string; value: string };
  SelectBoxingsScreen: {
    lineId: string;
    docId: number;
    prodId: number;
    modeCor: boolean;
  };
  ScanBarCodeScreen: {
    docId: number;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <AppStoreProvider>
      <Stack.Navigator>
        <Stack.Screen
          key="BottomTabs"
          name="BottomTabs"
          component={TabsNavigator}
          options={{
            headerShown: false,
            // title: 'Mobile inventory',
          }}
        />
        {/* <Stack.Screen
          key="ProductDetail"
          name="ProductDetail"
          component={ProductDetailScreen}
          initialParams={{ prodId: 0 }}
        />
        <Stack.Screen key="CreateDocument" name="CreateDocument" component={CreateDocumentScreen} />
        <Stack.Screen
          key="ProductsList"
          name="ProductsList"
          component={ProductsListScreen}
          options={({ route, navigation }) => ({
            title: 'Товары',
            headerTitleStyle: { alignSelf: 'center' },
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  navigation.navigate('ViewDocument', { docId: route.params.docId });
                }}
              />
            ),
          })}
        /> */}
        <Stack.Screen
          key="SellProductDetail"
          name="SellProductDetail"
          component={SellProductDetailScreen}
          initialParams={{ lineId: '0', prodId: 0 }}
          options={() => ({
            title: '',
          })}
        />
        <Stack.Screen
          key="CreateSellDocument"
          name="CreateSellDocument"
          component={CreateSellDocumentScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          key="SellProductsList"
          name="SellProductsList"
          component={SellProductsListScreen}
          options={({ route, navigation }) => ({
            title: 'Товары',
            headerTitleStyle: { alignSelf: 'center' },
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  navigation.navigate('ViewSellDocument', { docId: route.params.docId });
                }}
              />
            ),
          })}
        />
        <Stack.Screen key="BoxingDetail" name="BoxingDetail" component={BoxingDetailScreen} />
        <Stack.Screen
          key="SettingsGettingDocument"
          name="SettingsGettingDocument"
          component={SettingsGettingDocumentScreen}
          options={{ title: '' }}
        />
        <Stack.Screen key="SettingsSearchScreen" name="SettingsSearchScreen" component={SettingsSearchScreen} />
        <Stack.Screen key="SelectItem" name="SelectItemScreen" options={{ title: '' }} component={SelectItemScreen} />
        <Stack.Screen key="SelectDate" name="SelectDateScreen" options={{ title: '' }} component={SelectDateScreen} />
        <Stack.Screen key="SelectBoxingsScreen" name="SelectBoxingsScreen" component={SelectBoxingsScreen} />
        <Stack.Screen
          key="ScanBarCodeScreen"
          name="ScanBarCodeScreen"
          options={{ title: '' }}
          component={ScanBarCodeScreen}
        />
      </Stack.Navigator>
    </AppStoreProvider>
  );
};

export default AppNavigator;
