import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme, useScrollToTop, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Colors, FAB, IconButton } from 'react-native-paper';

import { IDocument, IContact, IGood } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { ISellDocument, ISellLine, ISellHead, ILineTara } from '../../../model';
import { DocumentStackParamList } from '../../../navigation/SellDocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];

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
        {item.numreceive ? (
          <Text style={[localStyles.productTitleView, localStyles.boxingText]}>№ партии: {item.numreceive}</Text>
        ) : undefined}
        {item.tara ? (
          <View>
            {item.tara.map((boxing) => {
              const findBoxing = state.boxings?.find((box) => boxing.tarakey === box.id);
              return (
                <Text style={localStyles.boxingText} key={boxing.tarakey}>
                  {`${findBoxing ? findBoxing.name : 'неизвестная тара'} - ${
                    boxing.quantity && !Number.isNaN(boxing.quantity) ? boxing.quantity : 0
                  }`}
                </Text>
              );
            })}
          </View>
        ) : undefined}
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
              Alert.alert('Вы уверены, что хотите удалить позицию?', '', [
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

type Props = StackScreenProps<DocumentStackParamList, 'ViewSellDocument'>;

const notFound = { id: -1, name: '' };

const ViewSellDocumentScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();
  const showActionSheet = useActionSheet();
  const navigation = useNavigation();
  const [docId, setDocId] = useState<number>(undefined);

  useEffect(() => {
    if (!route.params?.docId) {
      return;
    }

    setDocId(route.params.docId);
  }, [route.params.docId]);

  const document: IDocument | ISellDocument | undefined = useMemo(() => {
    return state.documents.find((item) => item.id === docId);
  }, [docId, state.documents]);

  const contact: IContact = state.contacts.find((item) => item.id === document?.head.tocontactId) ?? notFound;
  const refList = React.useRef<FlatList<ISellLine>>(null);

  const documentLines = document?.lines as ISellLine[];
  const boxings = (documentLines ?? []).reduce(
    (totalLine, line) => [...totalLine, ...(line.tara ?? [])],
    [] as ILineTara[],
  );

  useScrollToTop(refList);

  const renderItem = ({ item }: { item: ISellLine }) => (
    <LineItem item={item} status={document?.head.status} docId={document?.id} />
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="menu"
          size={24}
          onPress={() => {
            showActionSheet([
              {
                title: 'Изменить шапку',
                onPress: () => {
                  if (document?.head?.status === 0) {
                    navigation.navigate('CreateSellDocument', { docId });
                    return;
                  }
                  Alert.alert('Изменения доступны только для черновика', '', [
                    {
                      text: 'OK',
                    },
                  ]);
                },
              },
              {
                title: document?.head?.status === 0 ? "В статус 'Готово' " : "В статус 'Черновик'",
                onPress: () =>
                  actions.editStatusDocument({
                    id: docId,
                    status: document?.head?.status + (document?.head?.status === 0 ? 1 : -1),
                  }),
              },
              {
                title: 'Удалить',
                type: 'destructive',
                onPress: () => {
                  Alert.alert('Вы уверены, что хотите удалить документ?', '', [
                    {
                      text: 'OK',
                      onPress: async () => {
                        actions.deleteDocument(docId);
                        navigation.navigate('SellDocumentsListScreen');
                      },
                    },
                    {
                      text: 'Отмена',
                    },
                  ]);
                },
              },
              {
                title: 'Отмена',
                type: 'cancel',
              },
            ]);
          }}
        />
      ),
    });
  }, [actions, docId, document?.head?.status, navigation, showActionSheet]);

  return document ? (
    <>
      <View style={[styles.container, localStyles.container, { backgroundColor: colors.card }]}>
        <View
          style={[
            localStyles.documentHeader,
            { backgroundColor: document.head.status === 0 ? colors.primary : statusColors[1] },
          ]}
        >
          <View style={localStyles.header}>
            <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
              №{(document?.head as ISellHead)?.docnumber} от {new Date(document?.head?.date)?.toLocaleDateString()} г.
            </Text>
            <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
              {contact.name}
            </Text>
          </View>
         {/*  <TouchableOpacity style={localStyles.goDetailsHeader}>
            <MaterialIcons
              size={30}
              color={colors.card}
              name="chevron-right"
              onPress={() => {
                navigation.navigate('HeadSellDocument', { docId });
              }}
            />
          </TouchableOpacity> */}
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
          {document?.head?.status === 0 ? (
            <View style={localStyles.remainsInfo}>
              <Text style={localStyles.productBarcodeView} />
            </View>
          ) : null}
        </View>
        <FlatList
          ref={refList}
          data={document.lines ?? []}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
        <ItemSeparator />
        <View style={[localStyles.flexDirectionRow, localStyles.lineTotal]}>
          <Text style={localStyles.fontWeightBold}>Итого:</Text>
          <Text style={localStyles.fontWeightBold}>
            вес прод.{' '}
            {(documentLines ?? []).reduce(
              (total, line) => Number.parseFloat(((line.quantity ?? 0) + total).toFixed(3)),
              0,
            )}{' '}
          </Text>
        </View>
        <ItemSeparator />
        <View style={[localStyles.flexDirectionRow, localStyles.lineTotal]}>
          <Text style={localStyles.fontWeightBold}>Тара:</Text>
          <Text style={localStyles.fontWeightBold}>
            кол-во{' '}
            {boxings.length !== 0
              ? boxings.reduce((total, boxing) => Number.parseFloat((total + (boxing.quantity ?? 0)).toFixed(3)), 0.0)
              : 0}{' '}
            / вес{' '}
            {boxings.length !== 0
              ? boxings.reduce((total, boxing) => Number.parseFloat((total + (boxing.weight ?? 0)).toFixed(3)), 0)
              : 0}
          </Text>
        </View>
        <ItemSeparator />
        <View
          style={[
            localStyles.flexDirectionRow,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              justifyContent: document?.head?.status !== 0 ? 'flex-start' : 'space-evenly',
            },
          ]}
        >
          {document?.head?.status === 0 && (
            <FAB
              style={localStyles.fabAdd}
              icon="plus"
              onPress={() => navigation.navigate('SellProductsList', { docId: document.id })}
            />
          )}
        </View>
      </View>
    </>
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
    height: 50,
  },
  documentHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  fabAdd: {
    backgroundColor: Colors.blue600,
    bottom: 65,
    margin: 20,
    position: 'absolute',
    right: 0,
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
    flexBasis: '30%',
    marginLeft: 15,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 15,
    justifyContent: 'center',
    padding: 7,
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
