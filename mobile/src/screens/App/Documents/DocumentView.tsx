/* eslint-disable react-hooks/exhaustive-deps */
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme, useScrollToTop, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Colors, FAB, IconButton, Button } from 'react-native-paper';

import { IDocument, ILine, IHead, IReference, IGood, IContact } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const statusColors = ['#C52900', '#C56A00', '#008C3D', '#06567D'];

const ContentItem = React.memo(({ item, status }: { item: ILine; status: number }) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const docId = useRoute<RouteProp<DocumentStackParamList, 'DocumentView'>>().params?.docId;

  const good: IGood = useMemo(() => {
    return ((state.references?.goods as unknown) as IReference<IGood>)?.data.find((i) => i.id === item.goodId);
  }, [item?.goodId, state.references?.goods]);

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

const LineItem = React.memo(({ item, status, docId }: { item: ILine; status: number; docId: number }) => {
  const navigation = useNavigation();
  const { actions } = useAppStore();

  return status === 0 ? (
    <TouchableOpacity
      style={localStyles.listContainer}
      onPress={() => {
        // actions.setBoxingsLine([{ docId, lineDoc: item.id, lineBoxings: item.tara ?? [] }]);
        navigation.navigate('DocumentLineEdit', { lineId: item.id, prodId: item.goodId, docId, modeCor: true });
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

type Props = StackScreenProps<DocumentStackParamList, 'DocumentView'>;

// const notFound: IContact = { id: -1, name: '', contactType: -1 };

const DocumentViewScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();
  const showActionSheet = useActionSheet();
  const navigation = useNavigation();
  // const [docId, setDocId] = useState<number>(undefined);

  const contacts = useMemo(() => state.references?.contacts?.data as IContact[], [state.references?.contacts?.data]);

  const docId = useRoute<RouteProp<DocumentStackParamList, 'DocumentView'>>().params?.docId;

  // useEffect(() => {
  //   if (!route.params?.docId) {
  //     return;
  //   }

  //   setDocId(route.params.docId);
  // }, [route.params?.docId]);

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  const contact = useMemo(() => contacts?.find((item: { id: number }) => item.id === document?.head?.tocontactId), [
    document?.head?.tocontactId,
    contacts,
  ]);

  const refList = React.useRef<FlatList<ILine>>(null);

  const documentLines = useMemo(() => document?.lines as ILine[], [document?.lines]);

  useScrollToTop(refList);

  const renderItem = ({ item }: { item: ILine }) => (
    <LineItem item={item} status={document?.head?.status} docId={document?.id} />
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
                    navigation.navigate('DocumentEdit', { docId });
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
                  actions.updateDocumentStatus({
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
                        navigation.navigate('DocumentList');
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
            { backgroundColor: document?.head?.status === 0 ? colors.primary : statusColors[1] },
          ]}
        >
          <View style={localStyles.header}>
            <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
              №{(document?.head as IHead)?.docnumber} от {new Date(document?.head?.date)?.toLocaleDateString()} г.
            </Text>
            <Text numberOfLines={5} style={[localStyles.documentHeaderText, { color: colors.card }]}>
              {contact?.name}
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
            Общее кол-во:{' '}
            {(documentLines ?? []).reduce(
              (total, line) => Number.parseFloat(((Number(line.quantity) ?? 0) + total).toFixed(3)),
              0,
            )}{' '}
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
            <>
              {/*               <FAB
                style={localStyles.fabScan}
                icon="barcode-scan"
                onPress={() => navigation.navigate('ScanBarCode', { docId: document.id })}
              /> */}
              <FAB
                style={localStyles.fabAdd}
                icon="plus"
                onPress={() => navigation.navigate('GoodList', { docId: document.id })}
              />
            </>
          )}
        </View>
      </View>
    </>
  ) : null;
};

export { DocumentViewScreen };

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
  buttonDelete: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
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
    bottom: 35,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  /*   fabScan: {
    backgroundColor: Colors.blue600,
    bottom: 35,
    left: 0,
    margin: 20,
    position: 'absolute',
  }, */
  flexDirectionRow: {
    flexDirection: 'row',
  },
  fontWeightBold: {
    fontWeight: 'bold',
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
