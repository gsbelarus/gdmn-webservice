import { Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { SellDocumentsListScreen, ViewSellDocumentScreen, HeadSellDocumentScreen } from '../screens/App/SellDocuments';
import { IViewSellDocumentRef } from '../screens/App/SellDocuments/ViewSellDocument';

export type DocumentStackParamList = {
  SellDocumentsListScreen: undefined;
  ViewSellDocument: { docId: number };
  HeadSellDocument: { docId: number };
};

const Stack = createStackNavigator<DocumentStackParamList>();

const SellDocumentsNavigator = () => {
  const viewSellDocumentRef = useRef<IViewSellDocumentRef>(null);

  const ViewSellDocumentComponent = (props) => {
    return <ViewSellDocumentScreen {...props} ref={viewSellDocumentRef} />;
  };

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
        component={ViewSellDocumentComponent}
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
          headerRight: () => viewSellDocumentRef.current?.menu(),
        })}
      />
      <Stack.Screen
        key="HeadSellDocument"
        name="HeadSellDocument"
        component={HeadSellDocumentScreen}
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
