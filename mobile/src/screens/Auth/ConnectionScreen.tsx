import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import config from '../../config';
import { IBaseUrl } from '../../model';
import AuthNavigator from '../../navigation/AuthNavigator';
import { useStore } from '../../store';

const ConnectionScreen = () => {
  const { state, actions } = useStore();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (state.baseUrl !== undefined) {
      return;
    }

    const setBaseURL = async () => {
      let pathSrv: IBaseUrl = JSON.parse(await AsyncStorage.getItem('pathServer'));
      if (!(pathSrv instanceof Object && 'protocol' in pathSrv)) {
        pathSrv = undefined;
      }

      const url: IBaseUrl = state.baseUrl ||
        pathSrv || {
          protocol: config.server.protocol,
          server: config.server.name,
          port: config.server.port,
          apiPath: config.apiPath,
        };

      AsyncStorage.setItem('pathServer', JSON.stringify(url))
        .then(() => actions.setBaseUrl(url))
        .catch(() => setLoading(false));
    };

    setBaseURL();
  }, [actions, state.baseUrl]);

  useEffect(() => {
    if (state.baseUrl !== undefined) {
      setLoading(false);
    }
  }, [state.baseUrl]);

  if (isLoading) {
    return <ActivityIndicator style={{flex: 1, justifyContent: 'center'}} size="large" color="#70667D" />;
  }

  return <AuthNavigator />;
};

export { ConnectionScreen };
