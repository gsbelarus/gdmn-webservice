import { InitialState, NavigationContainerRef, NavigationContainer, DefaultTheme } from '@react-navigation/native';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperLightTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

import { ConnectionScreen } from './src/screens/Auth/ConnectionScreen';
import { AuthStoreProvider, ApiStoreProvider } from './src/store';

const App = () => {
  const containerRef = React.useRef<NavigationContainerRef>();
  const [theme] = React.useState(DefaultTheme);
  const [initialState] = React.useState<InitialState | undefined>();

  const paperTheme = React.useMemo(() => {
    const t = theme.dark ? PaperDarkTheme : PaperLightTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...theme.colors,
        surface: theme.colors.card,
        accent: theme.dark ? 'rgb(255, 55, 95)' : 'rgb(255, 45, 85)',
      },
    };
  }, [theme.colors, theme.dark]);

  return (
    <ApiStoreProvider>
      <AuthStoreProvider>
        <PaperProvider theme={paperTheme}>
          {Platform.OS === 'ios' && <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />}
          <NavigationContainer
            ref={containerRef}
            initialState={initialState}
            theme={theme}
            /* onStateChange={state => {}} */
          >
            <ConnectionScreen />
          </NavigationContainer>
        </PaperProvider>
      </AuthStoreProvider>
    </ApiStoreProvider>
  );
};

export default App;
