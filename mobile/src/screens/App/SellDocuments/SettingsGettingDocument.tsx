import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, forwardRef, useImperativeHandle, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

import { IResponse, IMessageInfo, IContact } from '../../../../../common';
import SubTitle from '../../../components/SubTitle';
import { timeout } from '../../../helpers/utils';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore, useAuthStore, useServiceStore } from '../../../store';

interface IItem {
  id?: number;
  value?: string;
  [key: string]: unknown;
}

export interface ISettingsGettingDocumentRef {
  done(): void;
}

export type Props = StackScreenProps<RootStackParamList, 'SettingsGettingDocument'>;

export interface IFormParams {
  toContact?: number;
  expiditor?: number;
  dateBegin?: string;
  dateEnd?: string;
}

const SettingsGettingDocumentScreen = forwardRef<ISettingsGettingDocumentRef, Props>(({ route }, ref) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState } = useAppStore();

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const selectedItem = useCallback((listItems: IItem[], id: number | number[]) => {
    return listItems.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const getListItems = useCallback(
    (contacts: IContact[]) => contacts.map((item) => ({ id: item.id, value: item.name } as IItem)),
    [],
  );
  const people: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === '2'), [appState.contacts]);
  const listPeople = useMemo(() => getListItems(people), [getListItems, people]);
  const companies: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === '3'), [
    appState.contacts,
  ]);
  const listCompanies = useMemo(() => getListItems(companies), [companies, getListItems]);

  const [formFields, setFormFields] = useState<IFormParams>({});

  const sendDocumentRequest = useCallback(() => {
    timeout(
      5000,
      apiService.data.sendMessages(state.companyID, 'gdmn', {
        type: 'cmd',
        payload: {
          name: 'get_SellDocuments',
          params: [
            {
              dateBegin: formFields.dateBegin ? new Date(formFields.dateBegin).toISOString() : yesterday.toISOString(),
              dateEnd: formFields.dateBegin ? new Date(formFields.dateEnd).toISOString() : today.toISOString(),
              expiditor: Array.isArray(formFields.expiditor) ? formFields.expiditor[0] : formFields.expiditor,
              toContact: Array.isArray(formFields.toContact) ? formFields.toContact[0] : formFields.toContact,
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
  }, [
    apiService.data,
    state.companyID,
    formFields.dateBegin,
    formFields.dateEnd,
    formFields.expiditor,
    formFields.toContact,
    yesterday,
    today,
  ]);

  useImperativeHandle(ref, () => ({
    done: async () => {
      await sendDocumentRequest();
    },
  }));

  useEffect(() => {
    if (!route.params) {
      return;
    }

    console.log('route.params', route.params);

    setFormFields((prev) => {
      return route.params;
    });
  }, [route.params]);

  const navigation = useNavigation();
  const getDateString = useCallback((_date: string) => {
    if (!_date) {
      return '-';
    }
    const date = new Date(_date);
    return `${date.getDate()}.${('0' + (date.getMonth() + 1).toString()).slice(-2, 3)}.${date.getFullYear()}`;
  }, []);

  const ReferenceItem = useCallback(
    (props: { value: string; onPress: () => void; color?: string }) => {
      return (
        <TouchableOpacity {...props}>
          <View style={[localeStyles.picker, { borderColor: colors.border }]}>
            <Text style={[localeStyles.textDate, { color: colors.text }]}>{props.value || 'Выберите из списка'}</Text>
            <MaterialCommunityIcons style={localeStyles.marginRight} name="menu-right" size={30} color="black" />
          </View>
        </TouchableOpacity>
      );
    },
    [colors.border, colors.text],
  );

  return (
    <View style={[localeStyles.container, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Параметры</SubTitle>
      <ScrollView>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
          <Text style={localeStyles.subdivisionText}>Дата документа</Text>
          <Text style={localeStyles.subdivisionText}>с: </Text>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={localeStyles.containerDate}
              /*onPress={() => {
              setIsDateEnd(false);
              setDatePickerVisibility(true);
            }} */
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'SettingsGettingDocument',
                  fieldName: 'dateBegin',
                  title: 'Дата начала',
                  value: formFields?.dateBegin || yesterday.toISOString().slice(0, 10),
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString(formFields?.dateBegin || yesterday.toISOString())}
              </Text>
              <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
          <Text style={localeStyles.subdivisionText}>по: </Text>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
            <TouchableOpacity
              style={localeStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'SettingsGettingDocument',
                  fieldName: 'dateEnd',
                  title: 'Дата окончания',
                  value: formFields?.dateEnd || today.toISOString().slice(0, 10),
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString(formFields?.dateEnd || today.toUTCString())}
              </Text>
              <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
        </View>
        {/*      {isDatePickerVisible &&
        (Platform.OS !== 'ios' ? (
          <RNDateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={isDateEnd ? formFields?.dateEnd || today : formFields?.dateBegin || yesterday}
            is24Hour={true}
            // display="default"
            onChange={onChange}
            mode="date"
            locale="ru_RU"
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
                      // const newDate = isDateEnd ? { dateEnd: selectedDate } : { dateBegin: selectedDate };
                      // setFormFields({ ...formFields, ...newDate });
                      // isDateEnd ? setDateEnd(oldDateEnd) : setDateBegin(oldDateBegin);
                    }}
                  >
                    Отмена
                  </Button>
                </View>
                <RNDateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={isDateEnd ? formFields?.dateEnd || today : formFields?.dateBegin || yesterday}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  mode="date"
                  locale="ru_RU"
                />
              </View>
            </Modal>
          </Portal>
        ))} */}
        <View style={[localeStyles.area, { borderColor: colors.border }]} key={2}>
          <Text style={localeStyles.subdivisionText}>Экспедитор:</Text>
          <ReferenceItem
            value={selectedItem(listPeople, formFields?.expiditor)?.value}
            onPress={() =>
              navigation.navigate('SelectItemScreen', {
                parentScreen: 'SettingsGettingDocument',
                selected: formFields?.expiditor,
                list: {
                  name: 'Экспедитор',
                  type: 'expiditor',
                  data: listPeople,
                },
              })
            }
          />
        </View>
        <View style={[localeStyles.area, { borderColor: colors.border }]} key={4}>
          <Text style={localeStyles.subdivisionText}>Организация:</Text>
          <ReferenceItem
            value={selectedItem(listCompanies, formFields?.toContact)?.value}
            onPress={() =>
              navigation.navigate('SelectItemScreen', {
                parentScreen: 'SettingsGettingDocument',
                selected: formFields?.toContact,
                list: {
                  name: 'Контакты',
                  type: 'toContact',
                  data: listCompanies,
                },
              })
            }
          />
        </View>
      </ScrollView>
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
    alignItems: 'center',
    borderWidth: 1,
    flex: 0.1,
    justifyContent: 'flex-start',
  },
  containerLabel: {
    flex: 0.9,
  },
  /*   containerMain: {
    borderWidth: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    // height: '100%',
  }, */
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
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 5,
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
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    padding: 10,
  },
});
