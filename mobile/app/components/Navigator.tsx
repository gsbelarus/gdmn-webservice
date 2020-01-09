import ActivationPage from './ActivationPage';
import ProfilePage from './ProfilePage';
import LoginPage from './LoginPage';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AuthNavigator = createStackNavigator(
    {
        ActivationPage: ActivationPage,
        LoginPage: LoginPage
    }
);

const AppNavigator = createStackNavigator(
    {
        ProfilePage: ProfilePage
    }
);

const createRootNavigator = (signedIn: boolean) => {
    return createAppContainer(createSwitchNavigator(
        {
            App: AppNavigator,
            Auth: AuthNavigator
        },
        {
            initialRouteName: signedIn ? 'App' : 'Auth'
        }
    ))
};

export default createRootNavigator;
