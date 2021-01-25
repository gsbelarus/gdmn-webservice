import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useScrollToTop } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { IDocument, IContact } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { statuses } from '../../../constants';
import { ISellDocument, ISellHead } from '../../../model';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type TField = {
  title: string;
  value: string | number;
};

const FieldItem = React.memo(({ item }: { item: TField }) => {
  const { colors } = useTheme();

  return (
    <View style={[localStyles.item, { backgroundColor: colors.card }]}>
      <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
        <MaterialCommunityIcons name="information-variant" size={20} color={'#FFF'} />
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.title, localStyles.container, { color: colors.text }]}>{item.title}</Text>
        <Text style={[localStyles.value, localStyles.fieldName, { color: colors.text }]}>{item.value}</Text>
      </View>
    </View>
  );
});

const HeadSellDocumentScreen = ({ route }) => {
  const ref = React.useRef<FlatList<TField>>(null);
  const { state } = useAppStore();
  const document: ISellDocument | IDocument | undefined = state.documents.find(
    (item) => item.id === Number(route.params.docId),
  );
  const contactTo: IContact = state.contacts.find((item) => item.id === document?.head.tocontactId);
  const contactFrom: IContact = state.contacts.find((item) => item.id === document?.head.fromcontactId);
  const expeditor: IContact = state.contacts.find((item) => item.id === (document?.head as ISellHead).expeditorId);
  const status: string = statuses.find((item) => item.id === document?.head.status)?.name;
  const { colors } = useTheme();

  const field: TField[] = [
    { title: 'Идентификатор', value: document?.id },
    { title: 'Номер', value: (document?.head as ISellHead)?.docnumber },
    { title: 'Дата', value: new Date(document?.head?.date).toLocaleDateString() },
    { title: 'Экспедитор', value: expeditor ? expeditor.name : '' },
    { title: 'Подразделение', value: contactFrom ? contactFrom.name : '' },
    { title: 'Организация', value: contactTo ? contactTo.name : '' },
    { title: 'Статус', value: status },
  ];

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: TField }) => <FieldItem item={item} />;

  return (
    <View style={[styles.container, localStyles.container]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>Характеристики документа</SubTitle>
      <FlatList
        ref={ref}
        data={field}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export { HeadSellDocumentScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    padding: 0,
  },
  details: {
    margin: 10,
  },
  fieldName: {
    opacity: 0.5,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
  },
  value: {
    fontSize: 12,
  },
});
