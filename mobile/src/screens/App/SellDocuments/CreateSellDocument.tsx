import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useNavigation, RouteProp } from '@react-navigation/native';
import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Text, Button, Modal, Portal, TextInput, Chip } from 'react-native-paper';

import { IContact } from '../../../../../common';
import DropdownList from '../../../components/DropdownList/DropdownList';
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

const CreateSellDocumentScreen = forwardRef<ICreateSellDocumentRef, Props>(({ route }, ref) => {
  const [date, setDate] = useState(new Date());
  const [oldDate, setOldDate] = useState(new Date());
  const [selectedExpeditor, setSelectedExpeditor] = useState<number>();
  const [selectedToContact, setSelectedToContact] = useState<number>();
  const [selectedFromContact, setSelectedFromContact] = useState<number>();
  const [selectedDocType, setSelectedDocType] = useState<number>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [numberText, setNumberText] = useState('');
  const { state, actions } = useAppStore();
  const selectedItem = (listItems: IItem[], id: number) => listItems.find((item) => item.id === id);
  const getListItems = (contacts: IContact[]) =>
    contacts.map((item) => {
      return { id: item.id, value: item.name } as IItem;
    });
  const people: IContact[] = useMemo(() => state.contacts.filter((item) => item.type === '2'), [state.contacts]);
  const listPeople = useMemo(() => getListItems(people), [people]);
  const companies: IContact[] = state.contacts.filter((item) => item.type === '3');
  const listCompanies = getListItems(companies);
  const departments: IContact[] = state.contacts.filter((item) => item.type === '4');
  const listDepartments = getListItems(departments);

  const today = new Date();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setDate(currentDate);
  };

  useImperativeHandle(ref, () => ({
    done: () => {
      if (
        selectedExpeditor === undefined ||
        selectedToContact === undefined ||
        selectedFromContact === undefined ||
        numberText === undefined
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
        actions.editDocument({
          id: route.params.docId,
          head: {
            doctype: selectedDocType,
            fromcontactId: selectedFromContact,
            tocontactId: selectedToContact,
            date: date.toString(),
            status: 0,
            docnumber: numberText,
            expeditorId: selectedExpeditor,
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
            doctype: selectedDocType,
            fromcontactId: selectedFromContact,
            tocontactId: selectedToContact,
            date: date.toString(),
            status: 0,
            docnumber: numberText,
            expeditorId: selectedExpeditor,
          },
          lines: [],
        });
        navigation.navigate('ViewSellDocument', { docId: id });
      }
    },
  }));

  useEffect(() => {
    if (route.params?.docId !== undefined) {
      const documentItem = state.documents.find((item) => item.id === route.params.docId);
      setSelectedExpeditor((documentItem.head as ISellHead).expeditorId);
      setSelectedToContact(documentItem.head.tocontactId);
      setSelectedFromContact(documentItem.head.fromcontactId);
      setDate(new Date(documentItem.head.date));
      setNumberText((documentItem.head as ISellHead).docnumber);
      setSelectedDocType(documentItem.head?.doctype);
    }
  }, [route.params, state.documents]);

  /*   const onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  }; */

  return (
    <>
      <ScrollView>
        <View style={localeStyles.container}>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
            <Text style={localeStyles.subdivisionText}>Дата документа: </Text>
            <TouchableOpacity
              style={localeStyles.containerDate}
              onPress={() => {
                setOldDate(date);
                setDatePickerVisibility(true);
              }}
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>{date.toLocaleDateString()}</Text>
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
              onChangeText={setNumberText}
              value={numberText}
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
            <View key={11}>
              <DropdownList
                list={listPeople}
                value={selectedItem(listPeople, selectedExpeditor)}
                onValueChange={(item) => {
                  setSelectedExpeditor(item.id);
                }}
              />
            </View>
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
            <Text style={localeStyles.subdivisionText}>Подразделение:</Text>
            <View key={13}>
              <DropdownList
                list={listDepartments}
                value={selectedItem(listDepartments, selectedFromContact)}
                onValueChange={(item) => {
                  setSelectedFromContact(item.id);
                }}
              />
            </View>
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={4}>
            <Text style={localeStyles.subdivisionText}>Организация:</Text>
            <View key={14}>
              <DropdownList
                list={listCompanies}
                value={selectedItem(listCompanies, selectedToContact)}
                onValueChange={(item) => {
                  setSelectedToContact(item.id);
                }}
              />
            </View>
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
                      selectedDocType === item.id ? { backgroundColor: colors.primary } : {},
                    ]}
                    onPress={() => setSelectedDocType(item.id)}
                    selected={selectedDocType === item.id}
                    selectedColor={selectedDocType === item.id ? colors.card : colors.text}
                  >
                    {item.name}
                  </Chip>
                ))
              ) : (
                <Text>Не найдено</Text>
              )}
            </ScrollView>
          </View>
          {isDatePickerVisible &&
            (Platform.OS !== 'ios' ? (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={date}
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
                          setDate(oldDate);
                        }}
                      >
                        Отмена
                      </Button>
                    </View>
                    <DateTimePicker
                      testID="dateTimePicker"
                      timeZoneOffsetInMinutes={0}
                      value={date}
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                      mode="date"
                      locale="en_GB"
                    />
                  </View>
                </Modal>
              </Portal>
            ))}
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
