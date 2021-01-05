import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback, useLayoutEffect, useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Chip, Text } from 'react-native-paper';

import { IContact } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { getDateString } from '../../../helpers/utils';
import { IListItem } from '../../../model';
import { IDocumentParams, ISellDocument } from '../../../model/sell';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type Props = StackScreenProps<RootStackParamList, 'CreateSellDocument'>;

const CreateSellDocumentScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state: appState, actions: appActions } = useAppStore();

  const [statusId, setStatusId] = useState(0);

  const today = new Date();

  const docId = route.params?.docId;

  const statusName = useMemo(() => (docId ? 'Редактирование Документа' : 'Создание документа'), [docId]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

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

  const docTypes = useMemo(() => getListItems(appState.documentTypes), [appState.documentTypes]);

  const checkDocument = useCallback(() => {
    const res =
      (appState.formParams as IDocumentParams)?.date &&
      (appState.formParams as IDocumentParams)?.docnumber &&
      (appState.formParams as IDocumentParams)?.expeditorId &&
      (appState.formParams as IDocumentParams)?.tocontactId &&
      (appState.formParams as IDocumentParams)?.fromcontactId &&
      (appState.formParams as IDocumentParams)?.doctype;

    if (!res) {
      Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
    }
    return res;
  }, [appState.formParams]);

  const updateDocument = useCallback(() => {
    appActions.editDocument({
      id: route.params?.docId,
      head: {
        doctype: (appState.formParams as IDocumentParams)?.doctype,
        fromcontactId: (appState.formParams as IDocumentParams)?.fromcontactId,
        tocontactId: (appState.formParams as IDocumentParams)?.tocontactId,
        date: (appState.formParams as IDocumentParams)?.date,
        status: statusId,
        docnumber: (appState.formParams as IDocumentParams)?.docnumber,
        expeditorId: (appState.formParams as IDocumentParams)?.expeditorId,
      },
    });
    return route.params?.docId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActions, route.params?.docId, appState.formParams, statusId]);

  const addDocument = useCallback(() => {
    const id =
      appState.documents
        .map((item) => item.id)
        .reduce((newId, currId) => {
          return newId > currId ? newId : currId;
        }, 0) + 1;

    appActions.newDocument({
      id,
      head: {
        doctype: (appState.formParams as IDocumentParams)?.doctype,
        fromcontactId: (appState.formParams as IDocumentParams)?.fromcontactId[0],
        tocontactId: (appState.formParams as IDocumentParams)?.tocontactId[0],
        date: (appState.formParams as IDocumentParams)?.date,
        status: statusId,
        docnumber: (appState.formParams as IDocumentParams)?.docnumber,
        expeditorId: (appState.formParams as IDocumentParams)?.expeditorId[0],
      },
      lines: [],
    });
    return id;
  }, [appActions, appState.formParams, appState.documents, statusId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            appActions.clearFormParams();
            if (!route.params) {
              navigation.navigate('SellDocumentsListScreen');
              return;
            }
            // При нажатии 'отмена' если редактирование документа
            // то возвращаемся к документу, иначе к списку документов
            // eslint-disable-next-line @babel/no-unused-expressions
            route.params?.docId
              ? navigation.navigate('ViewSellDocument', { docId: route.params?.docId })
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

            const id = route.params?.docId ? updateDocument() : addDocument();

            if (!id) {
              return;
            }

            appActions.clearFormParams();
            navigation.navigate('ViewSellDocument', { docId: id });
          }}
        />
      ),
    });
  }, [addDocument, appActions, navigation, route.params, checkDocument, updateDocument]);

  useEffect(() => {
    const docObj = docId !== undefined && (appState.documents?.find((i) => i.id === docId) as ISellDocument);

    setStatusId(docObj?.head?.status || 0);

    if (!appState.formParams && !route.params?.docId) {
      // Инициализируем параметры
      appActions.setFormParams({
        date: today.toISOString().slice(0, 10),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActions, appState.formParams, route.params?.docId, today]);

  useEffect(() => {
    if (!route.params) {
      return;
    }

    // eslint-disable-next-line @babel/no-unused-expressions
    route.params.docId && !appState.formParams
      ? appActions.setFormParams(appState.documents.find((i) => i.id === route.params.docId).head)
      : appActions.setFormParams(route.params as IDocumentParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params, appActions, appState.documents]);

  const ReferenceItem = useCallback(
    (item: { value: string; onPress: () => void; color?: string; disabled?: boolean }) => {
      return (
        <TouchableOpacity
          {...item}
          onPress={item.disabled ? null : item.onPress}
          style={[localStyles.picker, { borderColor: colors.border }]}
        >
          <Text style={[localStyles.pickerText, { color: colors.text }]}>{item.value || 'не выбрано'}</Text>
          {!item.disabled && (
            <MaterialCommunityIcons
              style={localStyles.pickerButton}
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
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{statusName}</SubTitle>
      <View style={[localStyles.container, { backgroundColor: colors.card }]}>
        <ScrollView>
          {/*  {(statusId === 0 || statusId === 1) && (
            <>
              <View style={localStyles.fieldContainer}>
                <Text>Черновик:</Text>
                <Switch
                  value={statusId === 0}
                  disabled={docId === undefined}
                  onValueChange={() => {
                    appActions.setFormParams({ status: statusId === 0 ? 1 : 0 });
                  }}
                />
              </View>
              <ItemSeparator />
            </>
          )} */}
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Номер:</Text>
            <TextInput
              style={[localStyles.input, { borderColor: colors.border }]}
              onChangeText={(text) => appActions.setFormParams({ docnumber: text.trim() })}
              value={(appState.formParams as IDocumentParams)?.docnumber || ' '}
            />
          </View>
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Дата: </Text>
            <ReferenceItem
              value={getDateString((appState.formParams as IDocumentParams)?.date || new Date().toISOString())}
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'CreateSellDocument',
                  fieldName: 'date',
                  title: 'Дата документа:',
                  value: (appState.formParams as IDocumentParams)?.date,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Экспедитор:</Text>
            <ReferenceItem
              value={selectedItem(listPeople, (appState.formParams as IDocumentParams)?.expeditorId)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  fieldName: 'expeditorId',
                  title: 'Экспедитор',
                  list: listPeople,
                  value: (appState.formParams as IDocumentParams)?.expeditorId,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Подразделение:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, (appState.formParams as IDocumentParams)?.fromcontactId)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  title: 'Подразделение',
                  fieldName: 'fromcontactId',
                  list: listDepartments,
                  value: (appState.formParams as IDocumentParams)?.fromcontactId,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Организация:</Text>
            <ReferenceItem
              value={selectedItem(listCompanies, (appState.formParams as IDocumentParams)?.tocontactId)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  title: 'Организация',
                  fieldName: 'tocontactId',
                  list: listCompanies,
                  value: (appState.formParams as IDocumentParams)?.tocontactId,
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Тип документа:</Text>
            <ReferenceItem
              value={selectedItem(docTypes, (appState.formParams as IDocumentParams)?.doctype)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  title: 'Тип документа',
                  fieldName: 'doctype',
                  list: docTypes,
                  value: (appState.formParams as IDocumentParams)?.doctype,
                })
              }
            />
          </View>
          {/*  <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Тип документа: </Text>
            <ScrollView>
              {appState.documentTypes && appState.documentTypes.length !== 0 ? (
                appState.documentTypes.map((item, idx) => (
                  <Chip
                    key={idx}
                    mode="outlined"
                    style={[
                      localStyles.fieldContainer,
                      (appState.formParams as IDocumentParams)?.doctype === item.id
                        ? { backgroundColor: colors.primary }
                        : {},
                    ]}
                    onPress={() => appActions.setFormParams({ doctype: item.id })}
                    selected={(appState.formParams as IDocumentParams)?.doctype === item.id}
                    selectedColor={
                      (appState.formParams as IDocumentParams)?.doctype === item.id ? colors.card : colors.text
                    }
                  >
                    {item.name}
                  </Chip>
                ))
              ) : (
                <Text>Не найдено</Text>
              )}
            </ScrollView>
          </View>*/}
        </ScrollView>
      </View>
    </>
  );
};

export { CreateSellDocumentScreen };

const localStyles = StyleSheet.create({
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
