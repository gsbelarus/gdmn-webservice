import { useTheme, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Searchbar, Text, TextInput } from 'react-native-paper';

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
    onPress: (newQuantity: number | undefined, newWeight: number | undefined) => void;
  }) => {
    const { colors } = useTheme();

    const validNumber = (value: string, prev: string) => {
      value = value.replace(',', '.');

      //value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      const validValue = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      return parseFloat(validValue.test(value) ? value : prev).toString();
    };

    const setQuantity2 = useCallback(
      (value: string) => {
        const validQuantity = validNumber(value, (quantity ?? 0).toString());
        const newWeight = (boxing.type === 'box'
          ? ((boxing.weight ?? 0) * Number(validQuantity !== '0' ? validQuantity : '1')).toFixed(3)
          : weight ?? boxing.weight ?? 0
        ).toString();
        if (validQuantity !== '0') {
          onPress(Number(validQuantity), Number(newWeight));
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [quantity, boxing?.type, boxing?.weight, weight, onPress],
    );

    const setWeight2 = useCallback(
      (value: string) => {
        const validWeight = validNumber(value, (weight ?? 0).toString());
        if (validWeight !== '0') {
          onPress(Number(quantity ?? '1'), Number(validWeight));
        }
      },
      [weight, onPress, quantity],
    );

    return (
      <View style={{ backgroundColor: !selected ? colors.card : colors.border }}>
        <Text style={[localeStyles.fontSize16, localeStyles.boxingName]}>{boxing.name}</Text>
        <View style={localeStyles.line}>
          {boxing.type === 'paper' ? undefined : (
            <TextInput
              mode={'flat'}
              label={'Количество'}
              keyboardType="decimal-pad"
              value={(quantity ?? 0).toString()}
              onChangeText={setQuantity2}
              theme={{
                colors: {
                  placeholder: colors.primary,
                },
              }}
              style={[localeStyles.inputQuantity, { backgroundColor: !selected ? colors.card : colors.border }]}
            />
          )}
          <TextInput
            mode={'flat'}
            label={'Общий вес'}
            editable={boxing.type !== 'box'}
            keyboardType="decimal-pad"
            onChangeText={(text) => {
              setWeight2(text);
            }}
            value={(weight ?? boxing.weight ?? 0).toString()}
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={[localeStyles.inputWeight, { backgroundColor: !selected ? colors.card : colors.border }]}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            actions.setFormParams({ ...state.formParams, tara: boxingsLine });
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
    route.params.docId,
    route.params.modeCor,
    state.boxingsLine,
    state.documents,
    state.formParams,
  ]);

  const renderItem = useCallback(
    ({ item }: { item: ITara }) => {
      const boxing = boxingsLine ? boxingsLine.find((box) => box.tarakey === item.id) : undefined;
      return boxingsLine ? (
        <Line
          boxing={item}
          quantity={boxing?.quantity}
          weight={boxing?.weight}
          selected={!!(boxingsLine ?? []).find((box) => box.tarakey === item.id)}
          onPress={(newQuantity: number | undefined, newWeight: number | undefined) => {
            setBoxingsLine([
              ...(boxingsLine ?? []).filter((box) => box.tarakey !== item.id),
              { tarakey: item.id, type: item.type, weight: newWeight, quantity: newQuantity },
            ]);
          }}
        />
      ) : undefined;
    },
    [boxingsLine],
  );

  const keyExtractor = useCallback((box: ITara) => box.id.toString(), []);

  const listEmptyComponent = useCallback(
    () => <Text style={[localeStyles.title, localeStyles.emptyList]}>Тар нет</Text>,
    [],
  );

  const data = useMemo(
    () =>
      (state.boxings as ITara[])
        .sort((curr, prev) => curr.type.localeCompare(prev.type))
        .filter((boxing) => boxing.name.toUpperCase().includes(searchText.toUpperCase())),
    [searchText, state.boxings],
  );

  return (
    <>
      <Searchbar placeholder="Поиск" onChangeText={setSearchText} value={searchText} style={localeStyles.searchBar} />
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

const localeStyles = StyleSheet.create({
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
