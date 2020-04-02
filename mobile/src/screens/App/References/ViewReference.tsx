import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScrollToTop, useTheme, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { IReference } from '../../../model/inventory';
// import styles from '../../../styles/global';

interface IField {
  id: string;
  name: string;
  [fieldName: string]: unknown;
}

const LineItem = React.memo(({ item }: { item: IField }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ReferenceDetail', { item });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="view-list" size={20} color={'#FFF'} />
        </View>
        <View style={localStyles.details}>
          <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ViewReferenceScreen = ({ route }) => {
  const { colors } = useTheme();

  const reference: IReference = route.params.item;

  const ref = React.useRef<FlatList<IField>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IField }) => <LineItem item={item} />;

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{reference.name}</SubTitle>
      <ItemSeparator />
      <FlatList
        ref={ref}
        data={reference.data}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export { ViewReferenceScreen };

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
    margin: 10,
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
  title: {
    padding: 10,
  },
});
