import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { SellDocumentsListScreen, ViewSellDocumentScreen, HeadSellDocumentScreen } from '../screens/App/SellDocuments';

export type DocumentStackParamList = {
  SellDocumentsListScreen: undefined;
  ViewSellDocument: { docId: number };
  HeadSellDocument: { docId: number };
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
        options={{ title: '', animationTypeForReplace: 'pop' }}
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
