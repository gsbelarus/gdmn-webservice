import { useTheme, useScrollToTop } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Title, Text, FAB } from 'react-native-paper';

import documents from '../../../mockData/Document.json';
import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import statuses from '../../../mockData/documentStatuses.json';
import { IDocument, IDocumentType, IContact } from '../../../model/inventory';
import styles from '../../../styles/global';

type TField = {
  title: string;
  value: string | number;
};

const FieldItem = React.memo(({ item }: { item: TField }) => {
  const { colors } = useTheme();

  return (
    <View style={[localStyles.item, { backgroundColor: colors.card }]}>
      <View style={localStyles.details}>
        <Text style={[localStyles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[localStyles.value, localStyles.fieldName, { color: colors.text }]}>{item.value}</Text>
      </View>
    </View>
  );
});

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

const HeadDocumentScreen = ({ route, navigation }) => {
  const ref = React.useRef<FlatList<TField>>(null);
  const document: IDocument = documents.find((item) => item.id === route.params.docId);
  const type: IDocumentType = documentTypes.find((item) => item.id === document.head.doctype);
  const contactTo: IContact = contacts.find((item) => item.id === document.head.tocontactId);
  const contactFrom: IContact = contacts.find((item) => item.id === document.head.fromcontactId);
  const status: string = statuses.find((item) => item.id === document.head.status).name;
  const field: TField[] = [
    { title: 'Идентификатор', value: document.id },
    { title: 'Тип документа', value: type.name },
    { title: 'Подразделение 1', value: contactFrom.name },
    { title: 'Подразделение 2', value: contactTo.name },
    { title: 'Дата', value: new Date(document.head.date).toLocaleDateString() },
    { title: 'Статус', value: status },
  ];

  const [openGroup, setOpenGroup] = useState(false);
  const { colors } = useTheme();

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: TField }) => <FieldItem item={item} />;

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Характеристики документа</Title>
      <FlatList
        ref={ref}
        data={field}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <FAB.Group
        visible
        open={openGroup}
        icon="playlist-edit"
        fabStyle={{ backgroundColor: colors.primary }}
        actions={[
          {
            icon: 'pencil',
            label: 'Изменить документ',
            onPress: () => navigation.navigate('CreateDocument', { docId: route.params.docId }),
          },
          {
            icon: 'check',
            label: 'Изменить статус на "Готово"',
            onPress: () => {},
          },
          {
            icon: 'delete',
            label: 'Удалить документ',
            onPress: async () => {
              Alert.alert('Вы уверены, что хотите удалить?', '', [
                {
                  text: 'OK',
                  onPress: async () => {
                    navigation.navigate('DocumentsListScreen');
                  },
                },
                {
                  text: 'Отмена',
                  onPress: () => {},
                },
              ]);
            },
          },
        ]}
        onStateChange={({ open }) => setOpenGroup(open)}
      />
    </View>
  );
};

export { HeadDocumentScreen };

const localStyles = StyleSheet.create({
  details: {
    margin: 8,
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
  },
  value: {
    fontSize: 12,
  },
});
