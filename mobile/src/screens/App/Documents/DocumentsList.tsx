import { MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import statuses from '../../../mockData/documentStatuses.json';
import { IDocument, IDocumentType, IContact } from '../../../model/inventory';
import { useAuthStore, useAppStore } from '../../../store';
import styles from '../../../styles/global';

const DocumentTypes: IDocumentType[] = documentTypes;
const Contacts: IContact[] = contacts;
const Statuses: IDocumentType[] = statuses;

const DocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ViewDocument', { docId: item.id });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: statusColors[item.head.status] }]}>
          <MaterialCommunityIcons name="file-document-box" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <View style={localStyles.directionRow}>
            <Text style={[localStyles.name, { color: colors.text }]}>
              {DocumentTypes.find((type) => type.id === item.head.doctype).name}
            </Text>
            <Text style={[localStyles.number, localStyles.field, { color: statusColors[item.head.status] }]}>
              {Statuses.find((type) => type.id === item.head.status).name}
            </Text>
          </View>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            {Contacts.find((contact) => contact.id === item.head.fromcontactId).name} от{' '}
            {new Date(item.head.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const DocumentsListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const ref = React.useRef<FlatList<IDocument>>(null);
  useScrollToTop(ref);

  const { state } = useAuthStore();
  const { state: appState } = useAppStore();
  const [data, setData] = useState([]);

  const renderItem = ({ item }: { item: IDocument }) => <DocumentItem item={item} />;

  const sendUpdateRequest = async () => {
    const result = await fetch(`${state.baseUrl}messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        head: {
          companyId: state.companyID,
        },
        body: {
          type: 'cmd',
          payload: {
            name: 'post_documents',
            params: data,
          },
        },
      }),
    }).then((res) => res.json());
    if (result.status === 200) {
      Alert.alert('Успех!', '', [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    } else {
      Alert.alert('Запрос не был отправлен', '', [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    }
  };

  return (
    <View style={[localStyles.flex1, { backgroundColor: colors.card }]}>
      <FlatList
        ref={ref}
        data={appState.documents}
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
          onPress={sendUpdateRequest}
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
          onPress={() => navigation.navigate('CreateDocument')}
        >
          <MaterialIcons size={30} color={colors.card} name="add" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { DocumentsListScreen };

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
});
