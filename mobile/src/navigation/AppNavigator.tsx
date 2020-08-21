import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef } from 'react';

import { HeaderRight } from '../components/HeaderRight';
import { IListItem } from '../model';
import { ProductDetailScreen, CreateDocumentScreen, ProductsListScreen } from '../screens/App/Documents';
import { ICreateDocumentRef } from '../screens/App/Documents/CreateDocument';
import { IProductDetailsRef } from '../screens/App/Documents/ProductDetails';
import {
  SellProductDetailScreen,
  CreateSellDocumentScreen,
  SellProductsListScreen,
  BoxingDetailScreen,
  SettingsGettingDocumentScreen,
  SettingsSearchScreen,
  SelectBoxingsScreen,
} from '../screens/App/SellDocuments';
import { IBoxingDetailsRef } from '../screens/App/SellDocuments/BoxingDetails';
import { ISellProductDetailsRef } from '../screens/App/SellDocuments/ProductDetails';
import { ISelectBoxingsRef } from '../screens/App/SellDocuments/SelectBoxings';
import { SelectDateScreen } from '../screens/App/SellDocuments/SelectDate';
import { SelectItemScreen } from '../screens/App/SellDocuments/SelectItem';
import { ISettingsSearchRef } from '../screens/App/SellDocuments/SettingsSearch';
import { AppStoreProvider } from '../store';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
  BottomTabs: undefined;
  ProductDetail: { prodId: number; docId: number; modeCor: boolean; quantity?: string; batchNumber?: string };
  CreateDocument: { docId?: number };
  ProductsList: { docId: number };
  SellProductDetail: {
    lineId: string;
    prodId: number;
    docId: number;
    modeCor: boolean;
    quantity?: string;
    batchNumber?: string;
  };
  CreateSellDocument: {
    docId: number;
    // [fieldName: string]: (number | string)[] | number;
    [fieldName: string]: unknown;
  };
  SellProductsList: { docId: number };
  BoxingDetail: {
    boxingId: number;
    lineId: string;
    docId: number;
    prodId: number;
    modeCor: boolean;
    quantity: string;
    batchNumber: string;
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
    quantity: string;
    batchNumber: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const prodRef = useRef<IProductDetailsRef>(null);
  const docRef = useRef<ICreateDocumentRef>(null);

  const ProductDetailsComponent = (props) => {
    return <ProductDetailScreen {...props} ref={prodRef} />;
  };

  const CreateDocumentComponent = (props) => {
    return <CreateDocumentScreen {...props} ref={docRef} />;
  };

  const prodSellRef = useRef<ISellProductDetailsRef>(null);
  // const docSellRef = useRef<ICreateSellDocumentRef>(null);
  const boxingSellRef = useRef<IBoxingDetailsRef>(null);

  const settingsSearchRef = useRef<ISettingsSearchRef>(null);
  const selectBoxingsRef = useRef<ISelectBoxingsRef>(null);

  const SellProductDetailsComponent = (props) => {
    return <SellProductDetailScreen {...props} ref={prodSellRef} />;
  };

  /*   const CreateSellDocumentComponent = (props) => {
    return <CreateSellDocumentScreen {...props} ref={docSellRef} />;
  }; */

  const BoxingDetailsComponent = (props) => {
    return <BoxingDetailScreen {...props} ref={boxingSellRef} />;
  };

  // const SettingsGettingDocumentComponent = (props) => {
  //   return <SettingsGettingDocumentScreen {...props} ref={settingsGettingDocumentRef} />;
  // };

  const SettingsSearchComponent = (props) => {
    return <SettingsSearchScreen {...props} ref={settingsSearchRef} />;
  };

  const SelectBoxingsComponent = (props) => {
    return <SelectBoxingsScreen {...props} ref={selectBoxingsRef} />;
  };

  /*   const SelectItemComponent = (props) => {
    return <SelectItemScreen {...props} ref={prodSellRef} />;
  };
 */
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
        <Stack.Screen
          key="ProductDetail"
          name="ProductDetail"
          component={ProductDetailsComponent}
          initialParams={{ prodId: 0 }}
          options={({ route, navigation }) => ({
            title: '',
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  navigation.navigate('ViewDocument', { docId: route.params.docId });
                }}
              />
            ),
            headerRight: () => (
              <HeaderRight
                text="Готово"
                onPress={() => {
                  prodRef.current?.done();
                  navigation.navigate('ViewDocument', { docId: route.params.docId });
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          key="CreateDocument"
          name="CreateDocument"
          component={CreateDocumentComponent}
          options={({ navigation }) => ({
            title: '',
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  navigation.navigate('DocumentsListScreen');
                }}
              />
            ),
            headerRight: () => (
              <HeaderRight
                text="Готово"
                onPress={() => {
                  docRef.current?.done();
                }}
              />
            ),
          })}
        />
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
        />
        <Stack.Screen
          key="SellProductDetail"
          name="SellProductDetail"
          component={SellProductDetailsComponent}
          initialParams={{ lineId: '0', prodId: 0 }}
          options={({ route, navigation }) => ({
            title: '',
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  prodSellRef.current?.cancel();
                  navigation.navigate('ViewSellDocument', { docId: route.params.docId });
                }}
              />
            ),
            headerRight: () => (
              <HeaderRight
                text="Готово"
                onPress={() => {
                  prodSellRef.current?.done();
                  navigation.navigate('ViewSellDocument', { docId: route.params.docId });
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          key="CreateSellDocument"
          name="CreateSellDocument"
          component={CreateSellDocumentScreen}
          options={{ title: '' }}
          /* options={({ navigation }) => ({
            title: '',
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  navigation.navigate('SellDocumentsListScreen');
                }}
              />
            ),
            headerRight: () => (
              <HeaderRight
                text="Готово"
                onPress={() => {
                  docSellRef.current?.done();
                }}
              />
            ),
          })} */
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
        <Stack.Screen
          key="BoxingDetail"
          name="BoxingDetail"
          component={BoxingDetailsComponent}
          options={({ route, navigation }) => ({
            title: '',
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  navigation.navigate('SelectBoxingsScreen', route.params.prodId);
                }}
              />
            ),
            headerRight: () => (
              <HeaderRight
                text="Готово"
                onPress={() => {
                  boxingSellRef.current?.done();
                  navigation.navigate('SelectBoxingsScreen', route.params.prodId);
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          key="SettingsGettingDocument"
          name="SettingsGettingDocument"
          component={SettingsGettingDocumentScreen}
          options={{ title: '' }}
          // options={({ navigation }) => ({
          //   title: '',
          //   headerLeft: () => (
          //     <HeaderRight
          //       text="Отмена"
          //       onPress={() => {
          //         navigation.navigate('SellDocuments');
          //       }}
          //     />
          //   ),
          //   headerRight: () => (
          //     <HeaderRight
          //       text="Готово"
          //       onPress={() => {
          //         settingsGettingDocumentRef.current?.done();
          //         navigation.navigate('SellDocuments');
          //       }}
          //     />
          //   ),
          // })}
        />
        <Stack.Screen
          key="SettingsSearchScreen"
          name="SettingsSearchScreen"
          component={SettingsSearchComponent}
          options={({ navigation }) => ({
            title: '',
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  navigation.navigate('SellDocuments');
                }}
              />
            ),
            headerRight: () => (
              <HeaderRight
                text="Готово"
                onPress={() => {
                  settingsSearchRef.current?.done();
                  navigation.navigate('SellDocuments');
                }}
              />
            ),
          })}
        />
        <Stack.Screen key="SelectItem" name="SelectItemScreen" options={{ title: '' }} component={SelectItemScreen} />
        <Stack.Screen key="SelectDate" name="SelectDateScreen" options={{ title: '' }} component={SelectDateScreen} />
        <Stack.Screen
          key="SelectBoxingsScreen"
          name="SelectBoxingsScreen"
          component={SelectBoxingsComponent}
          options={({ navigation, route }) => ({
            title: '',
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
                  selectBoxingsRef.current?.cancel();
                  navigation.navigate('SellProductDetail', route.params);
                }}
              />
            ),
            headerRight: () => (
              <HeaderRight
                text="Готово"
                onPress={() => {
                  navigation.navigate('SellProductDetail', route.params);
                }}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </AppStoreProvider>
  );
};

export default AppNavigator;
