import React, { useState, useEffect } from 'react';
import { AsyncStorage, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { IBaseUrl } from '../../../../common';
import config from '../../config';
import AuthNavigator from '../../navigation/AuthNavigator';
import { useApiStore } from '../../store';

const ConnectionScreen = () => {
  const {
    state: { serverUrl },
    actions,
    api,
  } = useApiStore();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (serverUrl !== undefined) {
      return;
    }

    const setBaseURL = async () => {
      let pathSrv: IBaseUrl = JSON.parse(await AsyncStorage.getItem('pathServer'));
      if (!(pathSrv instanceof Object && 'protocol' in pathSrv)) {
        pathSrv = undefined;
      }

      const url: IBaseUrl = serverUrl ||
        pathSrv || {
          protocol: config.server.protocol,
          server: config.server.name,
          port: config.server.port,
          apiPath: config.apiPath,
        };

      AsyncStorage.setItem('pathServer', JSON.stringify(url))
        .then(() => {
          actions.setServerUrl(url);
        })
        .catch(() => setLoading(false));
    };

    setBaseURL();
  }, [actions, api, serverUrl]);

  useEffect(() => {
    if (serverUrl !== undefined) {
      api.setUrl(serverUrl);
      setLoading(false);
    }
  }, [api, serverUrl]);

  if (isLoading) {
    return <ActivityIndicator style={localStyles.container} size="large" color="#70667D" />;
  }

  return <AuthNavigator />;
};

export { ConnectionScreen };

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
