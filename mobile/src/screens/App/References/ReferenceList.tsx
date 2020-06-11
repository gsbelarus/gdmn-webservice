import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';

import { IReference } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { useAuthStore, useAppStore, useServiceStore } from '../../../store';
import styles from '../../../styles/global';

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
  const { state: ServiceState } = useServiceStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resUpd, setResUpd] = useState();

  const ref = React.useRef<FlatList<IReference>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IReference }) => <ReferenceItem item={item} />;

  const sendUpdateRequest = async () => {
    const result = await fetch(`${ServiceState.serverUrl}messages`, {
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
            name: 'get_references',
            params: ['documenttypes', 'goodgroups', 'goods', 'remains', 'contacts'],
          },
        },
      }),
    }).then((res) => res.json());
    if (result.status === 201) {
      setResUpd(result.result);
      Alert.alert('Успех!', '', [
        {
          text: 'OK',
          onPress: () => ({}),
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
  };

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <FlatList
        ref={ref}
        data={AppState.references}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <View style={localStyles.syncButton}>
        <TouchableOpacity
          style={[
            styles.circularButton,
            localStyles.buttons,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={sendUpdateRequest}
        >
          <AntDesign size={30} color={colors.card} name="sync" />
        </TouchableOpacity>
      </View>
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
  syncButton: {
    alignItems: 'flex-end',
  },
});
