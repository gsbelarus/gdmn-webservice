import { MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import documents from '../../../mockData/Otves/Document.json';
import statuses from '../../../mockData/Otves/documentStatuses.json';
import references from '../../../mockData/Otves/References.json';
import { IDocument, IDocumentType, IContact } from '../../../model/sell';
import styles from '../../../styles/global';

const DocumentList: IDocument[] = documents;
const DocumentTypes: IDocumentType[] = references.find((ref) => ref.type === "documentTypes").data;
const Contacts: IContact[] = references.find((ref) => ref.type === "contacts").data;
const Statuses: IDocumentType[] = statuses;

const DocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ViewSellDocument', { docId: item.id });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: statusColors[item.head.status] }]}>
          <MaterialCommunityIcons name="file-document-box" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <View style={localStyles.directionRow}>
            <Text style={[localStyles.name, { color: colors.text }]}>
              {item.head.docnumber} от{' '}  {new Date(item.head.date).toLocaleDateString()}
            </Text>
            <Text style={[localStyles.number, localStyles.field, { color: statusColors[item.head.status] }]}>
              {Statuses.find((type) => type.id === item.head.status).name}
            </Text>
          </View>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            Подразделение: {Contacts.find((contact) => contact.id === item.head.fromcontactId).name} 
          </Text>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            Экспедитор: {Contacts.find((contact) => contact.id === item.head.expeditorId).name}
          </Text>
          <Text style={[localStyles.company, localStyles.field, { color: colors.text }]}>
            {Contacts.find((contact) => contact.id === item.head.tocontactId).name} 
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const SellDocumentsListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const ref = React.useRef<FlatList<IDocument>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IDocument }) => <DocumentItem item={item} />;

  return (
    <View style={[localStyles.flex1, { backgroundColor: colors.card }]}>
      <FlatList
        ref={ref}
        data={DocumentList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <View style={localStyles.buttons}>
        <TouchableOpacity
          style={[
            styles.circularButton,
            localStyles.button,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => ({})}
        >
          <AntDesign size={30} color={colors.card} name="sync" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.circularButton,
            localStyles.button,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => navigation.navigate('CreateSellDocument')}
        >
          <MaterialIcons size={30} color={colors.card} name="add" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { SellDocumentsListScreen };

const localStyles = StyleSheet.create({
  alignItems: {
    alignItems: 'flex-end',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  button: {
    alignItems: 'center',
    margin: 10,
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    margin: 8,
    marginRight: 0,
    flex: 1,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  field: {
    opacity: 0.5,
  },
  flex1: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  company: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
