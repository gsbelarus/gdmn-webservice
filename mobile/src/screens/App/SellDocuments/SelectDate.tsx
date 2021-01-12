import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig, DateObject } from 'react-native-calendars';

import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';

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
  monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
};
LocaleConfig.defaultLocale = 'ru';

type Props = StackScreenProps<RootStackParamList, 'SelectDateScreen'>;

export const SelectDateScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [fieldName, setFieldName] = useState('');
  const { state, actions: appActions } = useAppStore();

  useEffect(() => {
    if (!route.params?.fieldName) {
      return;
    }
    const { fieldName: newFieldName, title: newTitle, parentScreen: newParentScreen, value: newValue } = route.params;

    setTitle(newTitle);
    setFieldName(newFieldName);
    setDate(newValue);
  }, [route.params]);

  const dayPressHandle = (day: DateObject) => {
    setDate(day.dateString);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderRight text="Отмена" onPress={() => navigation.goBack()} />,
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            appActions.setFormParams({ [fieldName]: date });
            navigation.goBack();
          }}
        />
      ),
    });
  }, [appActions, colors.primary, date, fieldName, navigation]);

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
