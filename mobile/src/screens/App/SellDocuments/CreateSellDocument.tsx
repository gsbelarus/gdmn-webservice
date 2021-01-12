import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Chip } from 'react-native-paper';

import { IContact } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { getDateString } from '../../../helpers/utils';
import { IListItem } from '../../../model';
import { IDocumentParams } from '../../../model/sell';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type Props = StackScreenProps<RootStackParamList, 'CreateSellDocument'>;

const CreateSellDocumentScreen = ({ route }: Props) => {
  const today = new Date();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state: appState, actions: appActions } = useAppStore();

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
        status: 0,
        docnumber: (appState.formParams as IDocumentParams)?.docnumber,
        expeditorId: (appState.formParams as IDocumentParams)?.expeditorId,
      },
    });
    return route.params?.docId;
  }, [appActions, route.params?.docId, appState.formParams]);

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
        status: 0,
        docnumber: (appState.formParams as IDocumentParams)?.docnumber,
        expeditorId: (appState.formParams as IDocumentParams)?.expeditorId[0],
      },
      lines: [],
    });
    return id;
  }, [appActions, appState.formParams, appState.documents]);

  React.useLayoutEffect(() => {
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
            const { docId } = route.params;
            // При нажатии 'отмена' если редактирование документа
            // то возвращаемся к документу, иначе к списку документов
            docId ? navigation.navigate('ViewSellDocument', { docId }) : navigation.navigate('SellDocumentsListScreen');
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
    if (!appState.formParams && !route.params?.docId) {
      // Инициализируем параметры
      appActions.setFormParams({
        date: today.toISOString().slice(0, 10),
      });
    }
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
                  parentScreen: 'CreateSellDocument',
                  fieldName: 'date',
                  title: 'Дата документа:',
                  value: (appState.formParams as IDocumentParams)?.date,
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString((appState.formParams as IDocumentParams)?.date || today.toISOString())}
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
            onChangeText={(text) => appActions.setFormParams({ docnumber: text.trim() })}
            value={(appState.formParams as IDocumentParams)?.docnumber || ' '}
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
        <View style={[localeStyles.area, { borderColor: colors.border }]} key={2}>
          <Text style={localeStyles.subdivisionText}>Экспедитор:</Text>
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
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
          <Text style={localeStyles.subdivisionText}>Подразделение:</Text>
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
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={4}>
          <Text style={localeStyles.subdivisionText}>Организация:</Text>
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
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={5}>
          <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {appState.documentTypes && appState.documentTypes.length !== 0 ? (
              appState.documentTypes.map((item, idx) => (
                <Chip
                  key={idx}
                  mode="outlined"
                  style={[
                    localeStyles.margin,
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
        </View>
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

export { CreateSellDocumentScreen };

const localeStyles = StyleSheet.create({
  area: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 5,
    minHeight: 80,
    padding: 5,
  },
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  areaPicker: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 0,
    padding: 0,
  },
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonDatePicker: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
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
  filter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
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
  pickerView: {
    borderWidth: 1,
    color: 'black',
    fontSize: 12,
    height: 35,
    margin: 1,
    paddingHorizontal: 0,
  },
  scroll: {
    maxHeight: 150,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollOut: {
    maxHeight: 400,
  },
  subdivisionText: {
    flex: 1,
    marginBottom: 5,
    textAlign: 'left',
  },
  text: {
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
  },
  textDate: {
    flex: 1,
    flexGrow: 4,
    fontSize: 20,
    textAlign: 'center',
  },
  textInput: {
    fontSize: 14,
    height: 15,
    marginTop: 5,
  },
  textNumberInput: {
    fontSize: 16,
    height: 40,
  },
  title: {
    padding: 10,
  },
});
