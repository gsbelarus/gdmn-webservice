import React from 'react';
import ActivationPage from './ActivationPage';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import DocumentPage from './DocumentPage';
import DocumentFilterPage from './DocumentFilterPage';
import DirectoryPage from './DirectoryPage';
import ProductPage from './ProductPage';
import { TouchableOpacity } from 'react-native';
import ProductsListPage from './ProductsListPage';
import AddProductToDocPage from './AddProductToDocPage';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AntDesign } from '@expo/vector-icons';

const AuthNavigator = createStackNavigator(
    {
        LoginPage: LoginPage,
    }
);

const ActivationNavigator = createStackNavigator(
    {
        ActivationPage: {
            screen: ActivationPage,
            navigationOptions: { title: 'GDMN', }
        },
    },
    {
        initialRouteName: 'ActivationPage'
    }
);

const AppNavigator = createStackNavigator(
    {
        MainPage: {
            screen: MainPage,
            navigationOptions: { title: 'GDMN' }
        },
        DocumentPage: {
            screen: DocumentPage,
            navigationOptions: ({navigation}) => ({
                headerRight: (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MainPage')}
                        style={{height: 50, width: 50, justifyContent: 'center'}}>
                            <AntDesign
                                size={25}
                                color='#FFF' 
                                name='home' 
                            />
                    </TouchableOpacity>
            )}  )
        },
        DocumentFilterPage: {
            screen: DocumentFilterPage,
            navigationOptions: ({navigation}) => ({
                headerRight: (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MainPage')}
                        style={{height: 50, width: 50, justifyContent: 'center'}}>
                            <AntDesign
                                size={25}
                                color='#FFF' 
                                name='home' 
                            />
                    </TouchableOpacity>
            )}  )
        },
        DirectoryPage: {
            screen: DirectoryPage,
            navigationOptions: ({navigation}) => ({
                headerRight: (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MainPage')}
                        style={{height: 50, width: 50, justifyContent: 'center'}}>
                            <AntDesign
                                size={25}
                                color='#FFF' 
                                name='home' 
                            />
                    </TouchableOpacity>
            )}  )
        },
        ProductPage: {
            screen: ProductPage,
            navigationOptions: ({navigation}) => ({
                headerRight: (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MainPage')}
                        style={{height: 50, width: 50, justifyContent: 'center'}}>
                            <AntDesign
                                size={25}
                                color='#FFF' 
                                name='home' 
                            />
                    </TouchableOpacity>
            )}  )
        },
        ProductsListPage: {
            screen: ProductsListPage,
            navigationOptions: ({navigation}) => ({
                headerRight: (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MainPage')}
                        style={{height: 50, width: 50, justifyContent: 'center'}}>
                            <AntDesign
                                size={25}
                                color='#FFF' 
                                name='home' 
                            />
                    </TouchableOpacity>
                ),
            })
        },
        AddProductToDocPage: {
            screen: AddProductToDocPage,
            params: {id: 0},
            navigationOptions: ({navigation}) => ({
                headerRight: (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MainPage')}
                        style={{height: 50, width: 50, justifyContent: 'center'}}>
                            <AntDesign
                                size={25}
                                color='#FFF' 
                                name='home' 
                            />
                    </TouchableOpacity>
            )}  )
        }
    },
    {
        initialRouteName: 'MainPage',
        defaultNavigationOptions: {
          headerStyle: {
            backgroundColor: '#000088',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
    }
);

const createRootNavigator = (state: string) => {
    return createAppContainer(createSwitchNavigator(
        state === 'NO_ACTIVATION'
        ? {
            App: AppNavigator,
            Auth: AuthNavigator,
            Activ: ActivationNavigator
        }
        : {
            App: AppNavigator,
            Auth: AuthNavigator
        },
        {
            initialRouteName: state === 'NO_ACTIVATION' ? 'Activ' : state === 'LOG_IN' ? 'App' : 'Auth'
        }
    ))
};

export default createRootNavigator;
