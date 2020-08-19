import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useNavigation, RouteProp } from '@react-navigation/native';
import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Text, Button, Modal, Portal, TextInput, Chip } from 'react-native-paper';

import { IContact } from '../../../../../common';
import { ISellHead } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

interface IItem {
  id?: number;
  value?: string;
}

export interface ICreateSellDocumentRef {
  done(): void;
}

type CreateSellDocumentScreenRouteProp = RouteProp<RootStackParamList, 'CreateSellDocument'>;

type Props = {
  route: CreateSellDocumentScreenRouteProp;
};

export interface IFormParams {
  date?: string;
  expiditor?: number;
  toContact?: number;
  fromContact?: number;
  documentType?: number;
  documentNumber?: string;
}

const CreateSellDocumentScreen = forwardRef<ICreateSellDocumentRef, Props>(({ route }, ref) => {
  //const [date, setDate] = useState(new Date());
  //const [selectedExpeditor, setSelectedExpeditor] = useState<number>();
  //const [selectedToContact, setSelectedToContact] = useState<number>();
  //const [selectedFromContact, setSelectedFromContact] = useState<number>();
  //const [selectedDocType, setSelectedDocType] = useState<number>();
  //const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  //const [numberText, setNumberText] = useState('');
  const { state, actions } = useAppStore();

  const [formFields, setFormFields] = useState<IFormParams>({});

  const selectedItem = useCallback((listItems: IItem[], id: number | number[]) => {
    return listItems.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  //const selectedItem = (listItems: IItem[], id: number) => listItems.find((item) => item.id === id);
  const getListItems = (contacts: IContact[]) =>
    contacts.map((item) => {
      return { id: item.id, value: item.name } as IItem;
    });
  const people: IContact[] = useMemo(() => state.contacts.filter((item) => item.type === '2'), [state.contacts]);
  const listPeople = useMemo(() => getListItems(people), [people]);
  const companies: IContact[] = state.contacts.filter((item) => item.type === '3');
  const listCompanies = useMemo(() => getListItems(companies), [companies]);
  const departments: IContact[] = state.contacts.filter((item) => item.type === '4');
  const listDepartments = useMemo(() => getListItems(departments), [departments]);

  const today = new Date();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const getDateString = useCallback((_date: string) => {
    if (!_date) {
      return '-';
    }
    const date = new Date(_date);
    return `${date.getDate()}.${('0' + (date.getMonth() + 1).toString()).slice(-2, 3)}.${date.getFullYear()}`;
  }, []);

  /*const onChange = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || formFields.date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setFormFields({ ...formFields, date: currentDate });
  };*/

  useEffect(() => {
    if (route.params?.docId !== undefined) {
      const documentItem = state.documents.find((item) => item.id === Number(route.params.docId));
      setFormFields({ 
        expiditor: (documentItem.head as ISellHead).expeditorId,
        toContact: documentItem.head.tocontactId,
        fromContact: documentItem.head.fromcontactId,
        date: documentItem.head.date,
        documentNumber: (documentItem.head as ISellHead).docnumber,
        documentType: documentItem.head?.doctype,
      });
    }
  }, [route.params, state.documents]);

  useEffect(() => {
    if (!route.params) {
      // окно открыто без параметров -> считаем что инициизируется
      // setFormFields((prev) => prev);
      return;
    }

    // console.log('route.params', route.params);
    setFormFields((prev) => ({ ...prev, ...route.params }));
  }, [route.params]);

  useImperativeHandle(ref, () => ({
    done: () => {
      if (
        formFields.expiditor === undefined ||
        formFields.toContact === undefined ||
        formFields.fromContact === undefined ||
        formFields.documentNumber === undefined
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
        actions.editDocument({
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
          state.documents
            .map((item) => item.id)
            .reduce((newId, currId) => {
              return newId > currId ? newId : currId;
            }, -1) + 1;
        actions.newDocument({
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
  }));

 

  /*   const onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  }; */

  const ReferenceItem = useCallback(
    (props: { value: string; onPress: () => void; color?: string }) => {
      // const { colors } = useTheme();

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
             /* onPress={() => {
                setDatePickerVisibility(true);
              }}*/
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'CreateSellDocument',
                  fieldName: 'date',
                  title: 'Дата документа:',
                  value: formFields?.date || today.toISOString().slice(0, 10),
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                 {getDateString(formFields?.date || today.toISOString())}
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
              onChangeText={(value) => setFormFields({ ...formFields, documentNumber: value })}
              value={formFields.documentNumber}
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
              value={selectedItem(listPeople, formFields.expiditor)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  selected: formFields.expiditor,
                  list: {
                    name: 'Экспедитор',
                    type: 'expiditor',
                    data: listPeople,
                  },
                })
              }
            />
            {/*
              <DropdownList
                list={listPeople}
                value={selectedItem(listPeople, selectedExpeditor)}
                onValueChange={(item) => {
                  setSelectedExpeditor(item.id);
                }}
              />
              */}
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
            <Text style={localeStyles.subdivisionText}>Подразделение:</Text>
            <ReferenceItem
              value={selectedItem(listDepartments, formFields.fromContact)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  selected: formFields.fromContact,
                  list: {
                    name: 'Подразделение',
                    type: 'fromContact',
                    data: listDepartments,
                  },
                })
              }
            />
            {/*
              <DropdownList
                list={listDepartments}
                value={selectedItem(listDepartments, selectedFromContact)}
                onValueChange={(item) => {
                  setSelectedFromContact(item.id);
                }}
              />
            */}
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={4}>
            <Text style={localeStyles.subdivisionText}>Организация:</Text>
            <ReferenceItem
              value={selectedItem(listCompanies, formFields.toContact)?.value}
              onPress={() =>
                navigation.navigate('SelectItemScreen', {
                  parentScreen: 'CreateSellDocument',
                  selected: formFields.toContact,
                  list: {
                    name: 'Организация',
                    type: 'toContact',
                    data: listCompanies,
                  },
                })
              }
            />
            {/*
              <DropdownList
                list={listCompanies}
                value={selectedItem(listCompanies, selectedToContact)}
                onValueChange={(item) => {
                  setSelectedToContact(item.id);
                }}
              />
              */}
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={5}>
            <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
            <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
              {state.documentTypes && state.documentTypes.length !== 0 ? (
                state.documentTypes.map((item, idx) => (
                  <Chip
                    key={idx}
                    mode="outlined"
                    style={[
                      localeStyles.margin,
                      formFields.documentType === item.id ? { backgroundColor: colors.primary } : {},
                    ]}
                    onPress={() => setFormFields({ ...formFields, documentType: item.id })}
                    selected={formFields.documentType === item.id}
                    selectedColor={formFields.documentType === item.id ? colors.card : colors.text}
                  >
                    {item.name}
                  </Chip>
                ))
              ) : (
                <Text>Не найдено</Text>
              )}
            </ScrollView>
          </View>
          {/*isDatePickerVisible &&
            (Platform.OS !== 'ios' ? (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                //value={formFields.date}
                is24Hour={true}
                display="default"
                onChange={onChange}
                mode="date"
                locale="en_GB"
                maximumDate={new Date(today.getFullYear() + 5, today.getMonth(), today.getDate())}
                minimumDate={new Date(1990, 0, 1)}
              />
            ) : (
              <Portal>
                <Modal visible={isDatePickerVisible} onDismiss={() => setDatePickerVisibility(false)}>
                  <View
                    style={[
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                      localeStyles.containerModalDatePicker,
                    ]}
                  >
                    <View
                      style={[
                        localeStyles.buttonDatePicker,
                        {
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <Button onPress={() => setDatePickerVisibility(false)}>Готово</Button>
                      <Button
                        onPress={() => {
                          setDatePickerVisibility(false);
                        }}
                      >
                        Отмена
                      </Button>
                    </View>
                    <DateTimePicker
                      testID="dateTimePicker"
                      timeZoneOffsetInMinutes={0}
                      value={formFields.date}
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                      mode="date"
                      locale="en_GB"
                    />
                  </View>
                </Modal>
              </Portal>
            ))*/}
        </View>
      </ScrollView>
    </>
  );
});

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
