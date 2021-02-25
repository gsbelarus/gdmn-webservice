import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import SubTitle from '../components/SubTitle';
import { IListItem } from '../model/types';
import {
  DocumentEditScreen,
  DocumentLineEditScreen,
  DocumentViewScreen,
  GoodListScreen,
  RemainsListScreen,
} from '../screens/App/Documents';
import {
  ScanBarcodeReaderScreen,
  ScanBarcodeScreen,
  SelectDateScreen,
  SelectItemScreen,
} from '../screens/App/Documents/components';
import {
  ReferenceDetailScreen,
  ReferenceViewScreen,
  RemainsContactListViewScreen,
  RemainsViewScreen,
} from '../screens/App/References';
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
    modeCor?: boolean;
  };
  DocumentView: { docId: number };
  GoodList: { docId: number };
  SelectDate: { formName: string; fieldName: string; title: string; value: string };
  SelectItem: {
    list: IListItem[];
    isMulti: boolean;
    formName: string;
    fieldName: string;
    title: string;
    value: number[];
  };
  RemainsList: { docId: number };
  ScanBarcode: { docId: number };
  ScanBarcodeReader: { docId: number };
  Reference: { docId: number };
  ReferenceDetail: undefined;
  RemainsContactList: undefined;
  RemainsView: undefined;
};

const LoadingScreen = () => {
  return (
    <View style={localStyles.content}>
      <ActivityIndicator size="large" style={localStyles.item} />
      <SubTitle style={localStyles.item}>Загрузка данных</SubTitle>
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
                  title: '',
                  animationTypeForReplace: 'pop',
                }}
              />
              <Stack.Screen
                key="DocumentView"
                name="DocumentView"
                component={DocumentViewScreen}
                initialParams={{ docId: 0 }}
                options={{ title: '', headerBackTitle: '' }}
              />
              <Stack.Screen
                key="DocumentEdit"
                name="DocumentEdit"
                component={DocumentEditScreen}
                options={{ title: '', headerBackTitle: 'Назад' }}
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
                options={{ title: '', headerBackTitle: 'Назад' }}
              />
              <Stack.Screen
                key="GoodListScreen"
                name="GoodList"
                component={GoodListScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                key="SelectItemScreen"
                name="SelectItem"
                component={SelectItemScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                key="SelectDateScreen"
                name="SelectDate"
                component={SelectDateScreen}
                options={{ headerShown: false }}
              />
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
              <Stack.Screen
                key="Reference"
                name="Reference"
                component={ReferenceViewScreen}
                options={{ title: '', headerBackTitle: 'Назад' }}
              />
              <Stack.Screen
                key="ReferenceDetail"
                name="ReferenceDetail"
                component={ReferenceDetailScreen}
                options={{ title: '', headerBackTitle: 'Назад' }}
              />
              <Stack.Screen
                key="RemainsView"
                name="RemainsView"
                options={{ title: '', headerBackTitle: 'Назад' }}
                component={RemainsViewScreen}
              />
              <Stack.Screen
                key="RemainsContactList"
                name="RemainsContactList"
                component={RemainsContactListViewScreen}
                options={{ title: '', headerBackTitle: 'Назад' }}
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
