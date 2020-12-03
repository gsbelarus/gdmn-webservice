import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Text, Switch } from 'react-native-paper';

import { IDocument, IRefData } from '../../../../../common';
import { IContact, IDepartment, IOutlet, IRoad } from '../../../../../common/base';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { getDateString, getNextDocId } from '../../../helpers/utils';
import { IDocumentParams, IListItem } from '../../../model/types';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentEdit'>;

const DocumentEditScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state: appState, actions: appActions } = useAppStore();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [statusId, setStatusId] = useState(0);

  const docId = route.params?.docId;

  const {
    date = today.toISOString().slice(0, 10),
    docnumber = Math.floor(Math.random() * 10000).toString(),
    doctype = appState.references?.documenttypes?.data[0].id,
    contactId,
    outletId,
    roadId = appState.references?.roads?.data[0].id,
    departId,
    ondate = tomorrow.toISOString().slice(0, 10),
    status = 0,
  } = useMemo(() => {
    return ((appState.forms?.documentParams as unknown) || {}) as IDocumentParams;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.forms?.documentParams]);

  const contacts = useMemo(() => appState.references?.contacts?.data as IContact[], [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    appState.references?.contacts?.data,
  ]);
  const departments = useMemo(() => appState.references?.departments?.data as IDepartment[], [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    appState.references?.departments?.data,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const outlets = useMemo(() => appState.references?.outlets?.data as IOutlet[], [appState.references?.outlets?.data]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roads = useMemo(() => appState.references?.roads?.data as IRoad[], [appState.references?.roads?.data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const docTypes = useMemo(() => appState.references?.documenttypes?.data, [appState.references?.documenttypes?.data]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const isBlocked = useMemo(() => {
    return statusId !== 0 && statusId !== 4;
  }, [statusId]);

  // const isEditable = useMemo(() => statusId === 0, [statusId]);

  const statusName = useMemo(
    () =>
      docId !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа',
    [docId, isBlocked],
  );

  const getListItems = <T extends IRefData>(con: T[]): IListItem[] =>
    con?.map((item) => ({ id: item.id, value: item.name }));

  const listContacts = useMemo(() => getListItems(contacts), [contacts]);
  const listDepartments = useMemo(() => getListItems(departments), [departments]);
  const listOutlets = useMemo(() => getListItems(outlets), [outlets]);
  const listRoads = useMemo(() => getListItems(roads), [roads]);
  //const listDocumentType = useMemo(() => getListItems(docTypes), [docTypes]);

  const checkDocument = useCallback(() => {
    const res = date && docnumber && outletId && contactId && ondate;

    if (!res) {
      Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
    }

    return res;
  }, [date, docnumber, contactId, ondate, outletId]);

  const updateDocument = useCallback(() => {
    appActions.updateDocument({
      id: docId,
      head: {
        doctype,
        contactId,
        outletId,
        date,
        status,
        docnumber,
        roadId,
        departId,
        ondate,
      },
    });
    return docId;
  }, [appActions, docId, doctype, contactId, outletId, date, status, docnumber, roadId, departId, ondate]);

  const addDocument = useCallback(() => {
    const id = getNextDocId(appState.documents);

    appActions.addDocument({
      id,
      head: {
        doctype,
        contactId,
        outletId,
        date,
        status,
        docnumber,
        roadId,
        departId,
        ondate,
      },
      lines: [],
    });
    return id;
  }, [appActions, appState.documents, date, departId, docnumber, doctype, contactId, ondate, roadId, status, outletId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            appActions.clearForm('documentParams');
            // При нажатии 'отмена' если редактирование документа
            // то возвращаемся к документу, иначе к списку документов
            docId !== undefined ? navigation.navigate('DocumentView', { docId }) : navigation.navigate('DocumentList');
          }}
        />
      ),
      headerRight: () =>
        (statusId === 0 || statusId === 1 || statusId === 4) && (
          <HeaderRight
            text="Готово"
            onPress={() => {
              if (!checkDocument()) {
                return;
              }

              const id = docId !== undefined ? updateDocument() : addDocument();

              if (!id) {
                return;
              }

              appActions.clearForm('documentParams');
              navigation.navigate('DocumentView', { docId: id });
            }}
          />
        ),
    });
  }, [addDocument, appActions, checkDocument, docId, isBlocked, navigation, statusId, updateDocument]);

  useFocusEffect(
    React.useCallback(() => {
      if (appState.forms?.documentParams) {
        return;
      }

      const docObj = docId !== undefined && (appState.documents?.find((i) => i.id === docId) as IDocument);

      setStatusId(docObj?.head?.status || 0);

      // Инициализируем параметры
      appActions.setForm(
        docId !== undefined
          ? {
              name: 'documentParams',
              id: docObj?.id,
              ...(docObj?.head as IDocumentParams),
            }
          : {
              name: 'documentParams',
              date,
            },
      );
    }, [appActions, appState, date, docId]),
  );

  useEffect(() => {
    //если выбрать магазин, необходимо автоматически указать организацию
    if (!appState.forms?.documentParams) {
      return;
    }

    if (!outlets || !outletId) {
      return;
    }

    const newContactId = outlets.find((item) => item.id === outletId)?.parent;

    if (newContactId === contactId) {
      return;
    }

    appActions.setForm({
      ...appState.forms?.documentParams,
      contactId: outlets.find((item) => item.id === outletId)?.parent,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActions, outletId, outlets]);

  useEffect(() => {
    //если изменилась организация, ранее выбранный магазин сбрасывается
    if (!appState.forms?.documentParams || !outletId) {
      return;
    }

    if (contactId && outlets.find((item) => item.id === outletId)?.parent === contactId) {
      return;
    }

    appActions.setForm({
      ...appState.forms?.documentParams,
      outletId: undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActions, contactId]);

  const ReferenceItem = useCallback(
    (item: { value: string; onPress: () => void; color?: string; disabled?: boolean }) => {
      return (
        <TouchableOpacity
          {...item}
          onPress={item.disabled ? null : item.onPress}
          style={[localeStyles.picker, { borderColor: colors.border }]}
        >
          <Text numberOfLines={2} style={[localeStyles.pickerText, { color: colors.text }]}>
            {item.value || 'не выбрано'}
          </Text>
          {!item.disabled && <MaterialCommunityIcons name="menu-right" size={30} color={colors.primary} />}
        </TouchableOpacity>
      );
    },
    [colors.border, colors.primary, colors.text],
  );

  return (
    <>
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>{statusName}</SubTitle>
      <View style={[localeStyles.container, { backgroundColor: colors.card }]}>
        <ScrollView>
          {(statusId === 0 || statusId === 1 || statusId === 4) && (
            <>
              <View style={localeStyles.fieldContainerRow}>
                <Text>Черновик:</Text>
                <Switch
                  value={status === 0}
                  disabled={docId === undefined}
                  onValueChange={() => {
                    appActions.setForm({ ...appState.forms?.documentParams, status: status === 0 ? 1 : 0 });
                  }}
                />
              </View>
            </>
          )}
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Номер:</Text>
            <TextInput
              editable={!isBlocked}
              style={[localeStyles.input, { borderColor: colors.border }]}
              onChangeText={(text) => appActions.setForm({ ...appState.forms?.documentParams, docnumber: text.trim() })}
              value={docnumber || ' '}
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Дата заявки: </Text>
            <ReferenceItem
              value={getDateString(date || today.toISOString())}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectDate', {
                  formName: 'documentParams',
                  fieldName: 'date',
                  title: 'Дата документа',
                  value: date,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Дата отгрузки: </Text>
            <ReferenceItem
              value={getDateString(ondate || tomorrow.toISOString())}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectDate', {
                  formName: 'documentParams',
                  fieldName: 'ondate',
                  title: 'Дата отгрузки',
                  value: ondate,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <View style={[localeStyles.inputCaption, localeStyles.fieldInfo]}>
              <Text>Организация:</Text>
              {contactId ? (
                <TouchableOpacity
                  style={localeStyles.info}
                  onPress={() => {
                    navigation.navigate('Info', { about: 'Contact', id: contactId });
                  }}
                >
                  <MaterialCommunityIcons name="information-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              ) : undefined}
            </View>
            <ReferenceItem
              value={selectedItem(listContacts, contactId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItem', {
                  formName: 'documentParams',
                  title: 'Организация',
                  fieldName: 'contactId',
                  list: listContacts,
                  value: [contactId],
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <View style={[localeStyles.inputCaption, localeStyles.fieldInfo]}>
              <Text>Магазин:</Text>
              {outletId ? (
                <TouchableOpacity
                  style={localeStyles.info}
                  onPress={() => {
                    navigation.navigate('Info', { about: 'Outlet', id: outletId });
                  }}
                >
                  <MaterialCommunityIcons name="information-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              ) : undefined}
            </View>
            <ReferenceItem
              value={selectedItem(listOutlets, outletId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItem', {
                  formName: 'documentParams',
                  title: 'Магазин',
                  fieldName: 'outletId',
                  list: contactId
                    ? listOutlets.filter(
                        (item) => outlets.find((outlet) => outlet.id === item.id)?.parent === contactId,
                      )
                    : listOutlets,
                  value: [outletId],
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Склад:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, departId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItem', {
                  formName: 'documentParams',
                  title: 'Склад',
                  fieldName: 'departId',
                  list: listDepartments,
                  value: [departId],
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Маршрут:</Text>
            <ReferenceItem
              value={selectedItem(listRoads, roadId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItem', {
                  formName: 'documentParams',
                  title: 'Маршрут',
                  fieldName: 'roadId',
                  list: listRoads,
                  value: [roadId],
                })
              }
            />
          </View>
          {docId !== undefined && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Вы уверены, что хотите удалить документ?', '', [
                  {
                    text: 'OK',
                    onPress: async () => {
                      appActions.deleteDocument(docId);
                      navigation.navigate('DocumentList');
                    },
                  },
                  {
                    text: 'Отмена',
                  },
                ]);
              }}
              style={localeStyles.buttonContainer}
            >
              <Text style={localeStyles.button}>Удалить документ</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export { DocumentEditScreen };

const localeStyles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    backgroundColor: '#FC3F4D',
    borderRadius: 10,
    elevation: 8,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
    // eslint-disable-next-line react-native/sort-styles
    paddingBottom: 5,
  },
  fieldContainer: {
    flexDirection: 'column',
    margin: 5,
  },
  fieldContainerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    margin: 5,
  },
  fieldInfo: {
    flexDirection: 'row',
  },
  info: {
    marginLeft: 5,
  },
  input: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexGrow: 1,
    height: 40,
    padding: 10,
  },
  inputCaption: {
    paddingVertical: 5,
  },
  picker: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    flex: 1,
    padding: 10,
  },
  title: {
    padding: 10,
  },
});
