import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { IListItem } from '../model/types';
import { SelectItemScreen } from '../screens/App/Documents/components';

export type RemainsStackParamList = {
  RemainsView: undefined;
  SelectItem: {
    formName: string;
    fieldName: string;
    title: string;
    isMulti?: boolean;
    list: IListItem[];
    value: number;
  };
};

const Stack = createStackNavigator<RemainsStackParamList>();

const RemainsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="RemainsView">
      <Stack.Screen key="SelectItem" name="SelectItem" options={{ title: '' }} component={SelectItemScreen}/>
    </Stack.Navigator>
  );
};

export default RemainsNavigator;
