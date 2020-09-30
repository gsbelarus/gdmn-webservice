import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// import { HeaderRight } from '../components/HeaderRight';
import { IListItem } from '../model/types';
/* import {
  DocumentListScreen,
  DocumentEditScreen,
  ,
  DocumentRequest,
  FilterEditScreen,
} from '../screens/App/Documents';
 */
import { ScanBarCodeScreen, SelectDateScreen, SelectItemScreen } from '../screens/App/Documents/components/';
import { AppStoreProvider } from '../store';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
  BottomTabs: undefined;
  SelectItemScreen: {
    parentScreen: keyof RootStackParamList;
    fieldName: string;
    title: string;
    isMulti?: boolean;
    list: IListItem[];
    value: number[];
  };
  SelectDateScreen: { parentScreen: keyof RootStackParamList; fieldName: string; title: string; value: string };
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
        {/*  <Stack.Screen
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
        /> */}
        {/* <Stack.Screen
          key="SellProductsList"
          name="SellProductsList"
          component={ProductListScreen}
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
        */}
        {/* <Stack.Screen
          key="SettingsGettingDocument"
          name="SettingsGettingDocument"
          component={DocumentRequest}
          options={{ title: '' }}
        />
         */}
        <Stack.Screen key="SelectItem" name="SelectItemScreen" options={{ title: '' }} component={SelectItemScreen} />
        <Stack.Screen key="SelectDate" name="SelectDateScreen" options={{ title: '' }} component={SelectDateScreen} />
        <Stack.Screen key="ScanBarCodeScreen" name="ScanBarCodeScreen" component={ScanBarCodeScreen} />
      </Stack.Navigator>
    </AppStoreProvider>
  );
};

export default AppNavigator;
