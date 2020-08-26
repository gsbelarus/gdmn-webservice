import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

import { IResponse, IMessageInfo, IContact } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { timeout, getDateString } from '../../../helpers/utils';
import { IListItem } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore, useAuthStore, useServiceStore } from '../../../store';

type Props = StackScreenProps<RootStackParamList, 'SettingsGettingDocument'>;

const SettingsGettingDocumentScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { state } = useAuthStore();
  const { state: appState, actions: appActions } = useAppStore();
  const navigation = useNavigation();

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  useEffect(() => {
    if (!appState.formParams) {
      // Инициализируем параметры
      appActions.setFormParams({
        dateBegin: yesterday.toISOString().slice(0, 10),
        dateEnd: today.toISOString().slice(0, 10),
      });
    }
  }, [appActions, appState.formParams, today, yesterday]);

  useEffect(() => {
    if (!route?.params) {
      return;
    }
    appActions.setFormParams(route.params);
  }, [appActions, route]);

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const getListItems = useCallback(
    (contacts: IContact[]) => contacts.map((item) => ({ id: item.id, value: item.name } as IListItem)),
    [],
  );
  const people: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === '2'), [appState.contacts]);
  const listPeople = useMemo(() => getListItems(people), [getListItems, people]);
  const companies: IContact[] = useMemo(() => appState.contacts.filter((item) => item.type === '3'), [
    appState.contacts,
  ]);

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
              dateBegin: appState.formParams?.dateBegin
                ? new Date(appState.formParams?.dateBegin).toISOString()
                : yesterday.toISOString(),
              dateEnd: appState.formParams?.dateBegin
                ? new Date(appState.formParams?.dateEnd).toISOString()
                : today.toISOString(),
              expiditor: Array.isArray(appState.formParams?.expiditor)
                ? appState.formParams?.expiditor[0]
                : appState.formParams?.expiditor,
              toContact: Array.isArray(appState.formParams?.toContact)
                ? appState.formParams?.toContact[0]
                : appState.formParams?.toContact,
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
              onPress: () => {
                appActions.clearFormParams();
              },
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
    appState.formParams?.dateBegin,
    appState.formParams?.dateEnd,
    appState.formParams?.expiditor,
    appState.formParams?.toContact,
    yesterday,
    today,
    appActions,
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            appActions.clearFormParams();
            navigation.navigate('SellDocuments');
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            sendDocumentRequest();
            navigation.navigate('SellDocuments');
          }}
        />
      ),
    });
  }, [appActions, navigation, sendDocumentRequest]);

  const ReferenceItem = useCallback(
    (props: { value: string; onPress: () => void; color?: string }) => {
      return (
        <TouchableOpacity {...props}>
          <View style={[localeStyles.picker, { borderColor: colors.border }]}>
            <Text style={[localeStyles.pickerText, { color: colors.text }]}>{props.value || 'Выберите из списка'}</Text>
            <MaterialCommunityIcons style={localeStyles.pickerButton} name="menu-right" size={30} color="black" />
          </View>
        </TouchableOpacity>
      );
    },
    [colors.border, colors.text],
  );

  return (
    <View style={[localeStyles.container, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Загрузка заявок</SubTitle>
      <ScrollView>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={0}>
          <Text style={localeStyles.subdivisionText}>Дата документа</Text>
          <Text style={localeStyles.subdivisionText}>с: </Text>
          <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
            <TouchableOpacity
              style={localeStyles.containerDate}
              onPress={() =>
                navigation.navigate('SelectDateScreen', {
                  parentScreen: 'SettingsGettingDocument',
                  fieldName: 'dateBegin',
                  title: 'Дата начала',
                  value: appState.formParams?.dateBegin,
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString(appState?.formParams?.dateBegin || yesterday.toISOString())}
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
                  value: appState.formParams?.dateEnd,
                })
              }
            >
              <Text style={[localeStyles.textDate, { color: colors.text }]}>
                {getDateString(appState?.formParams?.dateEnd || today.toUTCString())}
              </Text>
              <MaterialIcons style={localeStyles.marginRight} size={30} color={colors.text} name="date-range" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[localeStyles.area, { borderColor: colors.border }]} key={2}>
          <Text style={localeStyles.subdivisionText}>Экспедитор:</Text>
          <ReferenceItem
            value={selectedItem(listPeople, appState.formParams?.expiditor)?.value}
            onPress={() =>
              navigation.navigate('SelectItemScreen', {
                parentScreen: 'SettingsGettingDocument',
                fieldName: 'expiditor',
                title: 'Экспедитор',
                list: listPeople,
                value: appState.formParams?.expiditor,
              })
            }
          />
        </View>
        <View style={[localeStyles.area, { borderColor: colors.border }]} key={4}>
          <Text style={localeStyles.subdivisionText}>Организация:</Text>
          <ReferenceItem
            value={selectedItem(listCompanies, appState.formParams?.toContact)?.value}
            onPress={() =>
              navigation.navigate('SelectItemScreen', {
                parentScreen: 'SettingsGettingDocument',
                fieldName: 'toContact',
                title: 'Организация',
                list: listCompanies,
                value: appState.formParams?.toContact,
              })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

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
  container: {
    flex: 1,
  },
  containerDate: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
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
  pickerButton: {
    flex: 1,
    marginRight: 10,
    textAlign: 'right',
  },
  pickerText: {
    alignSelf: 'center',
    flex: 10,
    fontSize: 16,
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
    flex: 0.95,
    flexGrow: 4,
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    padding: 10,
  },
});
