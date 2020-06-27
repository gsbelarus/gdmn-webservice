import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef } from 'react';

import { ProductDetailScreen, CreateDocumentScreen, ProductsListScreen } from '../screens/App/Documents';
import { ICreateDocumentRef } from '../screens/App/Documents/CreateDocument';
import { IProductDetailsRef } from '../screens/App/Documents/ProductDetails';
import { AppStoreProvider } from '../store';
import TabsNavigator from './TabsNavigator';
import { HeaderRight } from '../components/HeaderRight';

export type RootStackParamList = {
  BottomTabs: undefined;
  ProductDetail: { prodId: number; docId: number; modeCor: boolean };
  CreateDocument: { docId?: number };
  ProductsList: { docId: number };
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
            headerLeft: () => <HeaderRight text="Отмена" onPress={() => {
              navigation.navigate('ViewDocument', { docId: route.params.docId });
            }} />,
            headerRight: () => <HeaderRight text="Готово" onPress={() => {
              prodRef.current?.done();
              navigation.navigate('ViewDocument', { docId: route.params.docId });
            }} />,
          })}
        />
        <Stack.Screen
          key="CreateDocument"
          name="CreateDocument"
          component={CreateDocumentComponent}
          options={({ navigation }) => ({
            title: '',
            headerLeft: () => <HeaderRight text="Отмена" onPress={() => {
              navigation.navigate('DocumentsListScreen');
            }} />,
            headerRight: () => <HeaderRight text="Готово" onPress={() => {
              docRef.current?.done();
            }} />,
          })}
        />
        <Stack.Screen
          key="ProductsList"
          name="ProductsList"
          component={ProductsListScreen}
          options={({ route, navigation }) => ({
            title: 'Товары',
            headerLeft: () => <HeaderRight text="Отмена" onPress={() => {
              navigation.navigate('ViewDocument', { docId: route.params.docId });
            }} />,
          })}
        />
      </Stack.Navigator>
    </AppStoreProvider>
  );
};

export default AppNavigator;
