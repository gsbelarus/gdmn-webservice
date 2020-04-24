import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Picker } from 'react-native';
import { Text, Button, Chip, Modal, Portal } from 'react-native-paper';

import documents from '../../../mockData/Otves/Document.json';
import references from '../../../mockData/Otves/References.json';
import styles from '../../../styles/global';
import { IContact, IDocumentType } from '../../../model/sell';
const contacts: IContact[] = references.find((ref) => ref.type === "contacts").data;
const documentTypes: IDocumentType[] = references.find((ref) => ref.type === "documentTypes").data;

const CreateSellDocumentScreen = ({ route }) => {
  const [date, setDate] = useState(new Date());
  const [oldDate, setOldDate] = useState(new Date());
  const [selectedExpeditor, setSelectedExpeditor] = useState<number>();
  const [selectedToContact, setSelectedToContact] = useState<number>();
  const [selectedFromContact, setSelectedFromContact] = useState<number>();
  const [selectedDocType, setSelectedDocType] = useState<number>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const today = new Date();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setDate(currentDate);
  };

  useEffect(() => {
    if (route.params?.docId) {
      const documet = documents.find((item) => item.id === route.params.docId);
      setSelectedExpeditor(documet.head.expeditorId);
      setSelectedToContact(documet.head.tocontactId);
      setSelectedFromContact(documet.head.fromcontactId);
      setDate(new Date(documet.head.date));
    }
  }, [route.params]);

  return (
    <>
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
          <Text style={localeStyles.subdivisionText}>Экспедитор:</Text>
           {contacts && contacts.length !== 0 ? (
              <Picker
                selectedValue={selectedExpeditor}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => setSelectedExpeditor(itemValue)}
              >
              {contacts.map((item) => (
                <Picker.Item label={item.name} value={item.id} />
                ) 
              )}  
              </Picker>
            ) : (
              <Text>Не найдено</Text>
            )}
        </View>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={2}>
          <Text style={localeStyles.subdivisionText}>Подразделение: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {contacts && contacts.length !== 0 ? (
              contacts.map((item, idx) => (
                <Chip
                  key={idx}
                  mode="outlined"
                  style={[localeStyles.margin, selectedFromContact === item.id ? { backgroundColor: colors.primary } : {}]}
                  onPress={() => setSelectedFromContact(item.id)}
                  selected={selectedFromContact === item.id}
                  selectedColor={selectedFromContact === item.id ? colors.card : colors.text}
                >
                  {item.name}
                </Chip>
              ))
            ) : (
              <Text>Не найдено</Text>
            )}
          </ScrollView>
        </View>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={3}>
          <Text style={localeStyles.subdivisionText}>Организация: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {contacts && contacts.length !== 0 ? (
              contacts.map((item, idx) => (
                <Chip
                  key={idx}
                  mode="outlined"
                  style={[localeStyles.margin, selectedToContact === item.id ? { backgroundColor: colors.primary } : {}]}
                  onPress={() => setSelectedToContact(item.id)}
                  selected={selectedToContact === item.id}
                  selectedColor={selectedToContact === item.id ? colors.card : colors.text}
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
      <View style={localeStyles.buttonView}>
        <Button
          mode="contained"
          style={[styles.rectangularButton, localeStyles.button]}
          onPress={() => {
            navigation.navigate('ViewSellDocument', { docId: 1 });
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
  },
  textDate: {
    flex: 1,
    flexGrow: 4,
    fontSize: 20,
    textAlign: 'center',
  },
});
