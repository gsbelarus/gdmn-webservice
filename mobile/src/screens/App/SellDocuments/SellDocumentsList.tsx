import { MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';

import { IDocument, IDocumentType, IResponse, IMessageInfo } from '../../../../../common';
import { timeout } from '../../../helpers/utils';
import ItemSeparator from '../../../components/ItemSeparator';
import statuses from '../../../mockData/Otves/documentStatuses.json';
import { ISellDocument, ISellHead } from '../../../model';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';
import styles from '../../../styles/global';

const Statuses: IDocumentType[] = statuses;

const DocumentItem = React.memo(({ item }: { item: IDocument | ISellDocument }) => {
  const { colors } = useTheme();
  const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];
  const navigation = useNavigation();
  const { state } = useAppStore();

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
              {(item.head as ISellHead).docnumber} от {new Date(item.head.date).toLocaleDateString()}
            </Text>
            <Text style={[localStyles.number, localStyles.field, { color: statusColors[item.head.status] }]}>
              {Statuses.find((type) => type.id === item.head.status).name}
            </Text>
          </View>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            Подразделение:{' '}
            {state.contacts?.find((contact) => contact.id === (item.head as ISellHead)?.fromcontactId)?.name}
          </Text>
          <Text style={[localStyles.number, localStyles.field, { color: colors.text }]}>
            Экспедитор: {state.contacts?.find((contact) => contact.id === (item.head as ISellHead)?.expeditorId).name}
          </Text>
          <Text style={[localStyles.company, localStyles.field, { color: colors.text }]}>
            {state.contacts?.find((contact) => contact.id === item.head?.tocontactId).name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const SellDocumentsListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const ref = React.useRef<FlatList<ISellDocument>>(null);
  useScrollToTop(ref);

  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions } = useAppStore();

  const renderItem = ({ item }: { item: IDocument | ISellDocument }) => <DocumentItem item={item} />;

  const sendUpdateRequest = async () => {
    const documents = appState.documents.filter((document) => document.head.status === 1);
    
    timeout(
      5000,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'post_documents',
          params: documents,
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Успех!', '', [
            {
              text: 'OK',
              onPress: () => {
                documents.forEach((item) => {
                  actions.editStatusDocument({ id: item.id, status: item.head.status + 1 });
                });
              },
            },
          ]);
        } else {
          Alert.alert('Запрос не был отправлен', '', [
            {
              text: 'OK',
              onPress: () => ({}),
            },
          ]);
        }
      })
      .catch((err: Error) =>
        Alert.alert('Ошибка!', err.message, [
          {
            text: 'OK',
            onPress: () => ({}),
          },
        ]),
      );
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
  company: {
    fontSize: 12,
    fontWeight: 'bold',
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
