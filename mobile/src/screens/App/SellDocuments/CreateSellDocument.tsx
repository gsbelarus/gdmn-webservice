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
      appState.documentParams?.documentNumber &&
      appState.documentParams?.expiditor &&
      appState.documentParams?.toContact &&
      appState.documentParams?.fromContact &&
      appState.documentParams?.documentType;

    if (!res) {
      Alert.alert('Ошибка!', 'Заполнены не все поля.', [{ text: 'OK' }]);
    }
    return res;
  }, [
    appState.documentParams?.date,
    appState.documentParams?.documentNumber,
    appState.documentParams?.documentType,
    appState.documentParams?.expiditor,
    appState.documentParams?.fromContact,
    appState.documentParams?.toContact,
  ]);

  const addDocument = useCallback(() => {
    if (!checkDocument()) {
      return;
    }

    const id =
      appState.documents
        .map((item) => item.id)
        .reduce((newId, currId) => {
          return newId > currId ? newId : currId;
        }, -1) + 1;

    appActions.newDocument({
      id,
      head: {
        doctype: appState.documentParams?.documentType,
        fromcontactId: appState.documentParams?.fromContact[0],
        tocontactId: appState.documentParams?.toContact[0],
        date: appState.documentParams?.date,
        status: 0,
        docnumber: appState.documentParams?.documentNumber,
        expeditorId: appState.documentParams?.expiditor[0],
      },
      lines: [],
    });
    return id;
  }, [
    appActions,
    appState.documentParams?.date,
    appState.documentParams?.documentNumber,
    appState.documentParams?.documentType,
    appState.documentParams?.expiditor,
    appState.documentParams?.fromContact,
    appState.documentParams?.toContact,
    appState.documents,
    checkDocument,
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            appActions.clearDocumentParams();
            navigation.navigate('SellDocumentsListScreen');
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            const id = addDocument();
            if (!id) {
              return;
            }
            appActions.clearDocumentParams();
            navigation.navigate('ViewSellDocument', { docId: id });
          }}
        />
      ),
    });
  }, [addDocument, appActions, navigation]);

  useEffect(() => {
    if (!appState.documentParams) {
      // Инициализируем параметры
      appActions.setDocumentParams({
        date: today.toISOString().slice(0, 10),
      });
    }
  }, [appActions, appState.documentParams, today]);

  useEffect(() => {
    if (!route.params) {
      return;
    }
    const { docId } = route.params;
    if (docId) {
      // Переход из конкретного документа
      // const document = ;
      // appActions.setDocumentParams(appState.documents.find((i) => i.id === docId).head);
      return;
    }
    // Переход из окна параметра для создания нового документа
    appActions.setDocumentParams(route.params);
  }, [route.params, appActions]);

  /*   useEffect(() => {
    if (route.params?.docId !== undefined) {
      const documentItem = appState.documents.find((item) => item.id === Number(route.params.docId));
      setFormFields({
        expiditor: (documentItem.head as ISellHead).expeditorId,
        toContact: documentItem.head.tocontactId,
        fromContact: documentItem.head.fromcontactId,
        date: documentItem.head.date,
        documentNumber: (documentItem.head as ISellHead).docnumber,
        documentType: documentItem.head?.doctype,
      });
    }
  }, [route.params, appState.documents]); */

  /*   useEffect(() => {
    if (!route.params) {
      // окно открыто без параметров -> считаем что инициизируется
      // setFormFields((prev) => prev);
      return;
    }

    // console.log('route.params', route.params);
    setFormFields((prev) => ({ ...prev, ...route.params }));
  }, [route.params]) */

  /*   useImperativeHandle(ref, () => ({
    done: () => {
      if (
        !appState.documentParams?.expiditor ||
        !appState.documentParams?.toContact ||
        appState.documentParams?.fromContact ||
        appState.documentParams?.documentNumber
      ) {
        Alert.alert('Ошибка!', 'Не все поля заполнены.', [
          {
            text: 'OK',
            onPress: () => ({}),
          },
        ]);
        return;
      }
      if (route.params?.docId) {
        // console.log('route.params', route.params);
        appActions.editDocument({
          id: Number(route.params.docId ?? -1),
          head: {
            doctype: formFields.documentType,
            fromcontactId: formFields.fromContact,
            tocontactId: formFields.toContact,
            date: formFields.date,
            status: 0,
            docnumber: formFields.documentNumber,
            expeditorId: formFields.expiditor,
          },
        });
        navigation.navigate('ViewSellDocument', { docId: route.params.docId });
      } else {
        const id =
          appState.documents
            .map((item) => item.id)
            .reduce((newId, currId) => {
              return newId > currId ? newId : currId;
            }, -1) + 1;
        appActions.newDocument({
          id,
          head: {
            doctype: formFields.documentType,
            fromcontactId: formFields.fromContact,
            tocontactId: formFields.toContact,
            date: formFields.date,
            status: 0,
            docnumber: formFields.documentNumber,
            expeditorId: formFields.expiditor,
          },
          lines: [],
        });
        navigation.navigate('ViewSellDocument', { docId: id });
      }
    },
  })); */

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
              onChangeText={(text) => appActions.setDocumentParams({ documentNumber: text })}
              value={appState.documentParams?.documentNumber || ''}
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
              value={selectedItem(listPeople, appState.documentParams?.expiditor)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  fieldName: 'expiditor',
                  title: 'Экспедитор',
                  list: listPeople,
                  value: appState.documentParams?.expiditor,
                })
              }
            />
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
            <Text style={localeStyles.subdivisionText}>Подразделение:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, appState.documentParams?.fromContact)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  title: 'Подразделение',
                  fieldName: 'fromContact',
                  list: listDepartments,
                  value: appState.documentParams?.fromContact,
                })
              }
            />
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={4}>
            <Text style={localeStyles.subdivisionText}>Организация:</Text>
            <ReferenceItem
              value={selectedItem(listCompanies, appState.documentParams?.toContact)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  title: 'Организация',
                  fieldName: 'toContact',
                  list: listCompanies,
                  value: appState.documentParams?.toContact,
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
                      appState.documentParams?.documentType === item.id ? { backgroundColor: colors.primary } : {},
                    ]}
                    onPress={() => appActions.setDocumentParams({ documentType: item.id })}
                    selected={appState.documentParams?.documentType === item.id}
                    selectedColor={appState.documentParams?.documentType === item.id ? colors.card : colors.text}
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
