import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import SubTitle from '../components/SubTitle';
import {
  DocumentEditScreen,
  DocumentLineEditScreen,
  DocumentViewScreen,
  FilterEditScreen,
  RemainsListScreen,
} from '../screens/App/Documents';
import { ScanBarcodeReaderScreen, ScanBarcodeScreen } from '../screens/App/Documents/components';
import { AppStoreProvider, useServiceStore } from '../store';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
  DocumentList: undefined;
  LoadingScreen: undefined;
  DocumentEdit: { docId: number };
  DocumentLineEdit: {
    docId: number;
    prodId: number;
    quantity?: number;
    lineId?: number;
    price?: number;
    remains?: number;
  };
  DocumentView: { docId: number };
  RemainsList: { docId: number };
  ScanBarcode: { docId: number };
  ScanBarcodeReader: { docId: number };
  FilterEdit: undefined;
};

const LoadingScreen = () => {
  return (
    <View style={localStyles.content}>
      <ActivityIndicator size="large" style={localStyles.item} />
      <SubTitle styles={localStyles.item}>Загрузка данных</SubTitle>
    </View>
  );
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {
    state: { isLoading: isAppDataLoading },
  } = useServiceStore();

  return (
    <AppStoreProvider>
      <BottomSheetModalProvider>
        <Stack.Navigator>
          {isAppDataLoading ? (
            <Stack.Screen
              key="LoadingScreen"
              name="LoadingScreen"
              component={LoadingScreen}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <>
              <Stack.Screen
                key="DocumentList"
                name="DocumentList"
                component={TabsNavigator}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                key="DocumentView"
                name="DocumentView"
                component={DocumentViewScreen}
                initialParams={{ docId: 0 }}
                options={{ title: '', animationTypeForReplace: 'pop' }}
              />
              <Stack.Screen
                key="DocumentEdit"
                name="DocumentEdit"
                component={DocumentEditScreen}
                options={{ title: '' }}
              />
              <Stack.Screen
                key="RemainsList"
                name="RemainsList"
                component={RemainsListScreen}
                options={{ title: '', headerBackTitle: 'Назад' }}
              />
              <Stack.Screen
                key="DocumentLineEdit"
                name="DocumentLineEdit"
                component={DocumentLineEditScreen}
                options={{ title: '' }}
              />
              <Stack.Screen key="FilterEdit" name="FilterEdit" component={FilterEditScreen} options={{ title: '' }} />
              <Stack.Screen
                key="ScanBarCodeScreen"
                name="ScanBarcode"
                component={ScanBarcodeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                key="ScanBarcodeReaderScreen"
                name="ScanBarcodeReader"
                component={ScanBarcodeReaderScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </BottomSheetModalProvider>
    </AppStoreProvider>
  );
};

const localStyles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    paddingVertical: 10,
  },
});

export default AppNavigator;
