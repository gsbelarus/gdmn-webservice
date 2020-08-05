import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, FAB } from 'react-native-paper';

import { IReference, IMessageInfo, IResponse } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { timeout } from '../../../helpers/utils';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';

const ReferenceItem = React.memo(({ item }: { item: IReference }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Reference', { item });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[localStyles.number, localStyles.fieldDesciption, { color: colors.text }]}>{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ReferenceListScreen = () => {
  const { colors } = useTheme();
  const { state } = useAuthStore();
  const { state: AppState } = useAppStore();
  const { apiService } = useServiceStore();

  const ref = React.useRef<FlatList<IReference>>(null);
  useScrollToTop(ref);

  const references: IReference[] = useMemo(
    () => [
      {
        id: 0,
        name: 'Типы документов',
        type: 'documenttypes',
        data: AppState.documentTypes,
      },
      {
        id: 1,
        name: 'Контакты',
        type: 'contacts',
        data: AppState.contacts,
      },
      {
        id: 2,
        name: 'Товары',
        type: 'goods',
        data: AppState.goods,
      },
      {
        id: 3,
        name: 'Тары',
        type: 'boxings',
        data: AppState.boxings,
      },
    ],
    [AppState.contacts, AppState.documentTypes, AppState.goods, AppState.boxings],
  );

  const renderItem = ({ item }: { item: IReference }) => <ReferenceItem item={item} />;

  const sendUpdateRequest = useCallback(() => {
    timeout(
      5000,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_references',
          params: ['documenttypes', 'goodgroups', 'goods', 'remains', 'contacts', 'boxings'],
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
  }, [apiService.data, state.companyID]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <FlatList
        ref={ref}
        data={references.filter((i) => i.data?.length)}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <FAB style={[localStyles.fabSync, { backgroundColor: colors.primary }]} icon="sync" onPress={sendUpdateRequest} />
    </View>
  );
};

export { ReferenceListScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  buttons: {
    alignItems: 'center',
    margin: 10,
  },
  content: {
    height: '100%',
  },
  details: {
    margin: 8,
  },
  fabSync: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  fieldDesciption: {
    opacity: 0.5,
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
