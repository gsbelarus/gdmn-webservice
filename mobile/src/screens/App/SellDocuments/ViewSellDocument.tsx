import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme, useScrollToTop, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Text, Colors, FAB, IconButton } from 'react-native-paper';

import { IDocument, IContact, IGood } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { statusColors } from '../../../constants';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { formatValue } from '../../../helpers/utils';
import { ISellDocument, ISellLine, ISellHead, ILineTara } from '../../../model';
import { DocumentStackParamList } from '../../../navigation/SellDocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

// const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];

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
          {item.numreceive ?? ''}
        </Text>
      </View>
      <View style={localStyles.remainsInfo}>
        <Text numberOfLines={5} style={localStyles.productBarcodeView}>
          {item.orderQuantity ?? 0}
        </Text>
      </View>
      <View style={localStyles.remainsInfo}>
        <Text numberOfLines={5} style={(localStyles.productBarcodeView, { color: colors.text })}>
          {item.quantity}
        </Text>
      </View>
      {status === 0 && (
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
      )}
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
        // actions.setBoxingsLine([{ docId, lineDoc: item.id, lineBoxings: item.tara ?? [] }]);
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
  // const [netto, setNetto] = useState<number>(0);
  // const [tarsWeight, setTarsWeight] = useState({ qty: 0, weight: 0 });
  const refList = React.useRef<FlatList<ISellLine>>(null);

  const docId = route.params?.docId;

  const document: IDocument | ISellDocument | undefined = useMemo(() => {
    return state.documents.find((item) => item.id === docId);
  }, [docId, state.documents]);

  const contact: IContact = useMemo(
    () => state.contacts.find((item) => item.id === document?.head.tocontactId) ?? notFound,
    [document?.head.tocontactId, state.contacts],
  );

  const documentLines = useMemo(() => document?.lines as ISellLine[], [document?.lines]);

  const boxings = useMemo(
    () => (documentLines ?? []).reduce((totalLine, line) => [...totalLine, ...(line.tara ?? [])], [] as ILineTara[]),
    [documentLines],
  );

  const totalNetWeight = useMemo(() => {
    return (documentLines ?? []).reduce((total, line) => {
      const goodLine = state.goods.find((item) => item.id === line.goodId);
      return (line.quantity ?? 0) * (goodLine?.itemWeight ?? 1) + total;
    }, 0);
  }, [documentLines, state.goods]);

  const boxingTotals = useMemo(
    () => ({
      qty: (boxings ?? []).reduce((total, itm) => total + itm.quantity, 0),
      weight: (boxings ?? []).reduce((total, itm) => total + itm.weight, 0),
    }),
    [boxings],
  );

  const setQuantity = useCallback(() => {
    if (document?.lines && document.lines !== []) {
      (document.lines as ISellLine[]).forEach((line) => {
        actions.editLine({
          docId: document.id,
          line: { ...line, quantity: line.quantity > 0 ? line.quantity : line.orderQuantity ?? 0 },
        });
      });
    }
  }, [actions, document?.id, document?.lines]);

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
                title: 'Количество как заявлено',
                onPress: setQuantity,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, docId, document?.head?.status, navigation, showActionSheet]);

  const docTitle = useMemo(() => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return `№${(document?.head as ISellHead)?.docnumber} от ${new Date(document?.head?.date)?.toLocaleDateString(
      'BY-ru',
      options,
    )}`;
  }, [document]);

  return document ? (
    <>
      <View style={[styles.container, localStyles.container, { backgroundColor: colors.card }]}>
        <View style={[localStyles.documentHeader, { backgroundColor: statusColors[document?.head?.status] }]}>
          <Text style={[localStyles.documentHeaderText, { color: colors.card }]}>{docTitle}</Text>
          <Text style={[localStyles.documentText, { color: colors.card }]}>{contact?.name}</Text>
        </View>
        <View style={localStyles.listContainer}>
          <View style={localStyles.avatarRow} />
          <View style={localStyles.goodInfo}>
            <Text style={localStyles.productBarcodeView}>Наименование ТМЦ</Text>
          </View>
          <View style={localStyles.remainsInfo}>
            <Text style={localStyles.productBarcodeView}>Партия</Text>
          </View>
          <View style={localStyles.remainsInfo}>
            <Text style={localStyles.productBarcodeView}>Заявка</Text>
          </View>
          <View style={localStyles.remainsInfo}>
            <Text style={localStyles.productBarcodeView}>Кол-во</Text>
          </View>
          {document?.head?.status === 0 && (
            <View style={localStyles.remainsInfo}>
              <Text style={localStyles.productBarcodeView} />
            </View>
          )}
        </View>
        <FlatList
          ref={refList}
          data={document.lines ?? []}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
        />
        <ItemSeparator />
        <SubTitle styles={[localStyles.totalsTitle, { backgroundColor: colors.background }]}>Итого</SubTitle>
        <View style={[localStyles.flexDirectionRow, localStyles.lineTotal]}>
          <Text style={localStyles.fontWeightBold}>Товар:</Text>
          <Text style={localStyles.fontWeightBold}>
            {`нетто: ${formatValue(totalNetWeight)}  -  брутто: ${formatValue(totalNetWeight + boxingTotals.weight)}`}
          </Text>
        </View>
        <ItemSeparator />
        <View style={[localStyles.flexDirectionRow, localStyles.lineTotal]}>
          <Text style={localStyles.fontWeightBold}>Тара:</Text>
          <Text style={localStyles.fontWeightBold}>
            {`кол-во: ${formatValue(boxingTotals.qty)}  -  вес: ${formatValue(boxingTotals.weight)}`}
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
            <View style={localStyles.buttons}>
              <FAB
                style={localStyles.fab}
                icon="barcode-scan"
                onPress={() => navigation.navigate('ScanBarCodeScreen', { docId: document?.id, weighedGood: true })}
              />
              <FAB
                style={localStyles.fab}
                icon="barcode"
                onPress={() => navigation.navigate('SellProductsList', { docId: document?.id, weighedGood: true })}
              />
              <FAB
                style={localStyles.fab}
                icon="plus"
                onPress={() => navigation.navigate('SellProductsList', { docId: document?.id })}
              />
              <FAB
                style={localStyles.fab}
                icon="check"
                onPress={() =>
                  actions.editStatusDocument({
                    id: docId,
                    status: document?.head?.status + 1,
                  })
                }
              />
            </View>
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
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-evenly',
    margin: 15,
  },
  container: {
    padding: 0,
  },
  documentHeader: {
    flexDirection: 'column',
    height: 50,
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  documentHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  documentText: {
    textAlign: 'center',
  },
  fab: {
    backgroundColor: Colors.blue600,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  fontWeightBold: {
    fontWeight: 'bold',
  },
  goodInfo: {
    flexBasis: '25%',
    marginLeft: 15,
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
    flexBasis: 40,
    flexGrow: 1,
    marginRight: 5,
  },
  totalsTitle: {
    padding: 10,
  },
});
