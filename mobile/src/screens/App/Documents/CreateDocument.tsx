import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import DatePicker from 'react-native-modal-datetime-picker';
import { Text, Button, Chip } from 'react-native-paper';

import documents from '../../../mockData/Document.json';
import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import styles from '../../../styles/global';

const CreateDocumentScreen = ({ route }) => {
  const [date, setDate] = useState(new Date());
  const [selectedDocType, setSelectedDocType] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<number>();
  const { colors } = useTheme();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = () => {
    // console.warn('A date has been picked: ', newDate);
    hideDatePicker();
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
      <View
        style={{
          borderColor: colors.border,
          borderRadius: 4,
          borderWidth: 1,
          borderStyle: 'solid',
          marginBottom: 15,
        }}
        key={0}
      >
        <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {documentTypes && documentTypes.length !== 0 ? (
            documentTypes.map((item, idx) => (
              <Chip
                key={idx}
                mode="outlined"
                style={[{ margin: 2 }, selectedDocType === item.id ? { backgroundColor: colors.primary } : {}]}
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
        </View>
      </View>
      <View
        style={{
          borderColor: colors.border,
          borderRadius: 4,
          borderWidth: 1,
          borderStyle: 'solid',
          marginBottom: 15,
        }}
        key={1}
      >
        <Text style={localeStyles.subdivisionText}>Подразделение: </Text>
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }} style={{ maxHeight: 80 }}>
          {contacts && contacts.length !== 0 ? (
            contacts.map((item, idx) => (
              <Chip
                key={idx}
                mode="outlined"
                style={[{ margin: 2 }, selectedContact === item.id ? { backgroundColor: colors.primary } : {}]}
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
          style={[
            styles.input,
            {
              flexDirection: 'row',
              backgroundColor: colors.card,
              alignItems: 'center',
              margin: 0,
              padding: 0,
            },
          ]}
          onPress={showDatePicker}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 20,
              textAlign: 'center',
              color: colors.text,
              flexGrow: 4,
            }}
          >
            {date.toLocaleDateString()}
          </Text>
          <MaterialIcons style={{ marginRight: 10 }} size={30} color={colors.text} name="date-range" />
        </TouchableOpacity>
        <DatePicker
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          locale="en_GB"
          date={date}
        />
      </View>
      <View style={localeStyles.buttonView}>
        <Button mode="contained" style={[styles.rectangularButton, localeStyles.button, { marginLeft: 0 }]}>
          ОК
        </Button>
        <Button mode="contained" style={[styles.rectangularButton, localeStyles.button]}>
          Отмена
        </Button>
      </View>
    </View>
  );
};

export { CreateDocumentScreen };

const localeStyles = StyleSheet.create({
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  slide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  slideTextView: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    marginRight: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#FFF',
  },
  subdivisionText: {
    textAlign: 'center',
  },
});
