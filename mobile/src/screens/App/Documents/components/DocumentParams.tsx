import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import config from '../../../../config';
import { getNextDocNumber } from '../../../../helpers/utils';
import { IDocumentParams, IListItem } from '../../../../model/types';
import { DocumentStackParamList } from '../../../../navigation/DocumentsNavigator';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentEdit'>;

const DocumentEditScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  // const { state: appState, actions: appActions } = useAppStore();

  // const [statusId, setStatusId] = useState(0);

  // const docId = route.params?.docId;

  // const {
  //   date = new Date().toISOString().slice(0, 10),
  //   docnumber = getNextDocNumber(appState.documents),
  //   tocontactId = -1,
  //   fromcontactId,
  //   doctype = config.system[0].defaultDocType[0],
  //   status = 0,
  // } = useMemo(() => {
  //   return ((appState.forms?.documentParams as unknown) || {}) as IDocumentParams;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [appState.forms?.documentParams, docId]);

  // const contacts = useMemo(() => appState.references?.contacts?.data, [appState.references?.contacts?.data]);

  // const docTypes = useMemo(() => appState.references?.documenttypes?.data, [appState.references?.documenttypes?.data]);

  // const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
  //   // eslint-disable-next-line eqeqeq
  //   return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id == id));
  // }, []);

  // const isBlocked = useMemo(() => statusId !== 0, [statusId]);

  // const statusName = useMemo(
  //   () =>
  //     docId !== undefined ? (!isBlocked ? 'Редактирование Документа' : 'Просмотр документа') : 'Создание документа',
  //   [docId, isBlocked],
  // );

  // const getListItems = <T extends IRefData>(con: T[]): IListItem[] =>
  //   con?.map((item) => ({ id: item.id, value: item.name }));

  // const departments: IContact[] = useMemo(() => {
  //   // return ((contacts as unknown) as IContact[])?.filter((item) => item.contactType === 4);
  //   return (contacts as unknown) as IContact[];
  // }, [contacts]);

  // const listDepartments = useMemo(() => getListItems(departments), [departments]);

  // const listDocumentType = useMemo(() => getListItems(docTypes as IRefData[]), [docTypes]);

  // const checkDocument = useCallback(() => {
  //   const res = date && docnumber && tocontactId && fromcontactId && doctype;

  //   if (!res) {
  //     Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
  //   }

  //   return res;
  // }, [date, docnumber, doctype, fromcontactId, tocontactId]);

  // const updateDocument = useCallback(() => {
  //   appActions.updateDocument({
  //     id: docId,
  //     head: {
  //       doctype,
  //       fromcontactId,
  //       tocontactId,
  //       date,
  //       status,
  //       docnumber,
  //     },
  //   });
  //   return docId;
  // }, [appActions, docId, doctype, fromcontactId, tocontactId, date, status, docnumber]);

  // const addDocument = useCallback(() => {
  //   const id = getNextDocId(appState.documents);

  //   appActions.addDocument({
  //     id,
  //     head: {
  //       doctype,
  //       fromcontactId,
  //       tocontactId,
  //       date,
  //       status,
  //       docnumber,
  //     },
  //     lines: [],
  //   });
  //   return id;
  // }, [appActions, appState.documents, date, docnumber, doctype, fromcontactId, status, tocontactId]);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: '',
  //     headerLeft: () => (
  //       <HeaderRight
  //         text="Отмена"
  //         onPress={() => {
  //           appActions.clearForm('documentParams');
  //           // При нажатии 'отмена' если редактирование документа
  //           // то возвращаемся к документу, иначе к списку документов
  //           if (docId) {
  //             navigation.navigate('DocumentView', { docId });
  //           } else {
  //             navigation.navigate('DocumentList');
  //           }
  //         }}
  //       />
  //     ),
  //     headerRight: () =>
  //       (statusId === 0 || statusId === 1) && (
  //         <HeaderRight
  //           text="Готово"
  //           onPress={() => {
  //             if (!checkDocument()) {
  //               return;
  //             }

  //             const id = docId !== undefined ? updateDocument() : addDocument();

  //             if (!id) {
  //               return;
  //             }

  //             appActions.clearForm('documentParams');
  //             navigation.navigate('DocumentView', { docId: id });
  //           }}
  //         />
  //       ),
  //   });
  // }, [addDocument, appActions, checkDocument, docId, isBlocked, navigation, statusId, updateDocument]);

  // useEffect(() => {
  //   return () => {
  //     console.log('clear');
  //     appActions.clearForm('documentParams');
  //   };
  // }, [appActions]);

  // useEffect(() => {
  //   console.log('documentParams', appState.forms?.documentParams);
  //   if (appState.forms?.documentParams) {
  //     return;
  //   }

  //   const docObj = docId !== undefined && (appState.documents?.find((i) => i.id === docId) as IDocument);

  //   setStatusId(docObj?.head?.status || 0);

  //   // Инициализируем параметры
  //   if (docId) {
  //     appActions.setForm({
  //       documentParams: {
  //         id: docObj?.id,
  //         ...(docObj?.head as IDocumentParams),
  //       },
  //     });
  //   } else {
  //     appActions.setForm({ documentParams: { date, docnumber, tocontactId, doctype } });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [appActions, docId]);

  // const ReferenceItem = useCallback(
  //   (item: { value: string; onPress: () => void; color?: string; disabled?: boolean }) => {
  //     return (
  //       <TouchableOpacity
  //         {...item}
  //         onPress={item.disabled ? null : item.onPress}
  //         style={[localStyles.picker, { borderColor: colors.border }]}
  //       >
  //         <Text style={[localStyles.pickerText, { color: colors.text }]}>{item.value || 'не выбрано'}</Text>
  //         {!item.disabled && (
  //           <MaterialCommunityIcons
  //             style={localStyles.pickerButton}
  //             name="menu-right"
  //             size={30}
  //             color={colors.primary}
  //           />
  //         )}
  //       </TouchableOpacity>
  //     );
  //   },
  //   [colors.border, colors.primary, colors.text],
  // );

  return (
    <>
      {/* <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{statusName}</SubTitle> */}
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
          {/* <View style={localStyles.fieldContainer}>
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
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Тип:</Text>
            <ReferenceItem
              value={selectedItem(listDocumentType, doctype)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItem', {
                  formName: 'documentParams',
                  fieldName: 'doctype',
                  title: 'Тип документа',
                  list: listDocumentType,
                  value: [doctype],
                })
              }
            />
          </View>
          <ItemSeparator />
          <View style={localStyles.fieldContainer}>
            <Text style={localStyles.inputCaption}>Место:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, fromcontactId)?.value}
              disabled={isBlocked}
              onPress={() =>
                navigation.navigate('SelectItem', {
                  formName: 'documentParams',
                  title: 'Подразделение',
                  fieldName: 'fromcontactId',
                  list: listDepartments,
                  value: [fromcontactId],
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
              style={localStyles.buttonContainer}
            >
              <Text style={localStyles.button}>Удалить документ</Text>
            </TouchableOpacity>
          )} */}
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