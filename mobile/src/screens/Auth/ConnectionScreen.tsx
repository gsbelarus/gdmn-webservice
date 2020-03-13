import React, { useState, useEffect } from 'react';
import { AsyncStorage, Text, ActivityIndicator } from 'react-native';
import { AppLoading } from 'expo';
import AuthNavigator from '../../navigation/AuthNavigator';
import { useStore } from '../../store';
import config from '../../config';
import { IBaseUrl } from '../../model';

export const ConnectionScreen = () => {
  const { state, actions } = useStore();
  const [isLoading, setLoading] = useState(true);

  const setBaseURL = async () => {
    let pathSrv: IBaseUrl = JSON.parse(await AsyncStorage.getItem('pathServer'));
    if (!(pathSrv instanceof Object && 'protocol' in pathSrv)) pathSrv = undefined;

    const url: IBaseUrl = state.baseUrl ||
      pathSrv || {
        protocol: config.server.protocol,
        server: config.server.name,
        port: config.server.port,
        apiPath: config.apiPath
      };

    AsyncStorage.setItem('pathServer', JSON.stringify(url)).then(() => actions.setBaseUrl(url));
  };

  useEffect(() => {
    if (state.baseUrl !== undefined) setLoading(false);
  }, [state.baseUrl]);

  if (isLoading) {
    return (
      <>
        <AppLoading onFinish={() => {}} startAsync={setBaseURL} onError={console.warn} />
        <ActivityIndicator size="large" color="#70667D" />
        <Text>state: {JSON.stringify(state.baseUrl)}</Text>
      </>
    );
  }

  return <AuthNavigator />;
};
