import React from 'react';
import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { authApi } from '../api/auth';
import { timeout, createCancellableSignal } from '../helpers/utils';
import { useStore } from '../store';
import DocumentsList from '../screens/App/Documents/DocumentsList';
import ViewDocument from '../screens/App/Documents/ViewDocument';
import HeadDocument from '../screens/App/Documents/HeadDocument';

import config from '../config/index';

type DocumentStackParamList = {
  DocumentsList: undefined;
  ViewDocument: undefined;
  HeadDocument: undefined;
};

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentsNavigator = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen key="DocumentsList" name="DocumentsList" component={DocumentsList} options={{ headerShown: false }} />
      <Stack.Screen key="ViewDocument" name="ViewDocument" component={ViewDocument} options={{ headerShown: false }} />
      <Stack.Screen key="HeadDocument" name="HeadDocument" component={HeadDocument} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default DocumentsNavigator;
