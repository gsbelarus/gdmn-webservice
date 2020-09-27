import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { TabsStackParams } from '../../../navigation/TabsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type SettingsSearchScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'BoxingDetail'>,
  StackNavigationProp<TabsStackParams>
>;
type SettingsSearchScreenRouteProp = RouteProp<RootStackParamList, 'BoxingDetail'>;

interface Props {
  route: SettingsSearchScreenRouteProp;
  navigation: SettingsSearchScreenNavigationProp;
}

const Line = React.memo(
  ({ name, title, selected, onPress }: { name: string; title: string; selected: boolean; onPress: () => void }) => {
    const { colors } = useTheme();
    return (
      <>
        <TouchableOpacity onPress={onPress}>
          <View key={name} style={localeStyles.line}>
            <Text style={localeStyles.fontSize18}>{title}</Text>
            {selected && <MaterialIcons name="check" size={30} color={colors.primary} />}
          </View>
        </TouchableOpacity>
        <ItemSeparator />
      </>
    );
  },
);

const SettingsSearchScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const [fieldSearch, setFieldSearch] = useState<string[]>(state.settingsSearch ?? []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            navigation.navigate('SellDocuments');
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            actions.setSettingsSearch(fieldSearch);
            navigation.navigate('SellDocuments');
          }}
        />
      ),
    });
  }, [actions, fieldSearch, navigation]);

  return (
    <View
      style={[
        styles.container,
        localeStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Настройки фильтра</SubTitle>
      <Line
        name="number"
        title={'Номер документа'}
        selected={fieldSearch.some((item) => item === 'number')}
        onPress={() =>
          !fieldSearch.some((item) => item === 'number')
            ? setFieldSearch([...fieldSearch, 'number'])
            : setFieldSearch(fieldSearch.filter((item) => item !== 'number'))
        }
      />
      <Line
        name="state"
        title={'Статус'}
        selected={fieldSearch.some((item) => item === 'state')}
        onPress={() =>
          !fieldSearch.some((item) => item === 'state')
            ? setFieldSearch([...fieldSearch, 'state'])
            : setFieldSearch(fieldSearch.filter((item) => item !== 'state'))
        }
      />
      <Line
        name="toContact"
        title={'Организация'}
        selected={fieldSearch.some((item) => item === 'toContact')}
        onPress={() =>
          !fieldSearch.some((item) => item === 'toContact')
            ? setFieldSearch([...fieldSearch, 'toContact'])
            : setFieldSearch(fieldSearch.filter((item) => item !== 'toContact'))
        }
      />
      <Line
        name="fromContact"
        title={'Подразделение'}
        selected={fieldSearch.some((item) => item === 'fromContact')}
        onPress={() =>
          !fieldSearch.some((item) => item === 'fromContact')
            ? setFieldSearch([...fieldSearch, 'fromContact'])
            : setFieldSearch(fieldSearch.filter((item) => item !== 'fromContact'))
        }
      />
      <Line
        name="expeditor"
        title={'Экспедитор'}
        selected={fieldSearch.some((item) => item === 'expeditor')}
        onPress={() =>
          !fieldSearch.some((item) => item === 'expeditor')
            ? setFieldSearch([...fieldSearch, 'expeditor'])
            : setFieldSearch(fieldSearch.filter((item) => item !== 'expeditor'))
        }
      />
    </View>
  );
};

export { SettingsSearchScreen };

const localeStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  fontSize18: {
    fontSize: 18,
  },
  line: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 45,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  title: {
    padding: 10,
  },
});
