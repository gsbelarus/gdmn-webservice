import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useLayoutEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import { IContact, IDebt } from '../../../../../common/base';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
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

const InfoContactScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { state } = useAppStore();

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
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
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
        Информация по организации
      </SubTitle>
      <Line field="number" title={'Дата договора'} value={contact?.contractDate || 'Нет информации'} />
      <Line field="number" title={'Способ оплаты'} value={contact?.paycond || 'Нет информации'} />
      <Line field="number" title={'Задолженность'} value={debt?.saldo ? debt.saldo.toString() : '0'} />
      <Line
        field="number"
        title={'Просроченная задолженность'}
        value={debt?.saldodebt ? debt.saldodebt.toString() : '0'}
      />
    </View>
  );
};

export { InfoContactScreen };

const localeStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  title: {
    padding: 10,
  },
});
