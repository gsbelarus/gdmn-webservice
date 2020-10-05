/* eslint-disable react-hooks/exhaustive-deps */
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Chip } from 'react-native-paper';

import { IContact } from '../../../../../common';
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

  const contacts = useMemo(() => appState.references?.contacts, [appState.references?.contacts]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const getListItems = (con: IContact[]): IListItem[] => con?.map((item) => ({ id: item.id, value: item.name }));

  const departments: IContact[] = useMemo(() => {
    return ((contacts as unknown) as IContact[])?.filter((item) => item.contactType === 4);
  }, [contacts]);

  const listDepartments = useMemo(() => getListItems(departments), [departments]);

  const { date, docnumber, tocontactId, fromcontactId, doctype } = useMemo(() => {
    return ((appState.forms?.documentParams as unknown) as IDocumentParams) || {};
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
      id: Number(route.params?.docId),
      head: {
        doctype,
        fromcontactId,
        tocontactId,
        date,
        status: 0,
        docnumber,
      },
    });
    return route.params?.docId;
  }, [appActions, date, docnumber, doctype, fromcontactId, route.params?.docId, tocontactId]);

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            appActions.setForm({ DocumentEdit: undefined });
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

            const id = route.params?.docId ? updateDocument() : addDocument();

            if (!id) {
              return;
            }

            appActions.setForm({ DocumentEdit: undefined });
            navigation.navigate('DocumentView', { docId: id });
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    // if (!appState.forms?.DocumentEdit && !route.params?.docId) {
    // Инициализируем параметры
    appActions.setForm({
      DocumentEdit: {
        name: 'DocumentEdit',
        date: new Date().toISOString().slice(0, 10),
      },
    });
    // }
  }, [appActions]);

  /*   useEffect(() => {
    if (!route.params) {
      return;
    }

    route.params.docId && !appState.forms?.documentParams
      ? appActions.setDocumentParams(appState.documents?.find((i) => i.id === route.params.docId).head)
      : appActions.setDocumentParams(route.params as IDocumentParams);
  }, [route.params, appActions, appState.documents]);
*/
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
        {route.params?.docId ? 'Редактирование Документа' : 'Создание документа'}
      </SubTitle>
      <ScrollView>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
          <Text style={localeStyles.subdivisionText}>Дата документа: </Text>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={localeStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'DocumentEdit',
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
            onChangeText={(text) =>
              appActions.setForm({ DocumentEdit: { ...appState.forms?.DocumentEdit, docnumber: text.trim() } })
            }
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
        {/*
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={2}>
          <Text style={localeStyles.subdivisionText}>Подразделение:</Text>
          <ReferenceItem
            value={selectedItem(listDepartments, fromcontactId)?.value}
            onPress={() =>
              navigation.navigate('SelectItemScreen', {
                parentScreen: 'DocumentEdit',
                title: 'Подразделение',
                fieldName: 'fromcontactId',
                list: listDepartments,
                value: fromcontactId,
              })
            }
          />
        </View>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
          <Text style={localeStyles.subdivisionText}>Подразделение:</Text>
          <ReferenceItem
            value={selectedItem(listDepartments, fromcontactId)?.value}
            onPress={() =>
              navigation.navigate('SelectItemScreen', {
                parentScreen: 'DocumentEdit',
                title: 'Подразделение',
                fieldName: 'fromcontactId',
                list: listDepartments,
                value: fromcontactId,
              })
            }
          />
        </View>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={4}>
          <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {appState.forms?.documentTypes && appState.forms?.documentTypes.length !== 0 ? (
              appState.references?.documentTypes?.map((item, idx) => (
                <Chip
                  key={idx}
                  mode="outlined"
                  style={[localeStyles.margin, doctype === item.id ? { backgroundColor: colors.primary } : {}]}
                  onPress={() => appActions.setDocumentParams({ doctype: item.id })}
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
        </View> */}
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
