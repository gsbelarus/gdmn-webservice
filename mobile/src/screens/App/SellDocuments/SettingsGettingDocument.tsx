import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, forwardRef, useImperativeHandle, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Platform, Alert, TouchableOpacity } from 'react-native';
import { Button, Portal, Modal, Text } from 'react-native-paper';

import { IResponse, IMessageInfo, IContact } from '../../../../../common';
import DropdownList from '../../../components/DropdownList/DropdownList';
import SubTitle from '../../../components/SubTitle';
import { timeout } from '../../../helpers/utils';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore, useAuthStore, useServiceStore } from '../../../store';

interface IItem {
  id?: number;
  value?: string;
}

export interface ISettingsGettingDocumentRef {
  done(): void;
}

export type Props = StackScreenProps<RootStackParamList, 'SettingsGettingDocument'>;

const SettingsGettingDocumentScreen = forwardRef<ISettingsGettingDocumentRef, Props>(({ route }, ref) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState } = useAppStore();

  const today = new Date();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateEnd, setIsDateEnd] = useState(false);
  const [selectedExpeditor, setSelectedExpeditor] = useState<number>();
  const [selectedToContact, setSelectedToContact] = useState<number>();
  const [dateBegin, setDateBegin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1));
  const [dateEnd, setDateEnd] = useState(today);
  const [oldDateBegin, setOldDateBegin] = useState(today);
  const [oldDateEnd, setOldDateEnd] = useState(today);

  const selectedItem = useCallback((listItems: IItem[], id: number) => listItems.find((item) => item.id === id), []);
  const getListItems = useCallback(
    (contacts: IContact[]) => contacts.map((item) => ({ id: item.id, value: item.name } as IItem)),
    [],
  );
  const people: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === 2), [appState.contacts]);
  const listPeople = useMemo(() => getListItems(people), [getListItems, people]);
  const companies: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === 3), [appState.contacts]);
  const listCompanies = useMemo(() => getListItems(companies), [companies, getListItems]);

  const sendDocumentRequest = useCallback(() => {
    timeout(
      5000,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_SellDocuments',
          params: [
            {
              dateBegin: dateBegin.toLocaleDateString(),
              dateEnd: dateEnd.toLocaleDateString(),
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
            },
          ]);
        } else {
          Alert.alert('Запрос не был отправлен', '', [
            {
              text: 'Закрыть',
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
  }, [apiService.data, state.companyID, selectedExpeditor, selectedToContact, dateEnd, dateBegin]);

  useImperativeHandle(ref, () => ({
    done: async () => {
      await sendDocumentRequest();
    },
  }));

  useEffect(() => {
    if (!route.params?.item) {
      return;
    }

    const { item } = route.params;

    console.log('item', item);

    switch (item.fieldName) {
      case 'contacts':
        setSelectedToContact(item.id);
        break;
      case 'expiditor':
        setSelectedExpeditor(item.id);
        break;
      default:
        break;
    }
  }, [route.params, route.params?.item]);

  useEffect(() => {
    console.log('selectedToContact', selectedToContact);
  }, [selectedToContact]);

  useEffect(() => {
    console.log('selectedExpeditor', selectedExpeditor);
  }, [selectedExpeditor]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || (isDateEnd ? dateEnd : dateBegin);
    setDatePickerVisibility(Platform.OS === 'ios');
    isDateEnd ? setDateEnd(currentDate) : setDateBegin(currentDate);
  };

  const navigation = useNavigation();
  // const { state: AppState } = useAppStore();

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
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
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
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
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
        <ReferenceItem
          value={selectedItem(listPeople, selectedExpeditor)?.value}
          onPress={() =>
            navigation.navigate('SelectItemScreen', {
              selected: selectedExpeditor,
              list: {
                name: 'Экспедитор',
                type: 'expiditor',
                data: listPeople,
              },
            })
          }
        />
        {/* <DropdownList
          list={listPeople}
          value={selectedItem(listPeople, selectedExpeditor)}
          onValueChange={(item) => {
            setSelectedExpeditor(item.id);
          }}
        /> */}
      </View>
      <View style={[localeStyles.area, { borderColor: colors.border }]} key={4}>
        <Text style={localeStyles.subdivisionText}>Организация:</Text>
        <ReferenceItem
          value={selectedItem(listCompanies, selectedToContact)?.value}
          onPress={() =>
            navigation.navigate('SelectItemScreen', {
              selected: selectedToContact,
              list: {
                name: 'Контакты',
                type: 'contacts',
                data: listCompanies,
              },
            })
          }
        />
      </View>
    </View>
  );
});

export { SettingsGettingDocumentScreen };

const localeStyles = StyleSheet.create({
  area: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 5,
    minHeight: 80,
    padding: 5,
  },
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    margin: 5,
    padding: 5,
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
  subdivisionText: {
    marginBottom: 5,
    textAlign: 'left',
  },
  text: {
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
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
