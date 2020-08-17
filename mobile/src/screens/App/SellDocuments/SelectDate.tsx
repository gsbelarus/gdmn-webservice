import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { RootStackParamList } from '../../../navigation/AppNavigator';

/* interface ISelectDate {
  name: string;
  value: Date;
} */

type Props = StackScreenProps<RootStackParamList, 'SelectDateScreen'>;

export const SelectDateScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();

  const [date, setDate] = useState<Date>(null);
  const [title, setTitle] = useState('');
  const [fieldName, setFieldName] = useState('');

  useEffect(() => {
    if (!route.params?.value) {
      return;
    }
    const { value, fieldName: newFieldName, title: newTitle } = route.params;
    console.log('value', value);
    setDate(new Date(value));
    setTitle(newTitle);
    setFieldName(newFieldName);
  }, [route.params, route.params?.value]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="check-circle"
          size={30}
          onPress={() => navigation.navigate('SettingsGettingDocument', { [fieldName]: date })}
        />
      ),
    });
  }, [date, fieldName, navigation]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>{title || ''}</SubTitle>
      {date ? (
        <>
          <ItemSeparator />
          <RNDateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={date}
            is24Hour={true}
            display="default"
            onChange={(_, newDate) => setDate(newDate)}
            mode="date"
            locale="ru_RU"
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
