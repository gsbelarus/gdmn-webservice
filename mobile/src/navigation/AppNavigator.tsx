import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import SubTitle from '../components/SubTitle';
import { AppStoreProvider, useServiceStore } from '../store';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
  BottomTabs: undefined;
  LoadingScreen: undefined;
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
            <Stack.Screen
              key="BottomTabs"
              name="BottomTabs"
              component={TabsNavigator}
              options={{
                headerShown: false,
              }}
            />
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
