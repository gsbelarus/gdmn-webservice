import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme, useScrollToTop } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';

import documents from '../../../mockData/Document.json';
import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import goods from '../../../mockData/Goods.json';
import remains from '../../../mockData/Remains.json';
import { IDocument, IContact, IDocumentType, ILine, IGood } from '../../../model/inventory';
import styles from '../../../styles/global';

const LineItem = React.memo(({ item, status }: { item: ILine; status: number }) => {
  const good: IGood = goods.find(i => i.id === item.goodId);

  return (
    <>
      <View style={localeStyles.productTextView}>
        <View style={localeStyles.productNameTextView}>
          <Text numberOfLines={5} style={localeStyles.productTitleView}>
            {good.name}
          </Text>
          <Text numberOfLines={5} style={localeStyles.productBarcodeView}>
            {good.barcode}
          </Text>
        </View>
        {status === 0 ? (
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
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
            <MaterialIcons size={25} color="#2D3083" name="delete-forever" />
          </TouchableOpacity>
        ) : (
          undefined
        )}
      </View>

      <View style={localeStyles.productNumView}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Ionicons size={20} color="#8C8D8F" name="md-pricetag" />
          <Text numberOfLines={5} style={localeStyles.productPriceView}>
            {remains?.find(remain => remain.goodId === good.id).price}
          </Text>
        </View>
        <Text numberOfLines={5} style={localeStyles.productQuantityView}>
          {item.quantity}
        </Text>
      </View>
    </>
  );
});

const ItemSeparator = () => {
  const { colors } = useTheme();

  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

const ViewDocumentScreen = ({ route }) => {
  const document: IDocument = documents.find(item => item.id === route.params.docId);
  const type: IDocumentType = documentTypes.find(item => item.id === document.head.doctype);
  const contact: IContact = contacts.find(item => item.id === document.head.tocontactId);
  const ref = React.useRef<FlatList<ILine>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: ILine }) => <LineItem item={item} status={document.head.status} />;

  return (
    <View style={[styles.container, { padding: 0 }]}>
      <View style={localeStyles.documentHeader}>
        <Text numberOfLines={5} style={localeStyles.documentHeaderText}>
          {type.name}
        </Text>
        <Text numberOfLines={5} style={localeStyles.documentHeaderText}>
          {contact.name}
        </Text>
        <Text numberOfLines={5} style={localeStyles.documentHeaderText}>
          {new Date(document.head.date).toLocaleDateString()}
        </Text>
      </View>
      <FlatList
        ref={ref}
        data={document.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export { ViewDocumentScreen };

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
  productBarcodeView: {
    marginTop: 5,
  },
  productIdView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productNameTextView: {
    color: '#000000',
    fontWeight: 'bold',
    marginHorizontal: 5,
    marginTop: 5,
    maxHeight: 75,
    minHeight: 45,
    textAlignVertical: 'center',
    width: '75%',
  },
  productNameView: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#E6E7FF',
  },
  productNumView: {
    alignItems: 'center',
    backgroundColor: '#F0F0FF',
    flexDirection: 'row',
    height: 25,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingLeft: 48,
  },
  productPriceView: {
    marginLeft: 5,
  },
  productQuantityView: {},
  productTextView: {
    flexDirection: 'row',
    margin: 5,
  },
  productTitleView: {
    flexGrow: 1,
    fontWeight: 'bold',
    maxHeight: 70,
    minHeight: 25,
  },
  productView: {
    flexDirection: 'column',
  },
});
