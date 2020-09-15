import { AsyncStorage } from 'react-native';
import Reactotron, { asyncStorage } from 'reactotron-react-native';

/* export const rc = Reactotron.configure()
  .use(asyncStorage({ ignore: [] })) // <--- here we go!
  .connect(); */
// Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: 'Demo App',
    host: '192.168.0.49',
    port: 9090,
  }) // controls connection & communication settings
  .use(asyncStorage({ ignore: [] }))
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

// Reactotron.onCustomCommand('appStore', () => console.log('test'));
