import { MaterialIcons, Feather, Foundation } from '@expo/vector-icons';
import { useTheme, useScrollToTop, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';

import { IDocument, IContact, IGood } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { ISellDocument, ISellLine, ISellHead, ILineTara } from '../../../model';
import { DocumentStackParamList } from '../../../navigation/SellDocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const ContentItem = React.memo(({ item, status }: { item: ISellLine; status: number }) => {
  const docId = useRoute<RouteProp<DocumentStackParamList, 'ViewSellDocument'>>().params?.docId;
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
          {good?.name || 'товар не найден'}
        </Text>
        {
          item.numreceive
          ? <Text style={[localStyles.productTitleView, localStyles.boxingText]}>№ партии: {item.numreceive}</Text>
          : undefined
        }
        {
          item.tara ?
          <View>
            {
              item.tara.map(boxing => {
                const findBoxing = state.boxings?.find(box => boxing.tarakey === box.id);
                return <Text style={localStyles.boxingText} key={boxing.tarakey}>
                    {`${findBoxing ? findBoxing.name : 'неизвестная тара'} - ${boxing.quantity && !Number.isNaN(boxing.quantity) ? boxing.quantity : 0}, `}
                  </Text>
                })
            }
          </View>
          : undefined
        }
      </View>
      <View style={localStyles.remainsInfo}>
        <Text numberOfLines={5} style={localStyles.productBarcodeView}>
          {item.orderQuantity ?? 0}
        </Text>
      </View>
      <View style={localStyles.remainsInfo}>
        <Text numberOfLines={5} style={localStyles.productBarcodeView}>
          {item.quantity}
        </Text>
      </View>
      {status === 0 ? (
        <View style={localStyles.remainsInfo}>
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

const LineItem = React.memo(({ item, status, docId }: { item: ISellLine; status: number; docId: number }) => {
  const navigation = useNavigation();
  const { actions } = useAppStore();

  return status === 0 ? (
    <TouchableOpacity
      style={localStyles.listContainer}
      onPress={() => {
        actions.setBoxingsLine([{ docId, lineDoc: item.id, lineBoxings: item.tara ?? [] }]);
        navigation.navigate('SellProductDetail', { lineId: item.id, prodId: item.goodId, docId, modeCor: true });
      }}
    >
      <ContentItem item={item} status={status} />
    </TouchableOpacity>
  ) : (
    <View style={localStyles.listContainer}>
      <ContentItem item={item} status={status} />
    </View>
  );
});

const ViewSellDocumentScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();
  const notFound = { id: -1, name: '' };
  const document: IDocument | ISellDocument | undefined = state.documents.find(
    (item) => item.id === route.params.docId,
  );
  const contact: IContact = state.contacts.find((item) => item.id === document?.head.tocontactId) ?? notFound;
  const ref = React.useRef<FlatList<ISellLine>>(null);

  const documentLines = document?.lines as ISellLine[];
  const boxings = (documentLines ?? []).reduce((totalLine, line) => [...totalLine, ...(line.tara ?? [])], [] as ILineTara[]);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: ISellLine }) => (
    <LineItem item={item} status={document?.head.status} docId={document?.id} />
  );

  return document ? (
    <View style={[styles.container, localStyles.container, { backgroundColor: colors.card }]}>
      <View style={[localStyles.documentHeader, { backgroundColor: colors.primary }]}>
        <View style={localStyles.header}>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {(document.head as ISellHead)?.docnumber} от {new Date(document.head.date)?.toLocaleDateString()}
          </Text>
          <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
            {contact.name}
          </Text>
        </View>
        <TouchableOpacity style={localStyles.goDetailsHeader}>
          <MaterialIcons
            size={30}
            color={colors.card}
            name="chevron-right"
            onPress={() => {
              navigation.navigate('HeadSellDocument', { docId: document.id });
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={localStyles.listContainer}>
        <View style={localStyles.avatarRow} />
        <View style={localStyles.goodInfo}>
          <Text style={localStyles.productBarcodeView}>Наименование ТМЦ</Text>
        </View>
        <View style={localStyles.remainsInfo}>
          <Text style={localStyles.productBarcodeView}>Заявка</Text>
        </View>
        <View style={localStyles.remainsInfo}>
          <Text style={localStyles.productBarcodeView}>Кол-во</Text>
        </View>
        <View style={localStyles.remainsInfo}>
          <Text style={localStyles.productBarcodeView} />
        </View>
      </View>
      <FlatList
        ref={ref}
        data={document.lines ?? []}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <ItemSeparator />
      <View style={[localStyles.flexDirectionRow, localStyles.lineTotal]}>
        <Text style={localStyles.fontWeightBold}>Итого:</Text>
        <Text style={localStyles.fontWeightBold}>
        общий {(documentLines ?? []).reduce((total, line) => Number.parseFloat(((line.quantity ?? 0) + total).toFixed(3)), 0)} /
          кол-во {boxings.length !== 0 ? boxings.reduce((total, boxing) => Number.parseFloat((total + (boxing.quantity ?? 0)).toFixed(3)), 0.0) : 0} /
          вес {boxings.length !== 0 ? boxings.reduce((total, boxing) => Number.parseFloat((total + (boxing.weight ?? 0)).toFixed(3)), 0) : 0}
        </Text>
      </View>
      <ItemSeparator />
      <View
        style={[
          localStyles.flexDirectionRow,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            justifyContent: document.head.status !== 0 ? 'flex-start' : 'space-evenly',
          },
        ]}
      >
        {document.head.status === 0 || document.head.status === 3 ? (
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
                  onPress: async () => {
                    actions.deleteDocument(document.id);
                    navigation.navigate('SellDocumentsListScreen');
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
        {document.head.status === 0 ? (
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
              navigation.navigate('CreateSellDocument', {
                docId: route.params.docId,
              })
            }
          >
            <MaterialIcons size={30} color={colors.card} name="edit" />
          </TouchableOpacity>
        ) : undefined}
        {document.head.status === 0 ? (
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
              actions.editStatusDocument({ id: document.id, status: document.head.status + 1 });
            }}
          >
            <MaterialIcons size={30} color={colors.card} name="check" />
          </TouchableOpacity>
        ) : undefined}
        {document.head.status === 1 ? (
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
              actions.editStatusDocument({ id: document.id, status: document.head.status - 1 });
            }}
          >
            <Foundation size={30} color={colors.card} name="clipboard-pencil" />
          </TouchableOpacity>
        ) : undefined}
        {document.head.status === 0 ? (
          <TouchableOpacity
            style={[
              styles.circularButton,
              localStyles.buttons,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => navigation.navigate('SellProductsList', { docId: document.id })}
          >
            <MaterialIcons size={30} color={colors.card} name="add" />
          </TouchableOpacity>
        ) : undefined}
      </View>
    </View>
  ) : null;
};

export { ViewSellDocumentScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  avatarRow: {
    marginLeft: 5,
    width: 36,
  },
  boxingText: {
    fontSize: 11,
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
    height: 60,
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
  fontWeightBold: {
    fontWeight: 'bold',
  },
  goDetailsHeader: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 15,
  },
  goodInfo: {
    flexBasis: 150,
    marginLeft: 15,
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
  lineTotal: {
    justifyContent: 'space-between',
    padding: 10,
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
    flexBasis: 45,
    flexGrow: 1,
    marginRight: 5,
  },
});
