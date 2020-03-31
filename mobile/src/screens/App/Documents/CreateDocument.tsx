import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Text, Button, Chip, Modal, Portal } from 'react-native-paper';

import documents from '../../../mockData/Document.json';
import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import styles from '../../../styles/global';

const CreateDocumentScreen = ({ route }) => {
  const [date, setDate] = useState(new Date());
  const [oldDate, setOldDate] = useState(new Date());
  const [selectedDocType, setSelectedDocType] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<number>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const today = new Date();
  const { colors } = useTheme();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setDate(currentDate);
  };

  useEffect(() => {
    if (route.params?.docId) {
      const documet = documents.find((item) => item.id === route.params.docId);
      setSelectedDocType(documet.head.doctype);
      setSelectedContact(documet.head.fromcontactId);
      setDate(new Date(documet.head.date));
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
        <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
        <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
          {documentTypes && documentTypes.length !== 0 ? (
            documentTypes.map((item, idx) => (
              <Chip
                key={idx}
                mode="outlined"
                style={[localeStyles.margin, selectedDocType === item.id ? { backgroundColor: colors.primary } : {}]}
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
      <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
        <Text style={localeStyles.subdivisionText}>Подразделение: </Text>
        <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
          {contacts && contacts.length !== 0 ? (
            contacts.map((item, idx) => (
              <Chip
                key={idx}
                mode="outlined"
                style={[localeStyles.margin, selectedContact === item.id ? { backgroundColor: colors.primary } : {}]}
                onPress={() => setSelectedContact(item.id)}
                selected={selectedContact === item.id}
                selectedColor={selectedContact === item.id ? colors.card : colors.text}
              >
                {item.name}
              </Chip>
            ))
          ) : (
            <Text>Не найдено</Text>
          )}
        </ScrollView>
      </View>
      <View>
        <TouchableOpacity
          style={[styles.input, localeStyles.containerDate]}
          onPress={() => {
            setOldDate(date);
            setDatePickerVisibility(true);
          }}
        >
          <Text
            style={[
              localeStyles.textDate,
              {
                color: colors.text,
              },
            ]}
          >
            {date.toLocaleDateString()}
          </Text>
          <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
        </TouchableOpacity>
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
        <Button mode="contained" style={[styles.rectangularButton, localeStyles.button]}>
          ОК
        </Button>
        <Button mode="contained" style={[styles.rectangularButton, localeStyles.button, localeStyles.marginRight]}>
          Отмена
        </Button>
      </View>
    </View>
  );
};

export { CreateDocumentScreen };

const localeStyles = StyleSheet.create({
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 15,
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
    marginTop: 20,
    alignItems: 'flex-end',
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
    maxHeight: 100,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subdivisionText: {
    textAlign: 'center',
  },
  textDate: {
    flex: 1,
    flexGrow: 4,
    fontSize: 20,
    textAlign: 'center',
  },
});
