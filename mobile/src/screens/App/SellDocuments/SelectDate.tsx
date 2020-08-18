import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig, DateObject } from 'react-native-calendars';
import { IconButton } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { RootStackParamList } from '../../../navigation/AppNavigator';

LocaleConfig.locales.ru = {
  monthNames: [
    'Январь',
    'Ферваль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
};
LocaleConfig.defaultLocale = 'ru';

type Props = StackScreenProps<RootStackParamList, 'SelectDateScreen'>;

export const SelectDateScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  const [date, setDate] = useState<string>('');
  const [title, setTitle] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [parentScreen, setParentScreen] = useState('');

  useEffect(() => {
    if (!route.params?.value) {
      return;
    }
    const { value, fieldName: newFieldName, title: newTitle, parentScreen: newParentScreen } = route.params;

    setDate(value);
    setTitle(newTitle);
    setFieldName(newFieldName);
    setParentScreen(newParentScreen);
  }, [route.params, route.params?.value]);

  const dayPressHandle = (day: DateObject) => {
    setDate(day.dateString);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="check-circle"
          size={30}
          onPress={() =>
            parentScreen
              ? navigation.navigate(parentScreen as keyof RootStackParamList, {
                  [fieldName]: date,
                })
              : null
          }
        />
      ),
    });
  }, [date, fieldName, navigation, parentScreen]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{title || ''}</SubTitle>
      {date ? (
        <>
          <ItemSeparator />
          <Calendar
            current={date}
            markedDates={{
              [date]: { selected: true, selectedColor: 'orange', disableTouchEvent: true },
            }}
            onDayPress={dayPressHandle}
            firstDay={1}
          />
          {/* <RNDateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={date}
            is24Hour={true}
            display="calendar"
            onChange={(_, newDate) => setDate(newDate)}
            mode="date"
            locale="ru_RU"
          /> */}
        </>
      ) : null}
    </View>
  );
};

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
  title: {
    padding: 10,
  },
});
