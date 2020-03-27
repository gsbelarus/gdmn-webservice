import { MaterialIcons, Foundation } from '@expo/vector-icons';
import { useTheme, useScrollToTop, useNavigation } from '@react-navigation/native';
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

const LineItem = React.memo(({ item, status, docId }: { item: ILine; status: number; docId: number }) => {
  const { colors } = useTheme();
  const good: IGood = goods.find((i) => i.id === item.goodId);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={localStyles.listContainer}
      onPress={() => navigation.navigate('ProductDetail', { prodId: item.goodId, docId, modeCor: true  })}
    >
      <View style={{ marginLeft: 15 }}>
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
      <View style={{ marginRight: 5 }}>
        {status === 0 ? (
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
        ) : undefined}
      </View>
    </TouchableOpacity>
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

  const renderItem = ({ item }: { item: ILine }) => <LineItem item={item} status={document.head.status} docId={document.id} />;

  return (
    <View style={[styles.container, localStyles.container, { backgroundColor: colors.card }]}>
        <View style={[localStyles.documentHeader, { backgroundColor: colors.primary }]}>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {type.name}
          </Text>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {contact.name}
          </Text>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {new Date(document.head.date).toLocaleDateString()}
          </Text>
          <TouchableOpacity style={{justifyContent: 'center'}}>
            <MaterialIcons
              size={30}
              color={colors.card}
              name="chevron-right"
              onPress={() => {
                navigation.navigate('HeadDocument', { docId: document.id });
              }}
            />
          </TouchableOpacity>
        </View>
      <FlatList
        ref={ref}
        data={document.lines}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {
          document.head.status === 0 || document.head.status === 3
          ? <TouchableOpacity
              style={[
                styles.circularButton,
                {
                  margin: 10,
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={async () => {
                Alert.alert('Вы уверены, что хотите удалить?', '', [
                  {
                    text: 'OK',
                    onPress: async () => {
                      navigation.navigate('DocumentsListScreen');
                    },
                  },
                  {
                    text: 'Отмена',
                    onPress: () => {},
                  },
                ]);
              }}
            >
              <MaterialIcons size={30} color={colors.card} name="delete" />
            </TouchableOpacity>
          : undefined
        }
        {
          document.head.status === 0
          ? <TouchableOpacity
              style={[
                styles.circularButton,
                {
                  margin: 10,
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => navigation.navigate('CreateDocument', {
                docId: route.params.docId,
              })}
            >
              <MaterialIcons size={30} color={colors.card} name="edit" />
            </TouchableOpacity>
          : undefined
        }
        {
          document.head.status === 0
          ? <TouchableOpacity
              style={[
                styles.circularButton,
                {
                  margin: 10,
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => {}}
            >
              <MaterialIcons size={30} color={colors.card} name="check" />
            </TouchableOpacity>
          : undefined
        }
        {
          document.head.status === 1
          ? <TouchableOpacity
              style={[
                styles.circularButton,
                {
                  margin: 10,
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => {}}
            >
              <Foundation size={30} color={colors.card} name="clipboard-pencil" />
            </TouchableOpacity>
          : undefined
        }
        {
          document.head.status === 0
          ? <TouchableOpacity
              style={[
                styles.circularButton,
                {
                  margin: 10,
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => navigation.navigate('ProductsList', { docId: document.id })}
            >
              <MaterialIcons size={30} color={colors.card} name="add" />
            </TouchableOpacity>
          : undefined
        }
      </View>
    </View>
  );
};

export { ViewDocumentScreen };

const localStyles = StyleSheet.create({
  container: {
    padding: 0,
  },
  documentHeader: {
    flexDirection: 'row',
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
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  productBarcodeView: {
    marginTop: 5,
  },
  productNameTextView: {
    fontWeight: 'bold',
    marginHorizontal: 5,
    marginTop: 5,
    maxHeight: 75,
    minHeight: 45,
    textAlignVertical: 'center',
    width: '75%',
  },
  productNumView: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 25,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  productPriceView: {
    marginLeft: 5,
  },
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
});
