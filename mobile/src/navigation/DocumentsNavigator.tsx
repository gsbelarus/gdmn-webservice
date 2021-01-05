import { Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { DocumentsListScreen, ViewDocumentScreen, HeadDocumentScreen } from '../screens/App/Documents';

export type DocumentStackParamList = {
  DocumentsListScreen: undefined;
  ViewDocument: { docId: number };
  HeadDocument: { docId: number };
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
              style={localStyles.marginLeft}
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
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;

const localStyles = StyleSheet.create({
  marginLeft: {
    marginLeft: 15,
  },
});
