import { useScrollToTop, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import styles from '../../styles/global';

type Item = { name: string; number: number; date: string };

const DocumentList: Item[] = [
  { name: 'Инвентаризация', number: 12, date: '2020-01-20' },
  { name: 'Инвентаризация', number: 1, date: '2020-01-10' },
  { name: 'Поступление', number: 7, date: '2020-01-12' },
];

const ContactItem = React.memo(({ item }: { item: { name: string; number: number; date: string } }) => {
  const { colors } = useTheme();

  return (
    <View style={[localStyles.item, { backgroundColor: colors.card }]}>
      <View style={localStyles.avatar}>
        <Text style={localStyles.letter}>{item.name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[localStyles.number, { color: colors.text, opacity: 0.5 }]}>
          {item.number} от {item.date}
        </Text>
      </View>
    </View>
  );
});

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

export const Documents = () => {
  const ref = React.useRef<FlatList<Item>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: Item }) => <ContactItem item={item} />;

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

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  details: {
    margin: 8,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
});
