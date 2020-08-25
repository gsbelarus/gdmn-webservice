import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Chip } from 'react-native-paper';

import { IContact } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
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
      appState.documentParams?.date &&
      appState.documentParams?.docnumber &&
      appState.documentParams?.expeditorId &&
      appState.documentParams?.tocontactId &&
      appState.documentParams?.fromcontactId &&
      appState.documentParams?.doctype;

    if (!res) {
      Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
    }
    return res;
  }, [
    appState.documentParams?.date,
    appState.documentParams?.docnumber,
    appState.documentParams?.expeditorId,
    appState.documentParams?.tocontactId,
    appState.documentParams?.fromcontactId,
    appState.documentParams?.doctype,
  ]);

  const updateDocument = useCallback(() => {
    appActions.editDocument({
      id: route.params?.docId,
      head: {
        doctype: appState.documentParams?.doctype,
        fromcontactId: appState.documentParams?.fromcontactId,
        tocontactId: appState.documentParams?.tocontactId,
        date: appState.documentParams?.date,
        status: 0,
        docnumber: appState.documentParams?.docnumber,
        expeditorId: appState.documentParams?.expeditorId,
      },
    });
    return route.params?.docId;
  }, [
    appActions,
    route.params?.docId,
    appState.documentParams?.doctype,
    appState.documentParams?.fromcontactId,
    appState.documentParams?.tocontactId,
    appState.documentParams?.date,
    appState.documentParams?.docnumber,
    appState.documentParams?.expeditorId,
  ]);

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
        doctype: appState.documentParams?.doctype,
        fromcontactId: appState.documentParams?.fromcontactId[0],
        tocontactId: appState.documentParams?.tocontactId[0],
        date: appState.documentParams?.date,
        status: 0,
        docnumber: appState.documentParams?.docnumber,
        expeditorId: appState.documentParams?.expeditorId[0],
      },
      lines: [],
    });
    return id;
  }, [
    appActions,
    appState.documentParams?.date,
    appState.documentParams?.docnumber,
    appState.documentParams?.doctype,
    appState.documentParams?.expeditorId,
    appState.documentParams?.fromcontactId,
    appState.documentParams?.tocontactId,
    appState.documents,
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            appActions.clearDocumentParams();
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

            appActions.clearDocumentParams();
            navigation.navigate('ViewSellDocument', { docId: id });
          }}
        />
      ),
    });
  }, [addDocument, appActions, navigation, route.params, checkDocument, updateDocument]);

  useEffect(() => {
    if (!appState.documentParams && !route.params?.docId) {
      // Инициализируем параметры
      appActions.setDocumentParams({
        date: today.toISOString().slice(0, 10),
      });
    }
  }, [appActions, appState.documentParams, route.params?.docId, today]);

  useEffect(() => {
    if (!route.params) {
      return;
    }
    route.params.docId && !appState.documentParams
      ? appActions.setDocumentParams(appState.documents.find((i) => i.id === route.params.docId).head)
      : appActions.setDocumentParams(route.params as IDocumentParams);
  }, [route.params, appActions, appState.documents]);

  const ReferenceItem = useCallback(
    (props: { value: string; onPress: () => void; color?: string }) => {
      return (
        <View style={[localeStyles.picker, { borderColor: colors.border }]}>
          <TouchableOpacity {...props}>
            <View style={localeStyles.containerMain}>
              <View style={localeStyles.containerLabel}>
                <Text style={localeStyles.text}>{props.value || 'Выберите из списка'}</Text>
              </View>
              <View style={localeStyles.containerDropdownButton}>
                <MaterialCommunityIcons name="menu-right" size={24} color="black" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [colors.border],
  );

  return (
    <>
      <ScrollView>
        <View style={localeStyles.container}>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
            <Text style={localeStyles.subdivisionText}>Дата документа: </Text>
            <TouchableOpacity
              style={localeStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'CreateSellDocument',
                  fieldName: 'date',
                  title: 'Дата документа:',
                  value: appState.documentParams?.date,
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString(appState.documentParams?.date || today.toISOString())}
              </Text>
              <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
            <Text style={localeStyles.subdivisionText}>Номер документа: </Text>
            <TextInput
              style={[
                styles.input,
                localeStyles.textNumberInput,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                },
              ]}
              onChangeText={(text) => appActions.setDocumentParams({ docnumber: text })}
              value={appState.documentParams?.docnumber || ' '}
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
            <Text style={localeStyles.subdivisionText}>Экспедитор:</Text>
            <ReferenceItem
              value={selectedItem(listPeople, appState.documentParams?.expeditorId)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  fieldName: 'expeditorId',
                  title: 'Экспедитор',
                  list: listPeople,
                  value: appState.documentParams?.expeditorId,
                })
              }
            />
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
            <Text style={localeStyles.subdivisionText}>Подразделение:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, appState.documentParams?.fromcontactId)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  title: 'Подразделение',
                  fieldName: 'fromcontactId',
                  list: listDepartments,
                  value: appState.documentParams?.fromcontactId,
                })
              }
            />
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={4}>
            <Text style={localeStyles.subdivisionText}>Организация:</Text>
            <ReferenceItem
              value={selectedItem(listCompanies, appState.documentParams?.tocontactId)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  title: 'Организация',
                  fieldName: 'tocontactId',
                  list: listCompanies,
                  value: appState.documentParams?.tocontactId,
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
                      appState.documentParams?.doctype === item.id ? { backgroundColor: colors.primary } : {},
                    ]}
                    onPress={() => appActions.setDocumentParams({ doctype: item.id })}
                    selected={appState.documentParams?.doctype === item.id}
                    selectedColor={appState.documentParams?.doctype === item.id ? colors.card : colors.text}
                  >
                    {item.name}
                  </Chip>
                ))
              ) : (
                <Text>Не найдено</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export { CreateSellDocumentScreen };

const localeStyles = StyleSheet.create({
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
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
    margin: 10,
    // padding: 0,
  },
  containerDate: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
  },
  containerDropdownButton: {
    flex: 0.07,
  },
  containerLabel: {
    flex: 0.93,
  },
  containerMain: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
  },
  containerModalDatePicker: {
    borderRadius: 8,
    borderWidth: 1,
    margin: 10,
    paddingVertical: 10,
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
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    marginTop: 5,
    padding: 10,
    width: '100%',
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
});
