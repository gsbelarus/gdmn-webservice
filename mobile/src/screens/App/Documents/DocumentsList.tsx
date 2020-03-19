import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useScrollToTop, useTheme } from '@react-navigation/native';
import documents from '../../../mockData/Document.json';
import contacts from '../../../mockData//GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import { styles } from '../../../styles/global';
import { IDocument, IDocumentType, IContact } from '../../../model/inventory';
import { useNavigation } from '@react-navigation/native';

const DocumentList: IDocument[] = documents;
const DocumentTypes: IDocumentType[] = documentTypes;
const Contacts: IContact[] = contacts;

const DocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => { navigation.navigate('ViewDocument', { docId: item.id }) }}>
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: statusColors[item.head.status] }]}>
          <Text style={localStyles.letter}>
            {DocumentTypes.find(type => type.id === item.head.doctype).name.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={localStyles.details}>
          <Text style={[localStyles.name, { color: colors.text }]}>
            {DocumentTypes.find(type => type.id === item.head.doctype).name}
          </Text>
          <Text style={[localStyles.number, { color: colors.text, opacity: 0.5 }]}>
            {Contacts.find(contact => contact.id === item.head.fromcontactId).name} от {new Date(item.head.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

const DocumentsListScreen = () => {
  const ref = React.useRef<FlatList<IDocument>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IDocument }) => <DocumentItem item={item} />;

  return (
    <FlatList
      ref={ref}
      data={DocumentList}
      keyExtractor={(_, i) => String(i)}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

export { DocumentsListScreen as DocumentsList };

const localStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center'
  },
  letter: {
    color: 'white',
    fontWeight: 'bold'
  },
  details: {
    margin: 8
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14
  },
  number: {
    fontSize: 12
  },
});
