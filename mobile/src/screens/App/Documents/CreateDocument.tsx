import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "react-navigation-hooks";
import DatePicker from "react-native-modal-datetime-picker";
import styles from "../../../styles/global";
import { Text, Button, Chip } from "react-native-paper";
import { useTheme } from '@react-navigation/native';

import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';

const CreateDocumentScreen = ({ route }) => {
  const [date, setDate] = useState(new Date());
  const [selectedDocType, setSelectedDocType] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<number>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { colors } = useTheme();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          borderColor: colors.border,
          borderRadius: 4,
          borderWidth: 1,
          borderStyle: "solid",
          marginBottom: 15
        }}
        key={1}
      >
        <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {documentTypes && documentTypes.length !== 0 ? (
            documentTypes.map(item => (
              <Chip
                mode='outlined'
                style={[{margin: 2}, selectedDocType === item.id ? {backgroundColor: colors.primary} : {}]}
                onPress={() => setSelectedDocType(item.id)}
                selected={selectedDocType === item.id}
                selectedColor={selectedDocType === item.id ? colors.card : colors.text}
              >{item.name}</Chip>
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
          borderStyle: "solid",
          marginBottom: 15
        }}
        key={1}
      >
        <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {contacts && contacts.length !== 0 ? (
            contacts.map(item => (
              <Chip
                mode='outlined'
                style={[{margin: 2}, selectedContact === item.id ? {backgroundColor: colors.primary} : {}]}
                onPress={() => setSelectedContact(item.id)}
                selected={selectedContact === item.id}
                selectedColor={selectedContact === item.id ? colors.card : colors.text}
              >{item.name}</Chip>
            ))
          ) : (
            <Text>Не найдено</Text>
          )}
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={showDatePicker}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: "#5C5D5F" }}>
              {date.toLocaleDateString()}
            </Text>
          </View>
          <MaterialIcons
            style={{ flex: 1 }}
            size={30}
            color={colors.text}
            name="date-range"
          />
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
        <Button mode="contained" style={[styles.rectangularButton, localeStyles.button, {marginLeft: 0}]}>ОК</Button>
        <Button mode="contained" style={[styles.rectangularButton, localeStyles.button]}>Отмена</Button>
      </View>
    </View>
  );
};

export { CreateDocumentScreen };

const localeStyles = StyleSheet.create({
  subdivisionText: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10
  },
  slide: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  slideTextView: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    marginHorizontal: 5,
    marginRight: 5,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#FFF"
  },
  buttonView: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20
  },
  button: {
    flex: 1,
    marginLeft: 7,
  },
});
