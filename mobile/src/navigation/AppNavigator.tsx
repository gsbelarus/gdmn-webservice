import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { ProductDetailScreen, CreateDocumentScreen, ProductsListScreen } from '../screens/App/Documents';
import { ICreateDocumentRef } from '../screens/App/Documents/CreateDocument';
import { IProductDetailsRef } from '../screens/App/Documents/ProductDetails';
import { AppStoreProvider } from '../store';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
  BottomTabs: undefined;
  ProductDetail: { prodId: number; docId: number; modeCor: boolean };
  CreateDocument: { docId?: number };
  ProductsList: { docId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();
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
            headerLeft: () => (
              <TouchableOpacity
                style={localeStyles.marginLeft}
                onPress={() => {
                  navigation.navigate('ViewDocument', { docId: route.params.docId });
                }}
              >
                <Text style={[localeStyles.name, { color: colors.primary }]}>Отмена</Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={localeStyles.marginRight}
                onPress={() => {
                  prodRef.current?.done();
                  navigation.navigate('ViewDocument', { docId: route.params.docId });
                }}
              >
                <Text style={[localeStyles.name, { color: colors.primary }]}>Готово</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={localeStyles.marginLeft}
                onPress={() => {
                  navigation.navigate('DocumentsListScreen');
                }}
              >
                <Text style={[localeStyles.name, { color: colors.primary }]}>Отмена</Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={localeStyles.marginRight}
                onPress={() => {
                  docRef.current?.done();
                }}
              >
                <Text style={[localeStyles.name, { color: colors.primary }]}>Готово</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={localeStyles.marginLeft}
                onPress={() => {
                  navigation.navigate('ViewDocument', { docId: route.params.docId });
                }}
              >
                <Text style={[localeStyles.name, { color: colors.primary }]}>Отмена</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </AppStoreProvider>
  );
};

export default AppNavigator;

const localeStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 15,
  },
  marginRight: {
    marginRight: 15,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
