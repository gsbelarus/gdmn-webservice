import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Picker } from 'react-native';
import { Text, Button, Modal, Portal, TextInput } from 'react-native-paper';
import styles from '../../../styles/global';
import { useAppStore } from '../../../store';
import { IContact } from '../../../../../common';
import { ISellHead } from '../../../model';
/*import { IContact, IDocumentType } from '../../../model/sell';
const contacts: IContact[] = references.find((ref) => ref.type === "contacts").data;
const people: IContact[] = contacts.filter((item) => item.type === 2);
const companies: IContact[] = contacts.filter((item) => item.type === 3);
const departments: IContact[] = contacts.filter((item) => item.type === 4);
const documentTypes: IDocumentType[] = references.find((ref) => ref.type === "documentTypes").data; */

const CreateSellDocumentScreen = ({ route }) => {
  const [date, setDate] = useState(new Date());
  const [oldDate, setOldDate] = useState(new Date());
  const [selectedExpeditor, setSelectedExpeditor] = useState<number>();
  const [selectedToContact, setSelectedToContact] = useState<number>();
  const [selectedFromContact, setSelectedFromContact] = useState<number>();
  const [selectedDocType, setSelectedDocType] = useState<number>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [peopleText, setPeopleText] = useState('');
  const [companyText, setCompanyText] = useState('');
  const [numberText, setNumberText] = useState('');
  const { state, actions } = useAppStore();
  const people: IContact[] = state.contacts.filter((item) => item.type === 2);
  const companies: IContact[] = state.contacts.filter((item) => item.type === 3);
  const departments: IContact[] = state.contacts.filter((item) => item.type === 4);

  const today = new Date();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setDate(currentDate);
  };

  useEffect(() => {
    setSelectedDocType(334644058);
  }, [])

  useEffect(() => {
    if (route.params?.docId !== undefined) {
      const documentItem = state.documents.find((item) => item.id === route.params.docId);
      setSelectedExpeditor((documentItem.head as ISellHead).expeditorId);
      setSelectedToContact(documentItem.head.tocontactId);
      setSelectedFromContact(documentItem.head.fromcontactId);
      setDate(new Date(documentItem.head.date));
      setNumberText((documentItem.head as ISellHead).docnumber);
    }
  }, [route.params]);

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
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={5}>
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
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
            <View style={localeStyles.filter}>
              <Text style={localeStyles.subdivisionText}>Экспедитор:</Text>
              <TextInput
                style={[
                  styles.input,
                  localeStyles.textInput,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                  },
                ]}
                onChangeText={setPeopleText}
                value={peopleText}
                placeholder="Введите строку поиска"
                placeholderTextColor={colors.border}
                multiline={false}
                autoCapitalize="sentences"
                underlineColorAndroid="transparent"
                selectionColor={'black'}
                returnKeyType="done"
                autoCorrect={false}
              />
            </View>
            <View style={[localeStyles.areaPicker, { borderColor: colors.border }]} key={11}>
              {people.find((item) => item.name.toLowerCase().includes(peopleText.toLowerCase())) &&
              people.length !== 0 ? (
                <Picker
                  selectedValue={selectedExpeditor}
                  style={localeStyles.pickerView}
                  itemStyle={localeStyles.pickerView}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) => setSelectedExpeditor(itemValue)}
                >
                  {people
                    .filter((item) => item.name.toLowerCase().includes(peopleText.toLowerCase()))
                    .map((item, idx) => (
                      <Picker.Item label={item.name} value={item.id} key={idx} />
                    ))}
                </Picker>
              ) : (
                <Text>Не найдено</Text>
              )}
            </View>
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={2}>
            <Text style={localeStyles.subdivisionText}>Подразделение: </Text>
            <View style={[localeStyles.areaPicker, { borderColor: colors.border }]} key={12}>
              {departments && departments.length !== 0 ? (
                <Picker
                  selectedValue={selectedFromContact}
                  style={localeStyles.pickerView}
                  itemStyle={localeStyles.pickerView}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) => setSelectedFromContact(itemValue)}
                >
                  {departments.map((item, idx) => (
                    <Picker.Item label={item.name} value={item.id} key={idx} />
                  ))}
                </Picker>
              ) : (
                <Text>Не найдено</Text>
              )}
            </View>
          </View>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
            <View style={localeStyles.filter}>
              <Text style={localeStyles.subdivisionText}>Организация: </Text>
              <TextInput
                style={[
                  styles.input,
                  localeStyles.textInput,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                  },
                ]}
                onChangeText={setCompanyText}
                value={companyText}
                placeholder="Введите строку поиска"
                placeholderTextColor={colors.border}
                multiline={false}
                autoCapitalize="sentences"
                underlineColorAndroid="transparent"
                selectionColor={'black'}
                returnKeyType="done"
                autoCorrect={false}
              />
            </View>
            <View style={[localeStyles.areaPicker, { borderColor: colors.border }]} key={13}>
              {companies && companies.length !== 0 ? (
                <Picker
                  selectedValue={selectedToContact}
                  style={localeStyles.pickerView}
                  itemStyle={localeStyles.pickerView}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) => setSelectedToContact(itemValue)}
                >
                  {companies
                    .filter((item) => item.name.toLowerCase().includes(companyText.toLowerCase()))
                    .map((item, idx) => (
                      <Picker.Item label={item.name} value={item.id} key={idx} />
                    ))}
                </Picker>
              ) : (
                <Text>Не найдено</Text>
              )}
            </View>
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
        <View style={localeStyles.buttonView}>
          <Button
            mode="contained"
            style={[styles.rectangularButton, localeStyles.button]}
            onPress={() => {
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
            }}
          >
            ОК
          </Button>
          <Button
            mode="contained"
            style={[styles.rectangularButton, localeStyles.button, localeStyles.marginRight]}
            onPress={() => {
              navigation.navigate('SellDocumentsListScreen');
            }}
          >
            Отмена
          </Button>
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
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 0,
    padding: 0,
    backgroundColor: 'white',
  },
  pickerView: {
    margin: 1,
    paddingHorizontal: 0,
    color: 'black',
    fontSize: 12,
    height: 35,
    borderWidth: 1,
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
  margin: {
    margin: 2,
  },
  marginRight: {
    marginRight: 10,
  },
  scroll: {
    maxHeight: 150,
  },
  scrollOut: {
    maxHeight: 400,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subdivisionText: {
    marginBottom: 5,
    textAlign: 'left',
    flex: 1,
  },
  textDate: {
    flex: 1,
    flexGrow: 4,
    fontSize: 20,
    textAlign: 'center',
  },
  filter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  textInput: {
    fontSize: 14,
    height: 15,
    marginTop: 5,
  },
  textNumberInput: {
    fontSize: 16,
    height: 17,
    marginTop: 5,
  },
});
