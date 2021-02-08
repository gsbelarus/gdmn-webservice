import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback, useLayoutEffect, useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, Switch } from 'react-native-paper';

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
  const { state: appState, actions: appActions } = useAppStore();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [statusId, setStatusId] = useState(0);

  const docId = route.params?.docId;

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const isBlocked = statusId !== 0;

  const statusName =
    docId !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа';

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

  const { date, docnumber, tocontactId, fromcontactId, expeditorId, doctype, status } = useMemo(() => {
    return ((appState.formParams as unknown) || {}) as IDocumentParams;
  }, [appState.formParams]);

  useEffect(() => {
    //Создания объекта в store для экрана создания или редактирования шапки документа
    const docObj = docId !== undefined && (appState.documents?.find((i) => i.id === docId) as ISellDocument);

    setStatusId(docObj?.head?.status || 0);

    console.log('docObj', docObj);
    // Инициализируем параметры
    if (docObj) {
      appActions.setFormParams({
        ...(docObj?.head as IDocumentParams),
      });
    } else {
      appActions.setFormParams({
        docnumber: undefined,
        date: new Date().toISOString().slice(0, 10),
        doctype: docTypes?.length === 1 ? docTypes[0].id : undefined,
        status: 0,
      });
    }
  }, [appActions, docId, appState.documents, docTypes]);

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
  }, [addDocument, appActions, checkDocument, date, docId, navigation, updateDocument]);

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

  //---Окно календаря для выбора даты документа---
  const [showDate, setShowDate] = useState(false);

  const handleApplyDate = (event, selectedDate) => {
    //Закрываем календарь и записываем выбранную дату в параметры формы
    setShowDate(false);
    if (selectedDate) {
      appActions.setFormParams({ ...appState.formParams, date: selectedDate.toISOString().slice(0, 10) });
    }
  };

  return (
    <>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{statusName}</SubTitle>
      <View style={[localStyles.container, { backgroundColor: colors.card }]}>
        <ScrollView>
          {(statusId === 0 || statusId === 1) && (
            <>
              <View style={localStyles.fieldContainer}>
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
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Номер:</Text>
            <TextInput
              editable={!isBlocked}
              style={[localStyles.input, { borderColor: colors.border }]}
              onChangeText={(text) => appActions.setFormParams({ ...appState.formParams, docnumber: text.trim() })}
              value={docnumber || ' '}
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Дата: </Text>
            <ReferenceItem value={getDateString(date)} disabled={isBlocked} onPress={() => setShowDate(true)} />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Тип:</Text>
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
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Экспедитор:</Text>
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
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Подразделение:</Text>
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
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Организация:</Text>
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
                      navigation.navigate('SellDocumentsListScreen');
                    },
                  },
                  {
                    text: 'Отмена',
                  },
                ]);
              }}
              style={localStyles.buttonContainer}
            >
              <Text style={localStyles.button}>Удалить документ</Text>
            </TouchableOpacity>
          )}
          {showDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(date)}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={handleApplyDate}
            />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export { CreateSellDocumentScreen };

const localStyles = StyleSheet.create({
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
    width: '20%',
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
