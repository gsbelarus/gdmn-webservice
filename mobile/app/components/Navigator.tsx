import ActivationPage from './ActivationPage';
import MainPage from './MainPage';
import MessagePage from './MessagePage';
import SendMessagePage from './SendMessagePage';
import LoginPage from './LoginPage';
import DocumentPage from './DocumentPage';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AuthNavigator = createStackNavigator(
    {
        LoginPage: LoginPage,
    }
);

const ActivationNavigator = createStackNavigator(
    {
        ActivationPage: {
            screen: ActivationPage,
            navigationOptions: { title: 'GDMN'}
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
        MessagePage: {
            screen: MessagePage,
            navigationOptions: { title: 'GDMN'}
        },
        SendMessagePage: {
            screen: SendMessagePage,
            navigationOptions: {  }
        },
        DocumentPage: {
            screen: DocumentPage,
            navigationOptions: {  }
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
