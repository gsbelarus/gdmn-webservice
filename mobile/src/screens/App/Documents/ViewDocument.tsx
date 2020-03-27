import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme, useScrollToTop } from '@react-navigation/native';
import React from 'react';
import { Dimensions, View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';

import documents from '../../../mockData/Document.json';
import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import goods from '../../../mockData/Goods.json';
import remains from '../../../mockData/Remains.json';
import { IDocument, IContact, IDocumentType, ILine, IGood } from '../../../model/inventory';
import styles from '../../../styles/global';

const LineItem = React.memo(({ item, status }: { item: ILine; status: number }) => {
  const { colors } = useTheme();
  const good: IGood = goods.find((i) => i.id === item.goodId);

  return (
    <View style={localStyles.listContainer}>
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
          <Feather name="box" size={20} color={'#FFF'} />
        </View>
      </View>
      <View style={{ marginLeft: 15, width: Dimensions.get('window').width  <= 320 ? '55%' : '65%' }}>
        <Text numberOfLines={5} style={localStyles.productTitleView}>
          {good.name}
        </Text>
        <Text numberOfLines={5} style={localStyles.productBarcodeView}>
          {good.barcode}
        </Text>
      </View>
      <View style={{ flexGrow: 1, alignItems: 'flex-end', marginRight: 15 }}>
        <Text numberOfLines={5} style={localStyles.productTitleView}>
          {remains?.find((remain) => remain.goodId === good.id).price}
        </Text>
        <Text numberOfLines={5} style={localStyles.productBarcodeView}>
          {item.quantity}
        </Text>
      </View>
      {status === 0 ? (
        <View style={{ marginRight: 5 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
            onPress={async () => {
              Alert.alert('Вы уверены, что хотите удалить?', '', [
                {
                  text: 'OK',
                },
                {
                  text: 'Отмена',
                },
              ]);
            }}
          >
            <MaterialIcons size={25} color={colors.primary} name="delete-forever" />
          </TouchableOpacity>
        </View>
      ) : undefined}
    </View>
  );
});

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

const ViewDocumentScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const document: IDocument = documents.find((item) => item.id === route.params.docId);
  const type: IDocumentType = documentTypes.find((item) => item.id === document.head.doctype);
  const contact: IContact = contacts.find((item) => item.id === document.head.tocontactId);
  const ref = React.useRef<FlatList<ILine>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: ILine }) => <LineItem item={item} status={document.head.status} />;

  return (
    <View style={[styles.container, localStyles.container, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('HeadDocument', { docId: document.id });
        }}
      >
        <View style={[localStyles.documentHeader, { backgroundColor: colors.primary }]}>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {type.name} от {new Date(document.head.date).toLocaleDateString()}
          </Text>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {contact.name}
          </Text>
        </View>
      </TouchableOpacity>
      <FlatList
        ref={ref}
        data={document.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <View style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity
          style={[
            styles.circularButton,
            {
              margin: 10,
              alignItems: 'center',
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => navigation.navigate('ProductsList')}
        >
          <MaterialIcons size={30} color={colors.card} name="add" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { ViewDocumentScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    padding: 0,
  },
  content: {
    height: '100%',
  },
  details: {
    margin: 8,
  },
  documentHeader: {
    flexDirection: 'column',
    height: 50,
  },
  documentHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    marginHorizontal: 2,
    marginVertical: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  fieldDesciption: {
    opacity: 0.5,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 5,
  },
  listContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  productBarcodeView: {
    fontSize: 12,
    opacity: 0.5,
  },
  productTitleView: {
    flexGrow: 1,
    fontSize: 14,
    fontWeight: 'bold',
    maxHeight: 70,
    minHeight: 25,
  },
});
