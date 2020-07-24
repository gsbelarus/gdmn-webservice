import { useTheme } from '@react-navigation/native';
import React, { useState, forwardRef, useImperativeHandle, useCallback, useMemo } from 'react';
import { View, StyleSheet, Platform, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

import SubTitle from '../../../components/SubTitle';
import { useAppStore, useAuthStore, useServiceStore } from '../../../store';
import { IResponse, IMessageInfo, IContact } from '../../../../../common';
import { timeout } from '../../../helpers/utils';
import { Button, Portal, Modal, Text } from 'react-native-paper';
import DropdownList from '../../../components/DropdownList/DropdownList';

interface IItem {
  id?: number;
  value?: string;
}

export interface ISettingsGettingDocumentRef {
  done(): void;
}

interface MyInputProps {
  route: any;
  navigation: any;
}

const SettingsGettingDocumentScreen = forwardRef<ISettingsGettingDocumentRef, MyInputProps>(({ route, navigation }, ref) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions } = useAppStore();

  const today = new Date();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateEnd, setIsDateEnd] = useState(false);
  const [selectedExpeditor, setSelectedExpeditor] = useState<number>();
  const [selectedToContact, setSelectedToContact] = useState<number>();
  const [dateBegin, setDateBegin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1));
  const [dateEnd, setDateEnd] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1));
  const [oldDateBegin, setOldDateBegin] = useState(today);
  const [oldDateEnd, setOldDateEnd] = useState(today);

  const selectedItem = (listItems: IItem[], id: number) => listItems.find((item) => item.id === id);
  const getListItems = (contacts: IContact[]) =>
    contacts.map((item) => {
      return { id: item.id, value: item.name } as IItem;
    });
  const people: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === '2'), [appState.contacts]);
  const listPeople = useMemo(() => getListItems(people), [people]);
  const companies: IContact[] = appState.contacts.filter((item) => item.type === '3');
  const listCompanies = getListItems(companies);

  const sendDocumentRequest = useCallback(() => {
    timeout(
      5000,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_SellDocuments',
          params: [
            {
              dateBegin: new Date().toLocaleDateString(),
              dateEnd: new Date().toLocaleDateString(),
              expiditor: selectedExpeditor,
              toContact: selectedToContact,
            },
          ],
        },
      }),
    )
      .then((response: IResponse<IMessageInfo>) => {
        if (response.result) {
          Alert.alert('Запрос отправлен!', '', [
            {
              text: 'Закрыть',
              onPress: () => ({}),
            },
          ]);
        } else {
          Alert.alert('Запрос не был отправлен', '', [
            {
              text: 'Закрыть',
              onPress: () => ({}),
            },
          ]);
        }
      })
      .catch((err: Error) =>
        Alert.alert('Ошибка!', err.message, [
          {
            text: 'Закрыть',
            onPress: () => ({}),
          },
        ]),
      );
  }, [apiService.data, state.companyID]);

  useImperativeHandle(ref, () => ({
    done: () => {
      sendDocumentRequest();
    },
  }));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || (isDateEnd ? dateEnd : dateBegin);
    setDatePickerVisibility(Platform.OS === 'ios');
    isDateEnd ? setDateEnd(currentDate) : setDateBegin(currentDate);
  };


  return (
    <View
      style={[
        localeStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Параметры</SubTitle>
      <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
        <Text style={localeStyles.subdivisionText}>Дата документа</Text>
        <Text style={localeStyles.subdivisionText}>с: </Text>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} >
          <TouchableOpacity
            style={localeStyles.containerDate}
            onPress={() => {
              setOldDateBegin(dateBegin);
              setIsDateEnd(false);
              setDatePickerVisibility(true);
            }}
          >
            <Text style={[localeStyles.textDate, { color: colors.text }]}>{dateBegin.toLocaleDateString()}</Text>
            <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
          </TouchableOpacity>
        </View>
        <Text style={localeStyles.subdivisionText}>по: </Text>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]}  key={1}>
          <TouchableOpacity
            style={localeStyles.containerDate}
            onPress={() => {
              setOldDateEnd(dateEnd);
              setIsDateEnd(true);
              setDatePickerVisibility(true);
            }}
          >
            <Text style={[localeStyles.textDate, { color: colors.text }]}>{dateEnd.toLocaleDateString()}</Text>
            <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
          </TouchableOpacity>
        </View>
      </View>
      {isDatePickerVisible &&
        (Platform.OS !== 'ios' ? (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={isDateEnd ? dateEnd : dateBegin}
            is24Hour={true}
            display="default"
            onChange={onChange}
            mode="date"
            locale="en_GB"
            maximumDate={new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())}
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
                      isDateEnd ? setDateEnd(oldDateEnd) : setDateBegin(oldDateBegin);
                    }}
                  >
                    Отмена
                  </Button>
                </View>
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={isDateEnd ? dateEnd : dateBegin}
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
      <View style={[localeStyles.area, { borderColor: colors.border }]} key={2}>
        <Text style={localeStyles.subdivisionText}>Экспедитор:</Text>
        <DropdownList
          list={listPeople}
          value={selectedItem(listPeople, selectedExpeditor)}
          onValueChange={(item) => {
            setSelectedExpeditor(item.id);
          }}
        />
      </View>
      <View style={[localeStyles.area, { borderColor: colors.border }]} key={4}>
        <Text style={localeStyles.subdivisionText}>Организация:</Text>
        <DropdownList
          list={listCompanies}
          value={selectedItem(listCompanies, selectedToContact)}
          onValueChange={(item) => {
            setSelectedToContact(item.id);
          }}
        />
        </View>
    </View>
  );
});

export { SettingsGettingDocumentScreen };

const localeStyles = StyleSheet.create({
  area: {
    margin: 5,
    padding: 5,
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    minHeight: 80,
  },
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
    margin: 5,
  },
  buttonDatePicker: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  container: {
    flex: 1,
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
  marginRight: {
    marginRight: 10,
  },
  subdivisionText: {
    marginBottom: 5,
    textAlign: 'left',
  },
  textDate: {
    flexGrow: 4,
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    padding: 10,
  },
});
