import { useTheme, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Searchbar, Text, TextInput } from 'react-native-paper';
import Reactotron from 'reactotron-react-native';

import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import { ILineTara, ITara, ISellLine } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';

type SelectBoxingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectBoxingsScreen'>;
type SelectBoxingsScreenRouteProp = RouteProp<RootStackParamList, 'SelectBoxingsScreen'>;

type Props = {
  route: SelectBoxingsScreenRouteProp;
  navigation: SelectBoxingsScreenNavigationProp;
};

const Line = React.memo(
  ({
    boxing,
    quantity,
    weight,
    selected,
    onPress,
  }: {
    boxing: ITara;
    quantity?: number;
    weight?: number;
    selected: boolean;
    onPress: (newQuantity?: number, newWeight?: number) => void;
  }) => {
    const { colors } = useTheme();

    const validateNumber = (value: string, prev: string): string => {
      value = value.replace(',', '.');
      value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);

      return validNumber.test(value) ? value : prev;
    };

    const handleQuantityChange = useCallback(
      (value: string) => {
        const newQuantity = parseFloat(validateNumber(value, (quantity ?? 0).toString()));

        const newWeight =
          Math.round((boxing.type === 'box' ? (boxing.weight ?? 0) * newQuantity : weight ?? 0) * 1000) / 1000;

        onPress(newQuantity, newWeight);
      },
      [quantity, boxing?.type, boxing?.weight, weight, onPress],
    );

    const handleWeightChange = useCallback(
      (value: string) => {
        const validWeight = parseFloat(validateNumber(value, (weight ?? 0).toString()));

        if (validWeight !== 0) {
          onPress(quantity ?? 1, validWeight);
        }
      },
      [weight, onPress, quantity],
    );

    return (
      <View style={{ backgroundColor: !selected ? colors.card : colors.border }}>
        <Text style={[localStyles.fontSize16, localStyles.boxingName]}>{boxing.name}</Text>
        <View style={localStyles.line}>
          {boxing.type === 'paper' ? undefined : (
            <TextInput
              mode={'flat'}
              label={'Количество'}
              keyboardType="decimal-pad"
              value={(quantity ?? 0).toString()}
              onChangeText={handleQuantityChange}
              theme={{
                colors: {
                  placeholder: colors.primary,
                },
              }}
              style={[localStyles.inputQuantity, { backgroundColor: !selected ? colors.card : colors.border }]}
            />
          )}
          <TextInput
            mode={'flat'}
            label={'Общий вес'}
            editable={boxing.type !== 'box'}
            keyboardType="decimal-pad"
            onChangeText={handleWeightChange}
            value={(weight ?? 0).toString()}
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={[localStyles.inputWeight, { backgroundColor: !selected ? colors.card : colors.border }]}
          />
        </View>
      </View>
    );
  },
);

const SelectBoxingsScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const [boxingsLine, setBoxingsLine] = useState<ILineTara[]>();
  const [searchText, setSearchText] = useState('');

  const refList = useRef<FlatList<ITara>>(null);

  useEffect(() => {
    if (!state.formParams || !(state.formParams as ISellLine)) {
      return;
    }

    setBoxingsLine(
      (state.formParams as ISellLine)?.id === route.params.lineId ? (state.formParams as ISellLine).tara : [],
    );
  }, [route.params?.lineId, state.formParams]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            Reactotron.log(boxingsLine);
            actions.setFormParams({ ...state.formParams, tara: boxingsLine.filter((el) => el.quantity) });
            navigation.goBack();
          }}
        />
      ),
    });
  }, [
    actions,
    boxingsLine,
    navigation,
    route.params,
    route.params?.docId,
    route.params?.modeCor,
    state.boxingsLine,
    state.documents,
    state.formParams,
  ]);

  const renderItem = useCallback(
    ({ item }: { item: ITara }) => {
      if (!boxingsLine) {
        return;
      }

      const boxing = boxingsLine.find((box) => box.tarakey === item.id);

      return (
        <Line
          boxing={item}
          quantity={boxing?.quantity}
          weight={boxing?.weight}
          selected={!!(boxingsLine ?? []).find((box) => box.tarakey === item.id && (box.quantity ?? 0) > 0)}
          onPress={(newQuantity?: number, newWeight?: number) => {
            setBoxingsLine([
              ...(boxingsLine ?? []).filter((box) => box.tarakey !== item.id),
              { tarakey: item.id, type: item.type, weight: newWeight, quantity: newQuantity },
            ]);
          }}
        />
      );
    },
    [boxingsLine],
  );

  const keyExtractor = useCallback((box: ITara) => box.id.toString(), []);

  const listEmptyComponent = useCallback(
    () => <Text style={[localStyles.title, localStyles.emptyList]}>Список тары пуст</Text>,
    [],
  );

  const data = useMemo(
    () =>
      (state.boxings as ITara[])
        .sort((curr, prev) => (curr.priority !== prev.priority && curr.priority === 'low' ? 1 : 0))
        .sort((curr, prev) => curr.type.localeCompare(prev.type))
        .filter((boxing) => boxing.name.toUpperCase().includes(searchText.toUpperCase())),
    [searchText, state.boxings],
  );

  return (
    <>
      <Searchbar placeholder="Поиск" onChangeText={setSearchText} value={searchText} style={localStyles.searchBar} />
      <ItemSeparator />
      <FlatList
        key="boxingSelected"
        style={{ backgroundColor: colors.card }}
        ref={refList}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
      />
    </>
  );
};

export { SelectBoxingsScreen };

const localStyles = StyleSheet.create({
  boxingName: {
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingTop: 10,
  },
  emptyList: {
    paddingLeft: 15,
  },
  fontSize16: {
    fontSize: 16,
  },
  inputQuantity: {
    flex: 1,
    paddingLeft: 5,
  },
  inputWeight: {
    flex: 1,
    paddingRight: 5,
  },
  line: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    alignItems: 'center',
    padding: 10,
  },
});
