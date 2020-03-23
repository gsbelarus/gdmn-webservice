import { useTheme } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { TextInput, Text, Button, ActivityIndicator } from 'react-native-paper';

import { authApi } from '../../api/auth';
import SubTitle from '../../components/SubTitle';
import { timeout } from '../../helpers/utils';
import { IServerResponse, IDataFetch } from '../../model';
import { useStore } from '../../store';
import styles from '../../styles/global';

const ActivationScreen = () => {
  const { actions } = useStore();
  const { colors } = useTheme();

  const [serverReq, setServerReq] = useState<IDataFetch>({ isLoading: false, isError: false, status: undefined });
  const [serverResp, setServerResp] = useState<IServerResponse<boolean | string>>(undefined);

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (serverReq?.isLoading) {
      timeout(5000, authApi.verifyActivationCode(inputValue))
        .then((data: IServerResponse<string>) => setServerResp({ result: data.result, status: data.status }))
        .catch((err: Error) => setServerReq({ isLoading: false, isError: true, status: err.message }));
    }
  }, [inputValue, serverReq]);

  useEffect(() => {
    if (serverResp === undefined) {
      return;
    }

    if (serverResp.status === 404) {
      setServerReq({ isLoading: false, isError: true, status: 'Неверный код' });
      return;
    }

    timeout(5000, authApi.addDevice({ uid: Constants.deviceId, userId: serverResp.result as string }))
      .then((data: IServerResponse<string>) => {
        if (data.status === 404) {
          setServerReq({ isLoading: false, isError: true, status: data.result as string });
          setInputValue('');
          return;
        }
        actions.setDeviceStatus(true);
      })
      .catch((err: Error) => {
        console.log(JSON.stringify(err.message));
        setServerReq({ isLoading: false, isError: true, status: err.message });
      });
  }, [actions, serverResp]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <SubTitle>Активация устройства</SubTitle>
        <View style={{ ...localeStyles.statusBox, backgroundColor: colors.background }}>
          {serverReq.isError && <Text style={localeStyles.errorText}>Ошибка: {serverReq.status}</Text>}
          {serverReq.isLoading && <ActivityIndicator size="large" color="#70667D" />}
        </View>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Введите код"
          placeholderTextColor={'#9A9FA1'}
          autoCapitalize="sentences"
          underlineColorAndroid="transparent"
          selectionColor={'black'}
          maxLength={50}
          returnKeyType="done"
          autoCorrect={false}
          keyboardType="decimal-pad"
          // blurOnSubmit={true}
          // onSubmitEditing={verifyCode}
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        />
        <Button
          mode="contained"
          disabled={serverReq.isLoading}
          icon={'login'}
          onPress={() => setServerReq({ isLoading: true, isError: false, status: '' })}
          style={styles.rectangularButton}
        >
          Отправить
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const localeStyles = StyleSheet.create({
  buttons: {
    width: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#cc5933',
    fontSize: 18,
  },
  statusBox: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
  },
});

export { ActivationScreen };
