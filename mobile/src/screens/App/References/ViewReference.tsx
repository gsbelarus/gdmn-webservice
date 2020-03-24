import { useTheme, useScrollToTop } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import references from '../../../mockData/References.json';
import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import goods from '../../../mockData/Goods.json';
import { IReference, IGood, IDocumentType, IContact } from '../../../model/inventory';
import styles from '../../../styles/global';

const LineItem = React.memo(({ item }: { item: IGood | IDocumentType | IContact }) => {
  return(
    <></>
  );
});

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

const ViewReferenceScreen = ({ route }) => {
  const reference: IReference = references.find(item => item.id === route.params.docId);
  const ref = React.useRef<FlatList<IGood | IDocumentType | IContact>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IGood | IDocumentType | IContact }) => <LineItem item={item} />;

  return (
    <View style={[styles.container, { padding: 0 }]}>
      <View style={localeStyles.documentHeader}>
        <Text numberOfLines={5} style={localeStyles.documentHeaderText}>
          {reference.name}
        </Text>
      </View>
      <FlatList
        ref={ref}
        data={reference.type === 'contacts' ? contacts : reference.type === 'goods' ? goods : documentTypes}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export { ViewReferenceScreen };

const localeStyles = StyleSheet.create({
  documentHeader: {
    backgroundColor: '#5053A8',
    flexDirection: 'row',
    height: 50,
  },
  documentHeaderText: {
    color: '#FFFFFF',
    flex: 1,
    fontWeight: 'bold',
    marginHorizontal: 2,
    marginVertical: 5,
    textAlignVertical: 'center',
  },
});
