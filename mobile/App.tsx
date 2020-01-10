import React, { useEffect, useState } from 'react';
import Navigator from './app/components/Navigator'
import Constants from 'expo-constants';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

type TStartState = 'SIGN_OUT' | 'NO_ACTIVATION' | 'LOG_IN';
export const path = 'http://192.168.0.63:3649/api/';

const App = () => {
  const [signedIn, setSignedIn] = useState<TStartState>('NO_ACTIVATION');
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const isExistDevice = async () => {
      const data = await fetch(
        `${path}device/isExist?uid=${Constants.deviceId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }
      ).then(res => res.json());
      data.status === 200 && data.result ? setSignedIn('SIGN_OUT') : undefined;
      if (data.status === 200 && data.result) {
        const getMe = await fetch(
          `${path}me`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
          }
        ).then(res => res.json());
        setSignedIn(getMe.status === 200 && getMe.result !== 'not authenticated' ? 'LOG_IN' : 'SIGN_OUT');
      }
      setLoading(false);
    }

    isExistDevice();
  }, [])

  const Layout = Navigator(signedIn);

  return loading
  ? <View style={styles.container}>
    <ActivityIndicator size='large' color='#70667D' />
  </View>
  : <Layout/>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3EFF4',
    justifyContent: 'center'
  }
})

export default App;
