import * as React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Title, Button } from 'react-native-paper';
import { useStore } from '../../store';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { createStackNavigator } from '@react-navigation/stack';
import Contacts from './DocumentList';
import { Settings } from './Settings';

type AppStackParams = {
  Documents: undefined;
  References: undefined;
  Settings: undefined;
};

type SimpleStackParams = {
  Article: { author: string };
  NewsFeed: undefined;
  Album: undefined;
};

const SimpleStack = createStackNavigator<SimpleStackParams>();

type Props = Partial<React.ComponentProps<typeof SimpleStack.Navigator>> & {
  navigation: StackNavigationProp<ParamListBase>;
};

const SimpleStackScreen = ({ navigation, ...rest }: Props) => {
  navigation.setOptions({
    headerShown: true
  });
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Article', { author: 'Babel fish' })}
          style={styles.button}
        >
          Добавить
        </Button>
        <Button mode="outlined" onPress={() => navigation.pop(2)} style={styles.button}>
          Pop by 2
        </Button>
      </View>
    </ScrollView>
  );
};
const AppBottomTabs = createMaterialBottomTabNavigator<AppStackParams>();

// const DocumentsScreen = ({ navigation, ...rest }: Props) => <Text>Documents</Text>;
// const ReferencesScreen = ({ navigation, ...rest }: Props) => <Text>References</Text>;
// const SettingsScreen = ({ navigation, ...rest }: Props) => <Text>Settings</Text>;

export const MainScreen = () => {
  return (
    <AppBottomTabs.Navigator barStyle={styles.tabBar}>
      <AppBottomTabs.Screen
        name="Documents"
        options={{
          tabBarLabel: 'Документы',
          tabBarIcon: 'file-document-box',
          tabBarColor: '#C9E7F8'
        }}
      >
        {props => <SimpleStackScreen {...props} headerMode="none" />}
      </AppBottomTabs.Screen>
      <AppBottomTabs.Screen
        name="References"
        component={Contacts}
        options={{
          tabBarLabel: 'Справочники',
          tabBarIcon: 'message-reply',
          tabBarColor: '#9FD5C9',
          tabBarBadge: true
        }}
      />
      <AppBottomTabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Настройки',
          tabBarIcon: 'image-album',
          tabBarColor: '#FAD4D6'
        }}
      />
    </AppBottomTabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white'
  },
  buttons: {
    flexDirection: 'row',
    padding: 8
  },
  button: {
    margin: 8
  }
});
