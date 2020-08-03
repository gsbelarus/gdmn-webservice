import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef } from 'react';

import { HeaderRight } from '../components/HeaderRight';
import { ProductDetailScreen, CreateDocumentScreen, ProductsListScreen } from '../screens/App/Documents';
import { ICreateDocumentRef } from '../screens/App/Documents/CreateDocument';
import { IProductDetailsRef } from '../screens/App/Documents/ProductDetails';
/*import { HeaderRight } from '../components/HeaderRight';*/
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
import { ICreateSellDocumentRef } from '../screens/App/SellDocuments/CreateSellDocument';
import { ISellProductDetailsRef } from '../screens/App/SellDocuments/ProductDetails';
import { ISelectBoxingsRef } from '../screens/App/SellDocuments/SelectBoxings';
import { ISettingsGettingDocumentRef } from '../screens/App/SellDocuments/SettingsGettingDocument';
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
  CreateSellDocument: { docId?: number };
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
  SettingsGettingDocument: undefined;
  SettingsSearchScreen: undefined;
  SelectBoxingsScreen: {
    boxingId: number;
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
  const docSellRef = useRef<ICreateSellDocumentRef>(null);
  const boxingSellRef = useRef<IBoxingDetailsRef>(null);
  const settingsGettingDocumentRef = useRef<ISettingsGettingDocumentRef>(null);
  const settingsSearchRef = useRef<ISettingsSearchRef>(null);
  const selectBoxingsRef = useRef<ISelectBoxingsRef>(null);

  const SellProductDetailsComponent = (props) => {
    return <SellProductDetailScreen {...props} ref={prodSellRef} />;
  };

  const CreateSellDocumentComponent = (props) => {
    return <CreateSellDocumentScreen {...props} ref={docSellRef} />;
  };

  const BoxingDetailsComponent = (props) => {
    return <BoxingDetailScreen {...props} ref={boxingSellRef} />;
  };

  const SettingsGettingDocumentComponent = (props) => {
    return <SettingsGettingDocumentScreen {...props} ref={settingsGettingDocumentRef} />;
  };

  const SettingsSearchComponent = (props) => {
    return <SettingsSearchScreen {...props} ref={settingsSearchRef} />;
  };

  const SelectBoxingsComponent = (props) => {
    return <SelectBoxingsScreen {...props} ref={selectBoxingsRef} />;
  };

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
          component={CreateSellDocumentComponent}
          options={({ navigation }) => ({
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
          })}
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
                  navigation.navigate('SellProductDetail', {
                    prodId: route.params.prodId,
                    docId: route.params.docId,
                    modeCor: route.params.modeCor,
                    quantity: route.params.quantity,
                    batchNumber: route.params.batchNumber,
                  });
                }}
              />
            ),
            headerRight: () => (
              <HeaderRight
                text="Готово"
                onPress={() => {
                  boxingSellRef.current?.done();
                  navigation.navigate('SellProductDetail', {
                    prodId: route.params.prodId,
                    docId: route.params.docId,
                    modeCor: route.params.modeCor,
                    quantity: route.params.quantity,
                    batchNumber: route.params.batchNumber,
                  });
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          key="SettingsGettingDocument"
          name="SettingsGettingDocument"
          component={SettingsGettingDocumentComponent}
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
                  settingsGettingDocumentRef.current?.done();
                  navigation.navigate('SellDocuments');
                }}
              />
            ),
          })}
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
        <Stack.Screen
          key="SelectBoxingsScreen"
          name="SelectBoxingsScreen"
          component={SelectBoxingsComponent}
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
                  selectBoxingsRef.current?.done();
                  navigation.navigate('SellDocuments');
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
