import { Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import {
  SellDocumentsListScreen,
  ViewSellDocumentScreen,
  HeadSellDocumentScreen,
  CreateSellDocumentScreen,
  ProductsListScreen,
  ProductDetailScreen,
} from '../screens/App/SellDocuments';

export type DocumentStackParamList = {
  SellDocumentsListScreen: undefined;
  ViewSellDocument: { docId: number };
  HeadSellDocument: { docId: number };
  CreateSellDocument: { docId?: number };
  ProductsList: { docId: number };
  ProductDetail: { lineId: number; prodId: number; docId: number; modeCor: boolean };
};

const Stack = createStackNavigator<DocumentStackParamList>();

const SellDocumentsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SellDocumentsListScreen">
      <Stack.Screen
        key="SellDocumentsList"
        name="SellDocumentsListScreen"
        component={SellDocumentsListScreen}
        options={{ title: 'Документы' }}
      />
      <Stack.Screen
        key="ViewSellDocument"
        name="ViewSellDocument"
        component={ViewSellDocumentScreen}
        initialParams={{ docId: 0 }}
        options={({ navigation }) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              style={localeStyles.marginLeft}
              onPress={() => {
                navigation.navigate('SellDocumentsListScreen');
              }}
            >
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        key="HeadSellDocument"
        name="HeadSellDocument"
        component={HeadSellDocumentScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        key="CreateSellDocument"
        name="CreateSellDocument"
        component={CreateSellDocumentScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        key="ProductsList"
        name="ProductsList"
        component={ProductsListScreen}
        options={{ title: 'Товары' }}
      />
      <Stack.Screen
        key="ProductDetail"
        name="ProductDetail"
        component={ProductDetailScreen}
        initialParams={{ lineId: 0, prodId: 0 }}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default SellDocumentsNavigator;

const localeStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 15,
  },
});
