import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, FAB } from 'react-native-paper';

import { IReference, IMessageInfo, IResponse, IDataMessage, IDocument, IContact, IGood } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { timeout } from '../../../helpers/utils';
import { IReferences } from '../../../model/types';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';
import { useSelector } from '../../../store/App/store';

const ReferenceItem = React.memo(({ item }: { item: IReference }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (item.type === 'remains') {
          navigation.navigate('RemainsContactList', { item });
        } else {
          navigation.navigate('Reference', { item });
        }
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

  const refs = useSelector((store) => store.references) as IReferences;
  const { apiService } = useServiceStore();

  const ref = React.useRef<FlatList<IReference>>(null);
  useScrollToTop(ref);

  const references: IReference[] = useMemo(() => {
    return refs ? Object.keys(refs).map((i) => refs[i]) : [];
  }, [refs]);

  const renderItem = ({ item }: { item: IReference }) => <ReferenceItem item={item} />;

  const sendUpdateRequest = useCallback(() => {
    timeout(
      apiService.baseUrl.timeout,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_references',
          params: ['documenttypes', 'goodgroups', 'goods', 'contacts', 'remains'],
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
  }, [apiService.baseUrl.timeout, apiService.data, state.companyID]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <FlatList
        ref={ref}
        data={references?.filter((i) => i?.data?.length)}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<Text style={localStyles.emptyList}>Список пуст</Text>}
      />
      <FAB
        style={[localStyles.fabSync, { backgroundColor: colors.primary }]}
        icon="sync"
        onPress={() => {
          sendUpdateRequest();
        }}
      />
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
  content: {
    height: '100%',
  },
  details: {
    margin: 8,
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
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
