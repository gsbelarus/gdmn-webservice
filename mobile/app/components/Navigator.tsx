import ActivationPage from './ActivationPage';
import ProfilePage from './ProfilePage';
import LoginPage from './LoginPage';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AuthNavigator = createStackNavigator(
    {
        LoginPage: LoginPage,
    }
);

const ActivationNavigator = createStackNavigator(
    {
        ActivationPage: ActivationPage,
    },
    {
        initialRouteName: 'ActivationPage'
    }
);

const AppNavigator = createStackNavigator(
    {
        ProfilePage: ProfilePage
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
