import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Switch } from 'react-native-paper';

import { IContact } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { getDateString, getNextDocId } from '../../../helpers/utils';
import { IListItem } from '../../../model';
import { IDocumentParams, ISellDocument } from '../../../model/sell';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';

type Props = StackScreenProps<RootStackParamList, 'CreateSellDocument'>;

const CreateSellDocumentScreen = ({ route }: Props) => {
  const [selectedDocType, setSelectedDocType] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<number>();
  const { state: appState, actions: appActions } = useAppStore();
  const [statusId, setStatusId] = useState(0);
  const docId = route.params?.docId;
  const { colors } = useTheme();
  const navigation = useNavigation();

  const {
    date = new Date().toISOString().slice(0, 10),
    docnumber,
    tocontactId,
    fromcontactId,
    expeditorId,
    doctype,
    status = 0,
  } = useMemo(() => {
    return ((appState.formParams as unknown) || {}) as IDocumentParams;
  }, [appState.formParams]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const isBlocked = useMemo(() => statusId !== 0, [statusId]);

  const statusName = useMemo(
    () =>
      docId !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа',
    [docId, isBlocked],
  );

  const getListItems = (contacts: IContact[]) =>
    contacts.map((item) => {
      return { id: item.id, value: item.name } as IListItem;
    });

  const people: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === '2'), [appState.contacts]);
  const listPeople = useMemo(() => getListItems(people), [people]);
  const companies: IContact[] = appState.contacts.filter((item) => item.type === '3');
  const listCompanies = useMemo(() => getListItems(companies), [companies]);
  const departments: IContact[] = appState.contacts.filter((item) => item.type === '4');
  const listDepartments = useMemo(() => getListItems(departments), [departments]);

  const docTypes = useMemo(() => getListItems(appState.documentTypes ?? []), [appState.documentTypes]);

  const checkDocument = useCallback(() => {
    const res = date && docnumber && tocontactId && fromcontactId && doctype;

    if (!res) {
      Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
    }

    return res;
  }, [date, docnumber, doctype, fromcontactId, tocontactId]);

  const updateDocument = useCallback(() => {
    appActions.editDocument({
      id: docId,
      head: {
        doctype,
        fromcontactId,
        tocontactId,
        date,
        expeditorId,
        status,
        docnumber,
      },
    });
    return docId;
  }, [appActions, docId, doctype, fromcontactId, tocontactId, date, expeditorId, status, docnumber]);

  const addDocument = useCallback(() => {
    const id = getNextDocId(appState.documents as ISellDocument[]);

    appActions.newDocument({
      id,
      head: {
        doctype,
        fromcontactId,
        tocontactId,
        expeditorId,
        date,
        status,
        docnumber,
      },
      lines: [],
    });
    return id;
  }, [appActions, appState.documents, date, docnumber, doctype, expeditorId, fromcontactId, status, tocontactId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            // eslint-disable-next-line @babel/no-unused-expressions
            docId !== undefined
              ? navigation.navigate('ViewSellDocument', { docId })
              : navigation.navigate('SellDocumentsListScreen');
          }}
        />
      ),
      headerRight: () => (
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

            appActions.clearFormParams();
            navigation.navigate('ViewSellDocument', { docId: id });
          }}
        />
      ),
    });
  }, [
    addDocument,
    appActions,
    checkDocument,
    date,
    docId,
    navigation,
    selectedContact,
    selectedDocType,
    updateDocument,
  ]);

  useEffect(() => {
    if (route.params?.docId !== undefined) {
      const documet = appState.documents.find((item) => item.id === route.params.docId);
      setSelectedDocType(documet.head?.doctype);
      setSelectedContact(documet.head?.fromcontactId);
    }
  }, [appState.documents, route.params]);

  useEffect(() => {
    if (appState.formParams) {
      return;
    }

    const docObj = docId !== undefined && (appState.documents?.find((i) => i.id === docId) as ISellDocument);

    setStatusId(docObj?.head?.status || 0);

    // Инициализируем параметры
    if (docId) {
      appActions.setFormParams({
        ...(docObj?.head as IDocumentParams),
      });
    } else {
      appActions.setFormParams({
        date,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActions, docId]);

  const ReferenceItem = useCallback(
    (item: { value: string; onPress: () => void; color?: string; disabled?: boolean }) => {
      return (
        <TouchableOpacity
          {...item}
          onPress={item.disabled ? null : item.onPress}
          style={[localeStyles.picker, { borderColor: colors.border }]}
        >
          <Text style={[localeStyles.pickerText, { color: colors.text }]}>{item.value || 'не выбрано'}</Text>
          {!item.disabled && (
            <MaterialCommunityIcons
              style={localeStyles.pickerButton}
              name="menu-right"
              size={30}
              color={colors.primary}
            />
          )}
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
          {(statusId === 0 || statusId === 1) && (
            <>
              <View style={localeStyles.fieldContainer}>
                <Text>Черновик:</Text>
                <Switch
                  value={status === 0}
                  disabled={docId === undefined}
                  onValueChange={() => {
                    appActions.setFormParams({ ...appState.formParams, status: status === 0 ? 1 : 0 });
                  }}
                />
              </View>
              <ItemSeparator />
            </>
          )}
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Номер:</Text>
            <TextInput
              editable={!isBlocked}
              style={[localeStyles.input, { borderColor: colors.border }]}
              onChangeText={(text) => appActions.setFormParams({ ...appState.formParams, docnumber: text.trim() })}
              value={docnumber || ' '}
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Дата: </Text>
            <ReferenceItem
              value={getDateString(date || new Date().toISOString())}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  fieldName: 'date',
                  title: 'Дата документа',
                  value: date,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Тип:</Text>
            <ReferenceItem
              value={selectedItem(docTypes, doctype)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  fieldName: 'doctype',
                  title: 'Тип документа',
                  list: docTypes,
                  value: doctype,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Экспедитор:</Text>
            <ReferenceItem
              value={selectedItem(listPeople, expeditorId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  title: 'Экспедитор',
                  fieldName: 'expeditorId',
                  list: listPeople,
                  value: expeditorId,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Подразделение:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, fromcontactId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  title: 'Подразделение',
                  fieldName: 'fromcontactId',
                  list: listDepartments,
                  value: fromcontactId,
                })
              }
            />
          </View>
          <View style={localeStyles.fieldContainer}>
            <Text style={localeStyles.inputCaption}>Организация:</Text>
            <ReferenceItem
              value={selectedItem(listCompanies, tocontactId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  title: 'Организация',
                  fieldName: 'tocontactId',
                  list: listCompanies,
                  value: tocontactId,
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

export { CreateSellDocumentScreen };

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
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  container: {
    paddingHorizontal: 5,
  },
  fieldContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    margin: 5,
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
    width: 70,
  },
  picker: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
  },
  pickerButton: {
    alignSelf: 'center',
    padding: 0,
    textAlign: 'right',
  },
  pickerText: {
    alignSelf: 'center',
    flexGrow: 1,
    padding: 10,
  },
  title: {
    padding: 10,
  },
});
