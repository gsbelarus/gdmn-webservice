import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme, useScrollToTop, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Colors, FAB, IconButton, Button, Avatar } from 'react-native-paper';
import { callbackify } from 'util';

import { ILine, IReference, IGood, IContact } from '../../../../../common';
import ItemSeparator from '../../../components/ItemSeparator';
import { statusColors } from '../../../constants';
import { useActionSheet } from '../../../helpers/useActionSheet';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const ContentItem = React.memo(({ item, isEditable }: { item: ILine; isEditable: boolean }) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const docId = useRoute<RouteProp<DocumentStackParamList, 'DocumentView'>>().params?.docId;

  const good: IGood = useMemo(() => {
    return ((state.references?.goods as unknown) as IReference<IGood>)?.data.find((i) => i.id === item.goodId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.goodId, state.references?.goods]);

  return (
    <>
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <Avatar.Icon size={38} icon="cube-outline" style={{ backgroundColor: colors.primary }} />
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
      {isEditable && (
        <View style={localStyles.remainsInfo}>
          <TouchableOpacity
            style={localStyles.buttonDelete}
            onPress={() => {
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

type Props = StackScreenProps<DocumentStackParamList, 'DocumentView'>;

// const notFound: IContact = { id: -1, name: '', contactType: -1 };

const DocumentViewScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();
  const showActionSheet = useActionSheet();
  const navigation = useNavigation();

  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const documentLines = useMemo(() => document?.lines as ILine[], [document?.lines]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isEditable = useMemo(() => document?.head?.status === 0, [document?.head?.status]);

  const docTitle = useMemo(() => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return `№${document?.head?.docnumber} от ${new Date(document?.head?.date)?.toLocaleDateString('BY-ru', options)}`;
  }, [document]);

  const documentTypeName = useMemo(
    () => state.references?.documenttypes?.data?.find((i) => i.id === document?.head?.doctype)?.name,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.references?.contacts?.data, document?.head],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contacts = useMemo(() => state.references?.contacts?.data as IContact[], [state.references?.contacts?.data]);

  const contact = useMemo(
    () => contacts?.find((item: { id: number }) => item.id === document?.head?.tocontactId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contacts, document.head?.tocontactId],
  );

  const totalQuantity = useMemo(() => {
    return (documentLines ?? []).reduce(
      // eslint-disable-next-line prettier/prettier
      (total, line) => Number.parseFloat(((Number(line.quantity) ?? 0) + total).toFixed(3)), 0);
  }, [documentLines]);

  const refList = React.useRef<FlatList<ILine>>(null);

  useScrollToTop(refList);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: documentTypeName || '',
      headerLeft: () => (
        <IconButton
          icon="file-document-box-multiple"
          size={24}
          onPress={() => {
            navigation.setOptions({ animationTypeForReplace: 'push' });
            navigation.navigate('DocumentList');
          }}
        />
      ),
      headerRight: () => (
        <IconButton
          icon="file-document-edit"
          size={24}
          onPress={() => {
            navigation.navigate('DocumentEdit', { docId });
          }}
        />
      ),
    });
  }, [actions, docId, navigation, showActionSheet, documentTypeName]);

  const LineItem = useCallback(
    ({ item }: { item: ILine }) => {
      return (
        <TouchableOpacity
          style={localStyles.listContainer}
          disabled={!isEditable}
          onPress={() => {
            navigation.navigate('DocumentLineEdit', { lineId: item.id, prodId: item.goodId, docId, modeCor: true });
          }}
        >
          <ContentItem item={item} isEditable={isEditable} />
        </TouchableOpacity>
      );
    },
    [isEditable, navigation, docId],
  );

  return document ? (
    <>
      <View style={[styles.container, localStyles.container, { backgroundColor: colors.card }]}>
        <View style={[localStyles.documentHeader, { backgroundColor: statusColors[document?.head?.status] }]}>
          <Text style={[localStyles.documentHeaderText, { color: colors.card }]}>{docTitle}</Text>
          <Text style={[localStyles.documentText, { color: colors.card }]}>{contact?.name}</Text>
        </View>
        <View style={[localStyles.header, { borderColor: colors.border }]}>
          <Text>Наименование ТМЦ</Text>
          <Text>Кол-во</Text>
        </View>
        <FlatList
          ref={refList}
          data={document.lines ?? []}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }: { item: ILine }) => <LineItem item={item} />}
          ItemSeparatorComponent={ItemSeparator}
        />
        <ItemSeparator />
        <View style={[localStyles.flexDirectionRow, localStyles.lineTotal]}>
          <Text style={localStyles.fontWeightBold}>Общее кол-во:</Text>
          <Text style={localStyles.fontWeightBold}>{totalQuantity}</Text>
        </View>
      </View>
      {isEditable && (
        <>
          {/* <FAB
                style={localStyles.fabScan}
                icon="barcode-scan"
                onPress={() => navigation.navigate('ScanBarCode', { docId: document.id })}
              /> */}
          <FAB
            style={[localStyles.fabAdd, { backgroundColor: colors.primary }]}
            icon="plus"
            onPress={() => navigation.navigate('GoodList', { docId: document.id })}
          />
        </>
      )}
    </>
  ) : null;
};

export { DocumentViewScreen };

const localStyles = StyleSheet.create({
  buttonDelete: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 0,
  },
  documentHeader: {
    flexDirection: 'column',
    height: 50,
    justifyContent: 'space-around',
  },
  documentHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  documentText: {
    textAlign: 'center',
  },
  fabAdd: {
    backgroundColor: Colors.blue600,
    bottom: 35,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  /*
    fabScan: {
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
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  header: {
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  lineTotal: {
    backgroundColor: '#eee',
    justifyContent: 'space-between',
    padding: 10,
  },
  listContainer: {
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  productBarcodeView: {
    fontSize: 12,
    opacity: 0.5,
  },
  productTitleView: {
    fontWeight: 'bold',
    maxHeight: 60,
    minHeight: 15,
  },
  remainsInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
});
