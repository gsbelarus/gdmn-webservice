import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { FAB } from 'react-native-paper';

import { IResponse } from '../../../../common';
import { IMessageInfo } from '../../../../common/models';
import { timeout } from '../../helpers/utils';
import { SettingsStackParamList } from '../../navigation/SettingsNavigator';
import { useAuthStore, useServiceStore } from '../../store';

type Props = StackScreenProps<SettingsStackParamList, 'CompanyConfig'>;

const CompanyConfigScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state } = useAuthStore();

  const sendUpdateRequest = useCallback(() => {
    timeout(
      apiService.baseUrl.timeout,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_config',
          params: [],
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Запрос отправлен!', '', [{ text: 'Закрыть' }]);
        } else {
          Alert.alert('Запрос не был отправлен', '', [{ text: 'Закрыть' }]);
        }
      })
      .catch((err: Error) => Alert.alert('Ошибка!', err.message, [{ text: 'Закрыть' }]));
  }, [apiService.baseUrl.timeout, apiService.data, state.companyID]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View />
      </ScrollView>
      <FAB
        style={[localStyles.fabSync, { backgroundColor: colors.primary }]}
        icon="sync"
        onPress={() => {
          sendUpdateRequest();
        }}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  content: {
    flex: 1,
    height: '100%',
  },
  fabSync: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
});

export { CompanyConfigScreen };
