import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig, DateObject } from 'react-native-calendars';

import { HeaderRight } from '../../../../components/HeaderRight';
import ItemSeparator from '../../../../components/ItemSeparator';
import SubTitle from '../../../../components/SubTitle';
import { DocumentStackParamList } from '../../../../navigation/DocumentsNavigator';

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

type Props = StackScreenProps<DocumentStackParamList, 'SelectDate'>;

type ParentScreen = keyof Pick<DocumentStackParamList, 'DocumentEdit'>;

export const SelectDateScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [parentScreen, setParentScreen] = useState('');

  useEffect(() => {
    if (!route.params?.fieldName) {
      return;
    }
    const { fieldName: newFieldName, title: newTitle, parentScreen: newParentScreen, value: newValue } = route.params;

    setTitle(newTitle);
    setFieldName(newFieldName);
    setParentScreen(newParentScreen);
    setDate(newValue);
  }, [route.params]);

  const dayPressHandle = (day: DateObject) => {
    setDate(day.dateString);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderRight text="Отмена" onPress={navigation.goBack} />,
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            // appActions.setFormParams({ [fieldName]: date });
            parentScreen ? navigation.navigate(parentScreen as ParentScreen, { docId: 0, [fieldName]: date }) : null;
          }}
        />
      ),
    });
  }, [colors.primary, date, fieldName, navigation, parentScreen]);

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