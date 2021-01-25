import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron, { asyncStorage } from 'reactotron-react-native';

import config from '../config';

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: 'Demo App',
    host: config.server.name,
    port: 9090,
  }) // controls connection & communication settings
  .use(asyncStorage({ ignore: [] }))
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

Reactotron.onCustomCommand('appStore', () => {
  console.log('appStore');
  // console.log(AsyncStorage.getAllKeys());
  AsyncStorage.getAllKeys().then((res) => Reactotron.log(res));
});
