import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Alert, Route } from 'react-native';
import { Text, Button, Chip, Modal, Portal } from 'react-native-paper';

import { useAppStore } from '../../../store';

export interface ICreateDocumentRef {
  done(): void;
}

interface MyInputProps {
  route: Route;
  navigation: unknown;
}

const CreateDocumentScreen = forwardRef<ICreateDocumentRef, MyInputProps>(({ route }, ref) => {
  const [date, setDate] = useState(new Date());
  const [oldDate, setOldDate] = useState(new Date());
  const [selectedDocType, setSelectedDocType] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<number>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { state, actions } = useAppStore();

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
      if (selectedDocType === undefined || selectedContact === undefined) {
        Alert.alert('Ошибка!', 'Не все поля заполнены.', [
          {
            text: 'OK',
            onPress: () => ({}),
          },
        ]);
        return;
      }
      if (route.params?.docId !== undefined) {
        actions.editDocument({
          id: route.params.docId,
          head: {
            doctype: selectedDocType,
            fromcontactId: selectedContact,
            tocontactId: selectedContact,
            date: date.toString(),
            status: 0,
          },
        });
        navigation.navigate('ViewDocument', { docId: route.params.docId });
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
            fromcontactId: selectedContact,
            tocontactId: selectedContact,
            date: date.toString(),
            status: 0,
          },
          lines: [],
        });
        navigation.navigate('ViewDocument', { docId: id });
      }
    },
  }));

  useEffect(() => {
    if (route.params?.docId !== undefined) {
      const documet = state.documents.find((item) => item.id === route.params.docId);
      setSelectedDocType(documet.head?.doctype);
      setSelectedContact(documet.head?.fromcontactId);
      setDate(new Date(documet.head?.date));
    }
  }, [route.params, state.documents]);

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
          <Text style={localeStyles.subdivisionText}>Тип документа: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {state.documentTypes && state.documentTypes.length !== 0 ? (
              state.documentTypes.map((item, idx) => (
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
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={2}>
          <Text style={localeStyles.subdivisionText}>Подразделение: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {state.contacts && state.contacts.length !== 0 ? (
              state.contacts.map((item, idx) => (
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
    </>
  );
});

export { CreateDocumentScreen };

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
