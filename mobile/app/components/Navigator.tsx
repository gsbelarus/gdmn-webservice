import Main from '../Main';
import LoginPage from './LoginPage';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Navigator = createStackNavigator(
    {
        Main: Main,
        LoginPage: LoginPage
    }
);

const AppContainer = createAppContainer(Navigator);

export default AppContainer;