import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal, TouchableHighlight } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback, useLayoutEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Text, Switch } from 'react-native-paper';

import { IDocument, IRefData } from '../../../../../common';
import BottomSheet from '../../../components/BottomSheet';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import { RadioGroup } from '../../../components/RadioGroup';
import SubTitle from '../../../components/SubTitle';
import config from '../../../config';
import { getDateString, getNextDocId, getNextDocNumber } from '../../../helpers/utils';
import { IDocumentParams, IListItem } from '../../../model/types';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentEdit'>;

const DocumentEditScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state: appState, actions: appActions } = useAppStore();

  const [statusId, setStatusId] = useState(0);

  const docId = route.params?.docId;

  const departments = useMemo(() => appState.references?.contacts?.data, [appState.references?.contacts?.data]);

  const getListItems = <T extends IRefData>(con: T[]): IListItem[] =>
    con?.map((item) => ({ id: item.id, value: item.name }));

  const listDepartments = useMemo(() => getListItems(departments), [departments]);

  useEffect(() => {
    //Создания объекта в store для экрана создания или редактирования шапки документа
    //Выполняется при создании экрана
    console.log('1. appState.forms?.documentParams:', appState.forms?.documentParams);
    // if (appState.forms?.documentParams) {
    //   return;
    // }
    const docObj = docId !== undefined && (appState.documents?.find((i) => i.id === docId) as IDocument);

    setStatusId(docObj?.head?.status || 0);

    // Инициализируем параметры
    if (docId) {
      appActions.setForm({
        documentParams: {
          id: docObj?.id,
          ...(docObj?.head as IDocumentParams),
        },
      });
    } else {
      appActions.setForm({
        documentParams: {
          date: new Date().toISOString().slice(0, 10),
          docnumber: getNextDocNumber(appState.documents),
          fromcontactId: listDepartments.length === 1 ? listDepartments[0].id : -1,
          tocontactId: -1,
          doctype: config.system[0].defaultDocType[0],
          status: 0,
        },
      });
    }
    return () => {
      //Выполняется при уничтожении экрана
      console.log('clearForm');
      appActions.clearForm('documentParams');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActions, docId, appState.documents]);

  const { date, docnumber, tocontactId, fromcontactId, doctype, status } = useMemo(() => {
    console.log('2. appState.forms?.documentParams:', appState.forms?.documentParams);
    return ((appState.forms?.documentParams as unknown) || {}) as IDocumentParams;
  }, [appState.forms?.documentParams]);

  const docTypes = useMemo(() => appState.references?.documenttypes?.data, [appState.references?.documenttypes?.data]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    // eslint-disable-next-line eqeqeq
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id == id));
  }, []);

  const isBlocked = useMemo(() => statusId !== 0, [statusId]);

  const statusName = useMemo(
    () =>
      docId !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа',
    [docId, isBlocked],
  );

  // const departments: IContact[] = useMemo(() => {
  //   // return ((contacts as unknown) as IContact[])?.filter((item) => item.contactType === 4);
  //   return (contacts as unknown) as IContact[];
  // }, [contacts]);

  const listDocumentType = useMemo(() => getListItems(docTypes as IRefData[]), [docTypes]);

  const checkDocument = useCallback(() => {
    const res = date && docnumber && tocontactId && fromcontactId && doctype;

    if (!res) {
      Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
    }

    return res;
  }, [date, docnumber, doctype, fromcontactId, tocontactId]);

  const updateDocument = useCallback(() => {
    appActions.updateDocument({
      id: docId,
      head: {
        doctype,
        fromcontactId,
        tocontactId,
        date,
        status,
        docnumber,
      },
    });
    return docId;
  }, [appActions, docId, doctype, fromcontactId, tocontactId, date, status, docnumber]);

  const addDocument = useCallback(() => {
    const id = getNextDocId(appState.documents);

    appActions.addDocument({
      id,
      head: {
        doctype,
        fromcontactId,
        tocontactId,
        date,
        status,
        docnumber,
      },
      lines: [],
    });
    return id;
  }, [appActions, appState.documents, date, docnumber, doctype, fromcontactId, status, tocontactId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            // appActions.clearForm('documentParams');
            // При нажатии 'отмена' если редактирование документа
            // то возвращаемся к документу, иначе к списку документов
            if (docId) {
              navigation.navigate('DocumentView', { docId });
            } else {
              navigation.navigate('DocumentList');
            }
          }}
        />
      ),
      headerRight: () =>
        (statusId === 0 || statusId === 1) && (
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

              // appActions.clearForm('documentParams');
              navigation.navigate('DocumentView', { docId: id });
            }}
          />
        ),
    });
  }, [addDocument, appActions, checkDocument, docId, isBlocked, navigation, statusId, updateDocument, route]);

  // useEffect(() => {
  //   return () => {
  //     console.log('clearrr');
  //     appActions.clearForm('documentParams');
  //   };
  // }, [appActions]);

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

  // Окно bottomsheet для выбора типа документа
  const docTypeRef = useRef<BottomSheetModal>(null);

  const [selectedDocType, setSelectedDocType] = useState(selectedItem(listDocumentType, doctype));

  const handlePresentDocType = useCallback(() => {
    setSelectedDocType(selectedItem(listDocumentType, doctype));
    docTypeRef.current?.present();
  }, [listDocumentType, doctype, selectedItem]);

  const handleApplyDocType = useCallback(() => {
    appActions.setForm({
      documentParams: {
        ...appState.forms?.documentParams,
        doctype: selectedDocType?.id,
      },
    });
    docTypeRef.current?.dismiss();
  }, [appState.forms?.documentParams, appActions, selectedDocType?.id]);

  const handleDismissDocType = useCallback(() => {
    docTypeRef.current?.dismiss();
  }, []);

  // Окно bottomsheet для выбора подразделения
  const fromContactRef = useRef<BottomSheetModal>(null);

  const [selectedFromContact, setSelectedFromContact] = useState(selectedItem(listDepartments, fromcontactId));

  const handlePresentFromContact = useCallback(() => {
    setSelectedFromContact(selectedItem(listDepartments, fromcontactId) ?? listDepartments[0]);
    fromContactRef.current?.present();
  }, [listDepartments, fromcontactId, selectedItem]);

  const handleApplyFromContact = useCallback(() => {
    appActions.setForm({
      documentParams: {
        ...appState.forms?.documentParams,
        fromcontactId: selectedFromContact?.id,
      },
    });
    fromContactRef.current?.dismiss();
  }, [appState.forms?.documentParams, appActions, selectedFromContact?.id]);

  const handleDismissFromContact = useCallback(() => {
    fromContactRef.current?.dismiss();
  }, []);

  // Окно bottomsheet для выбора даты
  const dateRef = useRef<BottomSheetModal>(null);

  const [selectedDate, setSelectedDate] = useState(date);

  const handlePresentDate = useCallback(() => {
    setSelectedDate(date);
    dateRef.current?.present();
  }, [date]);

  const handleApplyDate = useCallback(() => {
    appActions.setForm({
      documentParams: {
        ...appState.forms?.documentParams,
        date: selectedDate,
      },
    });
    dateRef.current?.dismiss();
  }, [appState.forms?.documentParams, appActions, selectedDate]);

  const handleDismissDate = useCallback(() => {
    dateRef.current?.dismiss();
  }, []);

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
                    appActions.setForm({
                      documentParams: { ...appState.forms?.documentParams, status: status === 0 ? 1 : 0 },
                    });
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
              onChangeText={(text) =>
                appActions.setForm({ documentParams: { ...appState.forms?.documentParams, docnumber: text.trim() } })
              }
              value={docnumber || ' '}
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Дата: </Text>
            <ReferenceItem
              value={getDateString(date || new Date().toISOString())}
              disabled={isBlocked}
              onPress={handlePresentDate}
              // () =>
              // navigation.navigate('SelectDate', {
              //   formName: 'documentParams',
              //   fieldName: 'date',
              //   title: 'Дата документа',
              //   value: date,
              // })
              // }
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Тип:</Text>
            <ReferenceItem
              value={selectedItem(listDocumentType, doctype)?.value}
              disabled={isBlocked}
              onPress={handlePresentDocType}
              // navigation.navigate('SelectItem', {
              //   formName: 'documentParams',
              //   fieldName: 'doctype',
              //   title: 'Тип документа',
              //   list: listDocumentType,
              //   value: [doctype],
              // })
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Место:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, fromcontactId)?.value}
              disabled={isBlocked}
              onPress={handlePresentFromContact}
              //   navigation.navigate('SelectItem', {
              //     formName: 'documentParams',
              //     title: 'Подразделение',
              //     fieldName: 'fromcontactId',
              //     list: listDepartments,
              //     value: [fromcontactId],
              //   })
              // }
            />
          </View>
          {/*           <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Куда:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, tocontactId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItem', {
                  formName: 'documentParams',
                  title: 'Подразделение',
                  fieldName: 'tocontactId',
                  list: listDepartments,
                  value: tocontactId,
                })
              }
            />
          </View> */}
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
              style={localStyles.buttonContainer}
            >
              <Text style={localStyles.button}>Удалить документ</Text>
            </TouchableOpacity>
          )}
          <BottomSheet
            sheetRef={docTypeRef}
            title={'Тип'}
            handelDismiss={handleDismissDocType}
            handelApply={handleApplyDocType}
          >
            <RadioGroup
              options={listDocumentType}
              onChange={(option) => setSelectedDocType(option)}
              activeButtonId={selectedDocType?.id}
            />
          </BottomSheet>
          <BottomSheet
            sheetRef={fromContactRef}
            title={'Подразделение'}
            handelDismiss={handleDismissFromContact}
            handelApply={handleApplyFromContact}
          >
            <RadioGroup
              options={listDepartments}
              onChange={(option) => setSelectedFromContact(option)}
              activeButtonId={selectedFromContact?.id}
            />
          </BottomSheet>
          <BottomSheet
            sheetRef={dateRef}
            title={'Дата'}
            handelDismiss={handleDismissDate}
            handelApply={handleApplyDate}
          >
            <TouchableHighlight>
              <Calendar
                current={selectedDate}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: 'orange', disableTouchEvent: true },
                }}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                firstDay={1}
              />
            </TouchableHighlight>
          </BottomSheet>
        </ScrollView>
      </View>
    </>
  );
};

export { DocumentEditScreen };

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
    marginTop: 4,
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
