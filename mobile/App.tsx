import React, { useEffect, useState } from 'react';
import Navigator from './app/components/Navigator'

const App = () => {
  const [signedIn, setSignedIn] = useState(false);

  useEffect( () => {
    const fetchData = async () => {
      const data = await fetch(
        'http://192.168.0.63:3649/api/me',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }
      ).then(res => res.json());
      setSignedIn(data.status === 200 && data.result !== 'not authenticated')
    }

    fetchData();
  }, [])

  const Layout = Navigator(signedIn);

  return <Layout />;
}

export default App;
