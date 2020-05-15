import { MaterialIcons, Feather, Foundation } from '@expo/vector-icons';
import { useTheme, useScrollToTop, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';

import { IDocument, IContact, IDocumentType, ILine, IGood } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const ContentItem = React.memo(({ item, status }: { item: ILine; status: number }) => {
  const docId = useRoute<RouteProp<DocumentStackParamList, 'ViewDocument'>>().params?.docId;
  const { colors } = useTheme();
  const { state, actions } = useAppStore();
  const good: IGood = state.goods.find((i) => i.id === item.goodId);

  return (
    <>
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View style={[localStyles.avatar, { backgroundColor: colors.primary }]}>
          <Feather name="box" size={20} color={'#FFF'} />
        </View>
      </View>
      <View style={localStyles.goodInfo}>
        <Text numberOfLines={5} style={localStyles.productTitleView}>
          {good.name}
        </Text>
        <Text numberOfLines={5} style={localStyles.productBarcodeView}>
          {good.barcode}
        </Text>
      </View>
      <View style={localStyles.remainsInfo}>
        <Text numberOfLines={5} style={localStyles.productTitleView}>
          {state.remains?.find((remain) => remain.goodId === good.id).price}
        </Text>
        <Text numberOfLines={5} style={localStyles.productBarcodeView}>
          {item.quantity}
        </Text>
      </View>
      {status === 0 ? (
        <View style={localStyles.marginRight}>
          <TouchableOpacity
            style={localStyles.buttonDelete}
            onPress={async () => {
              Alert.alert('Вы уверены, что хотите удалить?', '', [
                {
                  text: 'OK',
                  onPress: () => {
                    actions.deleteLine({ docId, lineId: item.id });
                  },
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
    </>
  );
});

const LineItem = React.memo(({ item, status, docId }: { item: ILine; status: number; docId: number }) => {
  const navigation = useNavigation();

  return status === 0 ? (
    <TouchableOpacity
      style={localStyles.listContainer}
      onPress={() => navigation.navigate('ProductDetail', { prodId: item.goodId, docId, modeCor: true })}
    >
      <ContentItem item={item} status={status} />
    </TouchableOpacity>
  ) : (
    <View style={localStyles.listContainer}>
      <ContentItem item={item} status={status} />
    </View>
  );
});

const ViewDocumentScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();
  const document: IDocument | undefined = state.documents.find((item) => item.id === route.params.docId);
  const type: IDocumentType | undefined = state.documentTypes.find((item) => item.id === document?.head.doctype);
  const contact: IContact | undefined = state.contacts.find((item) => item.id === document?.head.tocontactId);
  const ref = React.useRef<FlatList<ILine>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: ILine }) => (
    <LineItem item={item} status={document?.head.status} docId={document?.id} />
  );

  return (
    <View style={[styles.container, localStyles.container, { backgroundColor: colors.card }]}>
      <View style={[localStyles.documentHeader, { backgroundColor: colors.primary }]}>
        <View style={localStyles.header}>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {type?.name} от {new Date(document?.head.date).toLocaleDateString()}
          </Text>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {contact?.name}
          </Text>
        </View>
        <TouchableOpacity style={localStyles.goDetailsHeader}>
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
        data={document ? document.lines : []}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <View
        style={[
          localStyles.flexDirectionRow,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            justifyContent: document?.head.status !== 0 ? 'flex-start' : 'space-evenly',
          },
        ]}
      >
        {document?.head.status === 0 || document?.head.status === 3 ? (
          <TouchableOpacity
            style={[
              styles.circularButton,
              localStyles.buttons,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={async () => {
              Alert.alert('Вы уверены, что хотите удалить?', '', [
                {
                  text: 'OK',
                  onPress: () => {
                    actions.deleteDocument(document?.id);
                    navigation.navigate('DocumentsListScreen');
                  },
                },
                {
                  text: 'Отмена',
                },
              ]);
            }}
          >
            <MaterialIcons size={30} color={colors.card} name="delete" />
          </TouchableOpacity>
        ) : undefined}
        {document?.head.status === 0 ? (
          <TouchableOpacity
            style={[
              styles.circularButton,
              localStyles.buttons,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() =>
              navigation.navigate('CreateDocument', {
                docId: route.params.docId,
              })
            }
          >
            <MaterialIcons size={30} color={colors.card} name="edit" />
          </TouchableOpacity>
        ) : undefined}
        {document?.head.status === 0 ? (
          <TouchableOpacity
            style={[
              styles.circularButton,
              localStyles.buttons,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => {
              actions.editStatusDocument({ id: document.id, status: document?.head.status + 1 });
            }}
          >
            <MaterialIcons size={30} color={colors.card} name="check" />
          </TouchableOpacity>
        ) : undefined}
        {document?.head.status === 1 ? (
          <TouchableOpacity
            style={[
              styles.circularButton,
              localStyles.buttons,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => {
              actions.editStatusDocument({ id: document.id, status: document?.head.status - 1 });
            }}
          >
            <Foundation size={30} color={colors.card} name="clipboard-pencil" />
          </TouchableOpacity>
        ) : undefined}
        {document?.head.status === 0 ? (
          <TouchableOpacity
            style={[
              styles.circularButton,
              localStyles.buttons,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => navigation.navigate('ProductsList', { docId: document?.id })}
          >
            <MaterialIcons size={30} color={colors.card} name="add" />
          </TouchableOpacity>
        ) : undefined}
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
  buttonDelete: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    alignItems: 'center',
    margin: 10,
  },
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
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  goDetailsHeader: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 15,
  },
  goodInfo: {
    marginLeft: 15,
    width: '55%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 15,
    justifyContent: 'center',
    padding: 8,
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
  marginRight: {
    marginRight: 15,
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
    minHeight: 15,
  },
  remainsInfo: {
    alignItems: 'flex-end',
    flexGrow: 1,
    marginRight: 15,
  },
});
