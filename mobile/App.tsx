import React from 'react';
import { ScrollView, AsyncStorage, YellowBox, Platform, StatusBar, I18nManager } from 'react-native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperLightTheme,
  DarkTheme as PaperDarkTheme,
  Appbar,
  List,
  Divider
} from 'react-native-paper';
import {
  InitialState,
  useLinking,
  NavigationContainerRef,
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native';
import { StoreProvider } from './src/store';
import { ConnectionScreen } from './src/screens/Auth';

const App = () => {
  const containerRef = React.useRef<NavigationContainerRef>();
  const [theme, setTheme] = React.useState(DefaultTheme);
  const [initialState, setInitialState] = React.useState<InitialState | undefined>();

  const paperTheme = React.useMemo(() => {
    const t = theme.dark ? PaperDarkTheme : PaperLightTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...theme.colors,
        surface: theme.colors.card,
        accent: theme.dark ? 'rgb(255, 55, 95)' : 'rgb(255, 45, 85)'
      }
    };
  }, [theme.colors, theme.dark]);

  return (
    <StoreProvider>
      <PaperProvider theme={paperTheme}>
        {Platform.OS === 'ios' && <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />}
        <NavigationContainer ref={containerRef} initialState={initialState} onStateChange={state => {}} theme={theme}>
          <ConnectionScreen />
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
