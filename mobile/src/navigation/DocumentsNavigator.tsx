import { Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import {
  DocumentsListScreen,
  ViewDocumentScreen,
  HeadDocumentScreen,
  CreateDocumentScreen,
  ProductsListScreen,
} from '../screens/App/Documents';

export type DocumentStackParamList = {
  DocumentsListScreen: undefined;
  ViewDocument: { docId: number };
  HeadDocument: { docId: number };
  CreateDocument: { docId?: number };
  ProductsList: { docId: number };
};

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DocumentsListScreen">
      <Stack.Screen
        key="DocumentsList"
        name="DocumentsListScreen"
        component={DocumentsListScreen}
        options={{ title: 'Документы' }}
      />
      <Stack.Screen
        key="ViewDocument"
        name="ViewDocument"
        component={ViewDocumentScreen}
        initialParams={{ docId: 0 }}
        options={({ navigation }) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              style={localeStyles.marginLeft}
              onPress={() => {
                navigation.navigate('DocumentsListScreen');
              }}
            >
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen key="HeadDocument" name="HeadDocument" component={HeadDocumentScreen} options={{ title: '' }} />
      <Stack.Screen
        key="CreateDocument"
        name="CreateDocument"
        component={CreateDocumentScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        key="ProductsList"
        name="ProductsList"
        component={ProductsListScreen}
        options={{ title: 'Товары' }}
      />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;

const localeStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 15,
  },
});
