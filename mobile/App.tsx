import React, { useEffect, useState } from 'react';
import Navigator from './app/components/Navigator'
import Constants from 'expo-constants';

type TStartState = 'SIGN_OUT' | 'NO_ACTIVATION' | 'LOG_IN';

const App = () => {
  const [signedIn, setSignedIn] = useState<TStartState>('NO_ACTIVATION');

  useEffect( () => {
    const isExistDevice = async () => {
      console.log('is exist?')
      const data = await fetch(
        `http://192.168.0.63:3649/api/device/isExist?uid=${Constants.deviceId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }
      ).then(res => res.json());
      data.status === 200 && data.result ? setSignedIn('SIGN_OUT') : undefined;
      console.log(data.status === 200 && data.result)
      return data.status === 200 && data.result;
    }

    const fetchData = async () => {
      console.log('is login?')
      const data = await fetch(
        'http://192.168.0.63:3649/api/me',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }
      ).then(res => res.json());
      setSignedIn(data.status === 200 && data.result !== 'not authenticated' ? 'LOG_IN' : 'SIGN_OUT')
    }
    isExistDevice()
  }, [])

  useEffect( () => {
    if(signedIn !== 'NO_ACTIVATION') {
      const fetchData = async () => {
        console.log('is login?')
        const data = await fetch(
          'http://192.168.0.63:3649/api/me',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
          }
        ).then(res => res.json());
        setSignedIn(data.status === 200 && data.result !== 'not authenticated' ? 'LOG_IN' : 'SIGN_OUT')
      }
      fetchData();
    }
  }, [])

  const Layout = Navigator(signedIn);

  return <Layout />;
}

export default App;
