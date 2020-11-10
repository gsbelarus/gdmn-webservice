import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useLayoutEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';

import { IContact, IDebt, IOutlet } from '../../../../../common/base';
import SubTitle from '../../../components/SubTitle';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type Props = StackScreenProps<DocumentStackParamList, 'FilterEdit'>;

const Line = React.memo(({ field, title, value }: { field: string; title: string; value?: string }) => {
  const { colors } = useTheme();
  return (
    <TextInput
      key={field}
      label={title}
      value={value}
      mode={'flat'}
      editable={false}
      theme={{
        colors: {
          placeholder: colors.primary,
        },
      }}
      style={{
        backgroundColor: colors.card,
      }}
    />
  );
});

const InfoScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const route = useRoute<RouteProp<DocumentStackParamList, 'Info'>>();
  const { state } = useAppStore();

  const outlet = useMemo(() => {
    return (state.references?.outlets?.data as IOutlet[]).find(
      (item) => item.id === state.forms?.documentParams?.outletId,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.references?.contacts, state.forms?.documentParams]);
  const contact = useMemo(() => {
    return (state.references?.contacts?.data as IContact[]).find(
      (item) => item.id === state.forms?.documentParams?.contactId,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.references?.contacts, state.forms?.documentParams]);

  const debt = useMemo(() => {
    return (state.references?.debts?.data as IDebt[]).find(
      (item) => item.contactkey === state.forms?.documentParams?.contactId,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.references?.debts, state.forms?.documentParams]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Информация',
      headerLeft: () => (
        <IconButton
          icon="chevron-left"
          size={35}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        localeStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>
        {route.params?.about === 'Contact' ? 'Об организации' : 'О магазине'}
      </SubTitle>
      {route.params?.about === 'Contact' ? (
        <ScrollView>
          <Line field="date" title={'Дата договора'} value={contact?.contractDate || 'Нет информации'} />
          <Line field="paycond" title={'Способ оплаты'} value={contact?.paycond || 'Нет информации'} />
          <Line field="saldo" title={'Задолженность'} value={debt?.saldo ? debt.saldo.toString() : '0'} />
          <Line
            field="saldodebt"
            title={'Просроченная задолженность'}
            value={debt?.saldodebt ? debt.saldodebt.toString() : '0'}
          />
        </ScrollView>
      ) : (
        <ScrollView>
          <Line field="address" title={'Адрес'} value={outlet?.address || 'Нет информации'} />
          <Line field="phone" title={'Телефон'} value={outlet?.phoneNumber || 'Нет информации'} />
        </ScrollView>
      )}
    </View>
  );
};

export { InfoScreen };

const localeStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  title: {
    padding: 10,
  },
});
