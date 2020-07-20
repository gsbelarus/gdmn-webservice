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
} from '../screens/App/SellDocuments';
import { IBoxingDetailsRef } from '../screens/App/SellDocuments/BoxingDetails';
import { ICreateSellDocumentRef } from '../screens/App/SellDocuments/CreateSellDocument';
import { ISellProductDetailsRef } from '../screens/App/SellDocuments/ProductDetails';
import { AppStoreProvider } from '../store';
import TabsNavigator from './TabsNavigator';
export type RootStackParamList = {
  BottomTabs: undefined;
  ProductDetail: { prodId: number; docId: number; modeCor: boolean; quantity?: string };
  CreateDocument: { docId?: number };
  ProductsList: { docId: number };
  SellProductDetail: { lineId: number; prodId: number; docId: number; modeCor: boolean };
  CreateSellDocument: { docId?: number };
  SellProductsList: { docId: number };
  BoxingDetail: { boxingId: number; lineId: number; docId: number; prodId: number; modeCor: boolean; quantity: string };
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

  const SellProductDetailsComponent = (props) => {
    return <SellProductDetailScreen {...props} ref={prodSellRef} />;
  };

  const CreateSellDocumentComponent = (props) => {
    return <CreateSellDocumentScreen {...props} ref={docSellRef} />;
  };

  const BoxingDetailsComponent = (props) => {
    return <BoxingDetailScreen {...props} ref={boxingSellRef} />;
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
          initialParams={{ lineId: 0, prodId: 0 }}
          options={({ route, navigation }) => ({
            title: '',
            headerLeft: () => (
              <HeaderRight
                text="Отмена"
                onPress={() => {
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
                  });
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
