import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useScrollToTop } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import statuses from '../../../mockData/documentStatuses.json';
import { IDocument, IDocumentType, IContact } from '../../../model/inventory';
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

const HeadDocumentScreen = ({ route }) => {
  const ref = React.useRef<FlatList<TField>>(null);
  const { state } = useAppStore();
  const document: IDocument = state.documents.find((item) => item.id === route.params.docId);
  const type: IDocumentType = state.documentTypes.find((item) => item.id === document.head.doctype);
  const contactTo: IContact = state.contacts.find((item) => item.id === document.head.tocontactId);
  const contactFrom: IContact = state.contacts.find((item) => item.id === document.head.fromcontactId);
  const status: string = statuses.find((item) => item.id === document.head.status).name;
  const { colors } = useTheme();

  const field: TField[] = [
    { title: 'Идентификатор', value: document.id },
    { title: 'Тип документа', value: type.name },
    { title: 'Подразделение 1', value: contactFrom.name },
    { title: 'Подразделение 2', value: contactTo.name },
    { title: 'Дата', value: new Date(document.head.date).toLocaleDateString() },
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

export { HeadDocumentScreen };

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
