import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Chip } from 'react-native-paper';

import { IContact, IDocument } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { getDateString, getNextDocId, getNextDocLineId } from '../../../helpers/utils';
import { IDocumentParams, IListItem } from '../../../model/types';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentEdit'>;

const DocumentEditScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state: appState, actions: appActions } = useAppStore();

  const docId = useRoute<RouteProp<DocumentStackParamList, 'DocumentView'>>().params?.docId;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contacts = useMemo(() => appState.references?.contacts?.data, [appState.references?.contacts?.data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const docTypes = useMemo(() => appState.references?.documenttypes?.data, [appState.references?.documenttypes?.data]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const getListItems = (con: IContact[]): IListItem[] => con?.map((item) => ({ id: item.id, value: item.name }));

  const departments: IContact[] = useMemo(() => {
    // return ((contacts as unknown) as IContact[])?.filter((item) => item.contactType === 4);
    return (contacts as unknown) as IContact[];
  }, [contacts]);

  const listDepartments = useMemo(() => {
    return getListItems(departments);
  }, [departments]);

  const { date, docnumber, tocontactId, fromcontactId, doctype } = useMemo(() => {
    return ((appState.forms?.documentParams as unknown) || {}) as IDocumentParams;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.forms?.documentParams]);

  const checkDocument = useCallback(() => {
    const res = date && docnumber && tocontactId && fromcontactId && doctype;

    if (!res) {
      Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
    }

    return res;
  }, [date, docnumber, doctype, fromcontactId, tocontactId]);

  const updateDocument = useCallback(() => {
    appActions.updateDocument({
      id: Number(docId),
      head: {
        doctype,
        fromcontactId,
        tocontactId,
        date,
        status: 0,
        docnumber,
      },
    });
    return docId;
  }, [appActions, date, docnumber, doctype, fromcontactId, docId, tocontactId]);

  const addDocument = useCallback(() => {
    const id = getNextDocId(appState.documents);

    appActions.addDocument({
      id,
      head: {
        doctype,
        fromcontactId,
        tocontactId,
        date,
        status: 0,
        docnumber,
      },
      lines: [],
    });
    return id;
  }, [appActions, appState.documents, date, docnumber, doctype, fromcontactId, tocontactId]);

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
            docId ? navigation.navigate('DocumentView', { docId }) : navigation.navigate('DocumentList');
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

            const id = docId ? updateDocument() : addDocument();

            if (!id) {
              return;
            }

            appActions.clearForm('documentParams');
            navigation.navigate('DocumentView', { docId: id });
          }}
        />
      ),
    });
  }, [addDocument, appActions, checkDocument, docId, navigation, updateDocument]);

  useEffect(() => {
    if (appState.forms?.documentParams) {
      return;
    }

    const docObj = docId && (appState.documents?.find((i) => i.id === docId) as IDocument);

    // Инициализируем параметры
    docId
      ? appActions.setForm({
          name: 'documentParams',
          id: docObj.id,
          ...(docObj.head as IDocumentParams),
        })
      : appActions.setForm({
          name: 'documentParams',
          date: new Date().toISOString().slice(0, 10),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActions, docId]);

  /*   useEffect(() => {
    if (!route.params) {
      return;
    }

    console.log('ss');
    appActions.setForm({
      name: 'documentParams',
      ...appState.forms?.documentParams,
      ...(route.params as IDocumentParams),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActions, route.params]); */

  const ReferenceItem = useCallback(
    (props: { value: string; onPress: () => void; color?: string }) => {
      return (
        <TouchableOpacity {...props}>
          <View style={[localeStyles.picker, { borderColor: colors.border }]}>
            <Text style={[localeStyles.pickerText, { color: colors.text }]}>{props.value || 'Выберите из списка'}</Text>
            <MaterialCommunityIcons style={localeStyles.pickerButton} name="menu-right" size={30} color="black" />
          </View>
        </TouchableOpacity>
      );
    },
    [colors.border, colors.text],
  );

  return (
    <View style={[localeStyles.container, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>
        {docId ? 'Редактирование Документа' : 'Создание документа'}
      </SubTitle>
      <ScrollView>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
          <Text style={localeStyles.subdivisionText}>Дата документа: </Text>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={localeStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDate', {
                  parentScreen: 'DocumentEdit',
                  formName: 'documentParams',
                  fieldName: 'date',
                  title: 'Дата документа',
                  value: date,
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString(date || new Date().toISOString())}
              </Text>
              <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
          <Text style={localeStyles.subdivisionText}>Номер документа: </Text>
          <TextInput
            style={[
              styles.input,
              localeStyles.textNumberInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
              },
            ]}
            onChangeText={(text) => appActions.setForm({ ...appState.forms?.documentParams, docnumber: text.trim() })}
            value={docnumber || ' '}
            placeholder="Введите номер"
            placeholderTextColor={colors.border}
            multiline={false}
            autoCapitalize="sentences"
            underlineColorAndroid="transparent"
            selectionColor={'black'}
            returnKeyType="done"
            autoCorrect={false}
          />
        </View>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={2}>
          <Text style={localeStyles.subdivisionText}>Откуда:</Text>
          <ReferenceItem
            value={selectedItem(listDepartments, fromcontactId)?.value}
            onPress={() =>
              navigation.navigate('SelectItem', {
                parentScreen: 'DocumentEdit',
                formName: 'documentParams',
                title: 'Подразделение',
                fieldName: 'fromcontactId',
                list: listDepartments,
                value: fromcontactId,
              })
            }
          />
        </View>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
          <Text style={localeStyles.subdivisionText}>Куда:</Text>
          <ReferenceItem
            value={selectedItem(listDepartments, tocontactId)?.value}
            onPress={() =>
              navigation.navigate('SelectItem', {
                parentScreen: 'DocumentEdit',
                formName: 'documentParams',
                title: 'Подразделение',
                fieldName: 'tocontactId',
                list: listDepartments,
                value: tocontactId,
              })
            }
          />
        </View>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={4}>
          <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {docTypes.length ? (
              appState.references?.documenttypes?.data?.map((item, idx) => (
                <Chip
                  key={idx}
                  mode="outlined"
                  style={[localeStyles.margin, doctype === item.id ? { backgroundColor: colors.primary } : {}]}
                  onPress={() => appActions.setForm({ ...appState.forms?.documentParams, doctype: item.id })}
                  selected={doctype === item.id}
                  selectedColor={doctype === item.id ? colors.card : colors.text}
                >
                  {item.name}
                </Chip>
              ))
            ) : (
              <Text>Не найдено</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export { DocumentEditScreen };

const localeStyles = StyleSheet.create({
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  container: {
    flex: 1,
  },
  containerDate: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
  },
  margin: {
    margin: 2,
  },
  marginRight: {
    marginRight: 10,
  },
  picker: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 5,
  },
  pickerButton: {
    flex: 1,
    marginRight: 10,
    textAlign: 'right',
  },
  pickerText: {
    alignSelf: 'center',
    flex: 10,
    fontSize: 16,
  },
  scroll: {
    maxHeight: 150,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subdivisionText: {
    flex: 1,
    marginBottom: 5,
    textAlign: 'left',
  },
  textDate: {
    flex: 1,
    flexGrow: 4,
    fontSize: 20,
    textAlign: 'center',
  },
  textNumberInput: {
    fontSize: 16,
    height: 40,
  },
  title: {
    padding: 10,
  },
});
