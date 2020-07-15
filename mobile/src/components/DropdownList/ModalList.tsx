// import { Ionicons } from '@expo/vector-icons';
import { useTheme, useScrollToTop } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Text, TextInput, Checkbox, Button } from 'react-native-paper';

export interface IPropsItem {
  item?: IItem;
  isSelected?: boolean;
  onPressItem: (item: IItem) => void;
}

export interface IItem {
  id?: number;
  value?: string;
}

export interface IPropsDropdown {
  list: IItem[];
  selectedValue: IItem;
  visible: boolean;
  onOk: (selected: IItem) => void;
  onCancel: () => void;
}

const MyListItem = ({ item, isSelected, onPressItem }: IPropsItem) => {
  const onPress = useCallback(() => onPressItem(item), [item, onPressItem]);
  const textColor = useMemo(() => (isSelected ? 'red' : 'black'), [isSelected]);
  const checked = useMemo(() => (isSelected ? 'checked' : 'unchecked'), [isSelected]);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={localeStyles.containerItem}>
        <View style={localeStyles.subContainerItem}>
          <View style={{ flex: 0.13 }}>
            <Checkbox status={checked} color={textColor} onPress={onPress} />
          </View>
          <View style={{ flex: 0.87 }}>
            <Text style={localeStyles.textItem}>{item.value}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ModalList = ({ list, selectedValue, onOk, onCancel, visible }: IPropsDropdown) => {
  const ref = React.useRef<FlatList<IItem>>(null);
  useScrollToTop(ref);

  const { colors } = useTheme();

  const [state, setState] = useState({
    datas: [],
    dataSource: [],
    text: '',
    selected: {} as IItem,
  });

  useEffect(() => setState({ datas: list, dataSource: list, selected: selectedValue, text: '' }), [
    selectedValue,
    list,
  ]);

  // /*Search Items */
  const searchFilter = useCallback(
    (text: string) => {
      const newData = state.datas.filter((item) => {
        const itemData = item.value.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setState({ ...state, dataSource: newData, text });
    },
    [state],
  );

  // /*Seperator between items */
  const listViewItemSeparator = useCallback(() => <View style={localeStyles.itemSeparator} />, []);

  // /*Submit selected item and goes back to parent activity */
  const submitSelectItems = useCallback(() => {
    onOk(state.selected);
  }, [onOk, state.selected]);

  const keyExtractor = useCallback((item: IItem) => String(item.id), []);

  const onPressItem = useCallback(
    (item: IItem) => {
      setState({ ...state, selected: item });
    },
    [state],
  );

  const renderItem = useCallback(
    ({ item }: { item: IItem }) => {
      const isSelected = (state.selected as IItem).id === item.id;
      return <MyListItem item={item} isSelected={isSelected} onPressItem={onPressItem} />;
    },
    [onPressItem, state.selected],
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Modal animationType="fade" transparent={true} visible={visible}>
        <View style={localeStyles.container}>
          <View style={localeStyles.modalView}>
            <View style={localeStyles.filter}>
              <TextInput
                style={[
                  localeStyles.input,
                  localeStyles.textInput,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                  },
                ]}
                onChangeText={searchFilter}
                value={state.text}
                placeholder="Введите строку поиска"
                placeholderTextColor={colors.border}
                multiline={false}
                autoCapitalize="sentences"
                underlineColorAndroid="transparent"
                selectionColor={'black'}
                returnKeyType="done"
                autoCorrect={false}
              />
            </View>
            {state.dataSource.length === 0 ? (
              <View style={localeStyles.notFoundContaner}>
                <Text style={localeStyles.notFoundText}>Не найдено {JSON.stringify(state.dataSource)}</Text>
              </View>
            ) : (
              <FlatList
                style={{ backgroundColor: '#fff' }}
                ref={ref}
                extraData={state}
                data={state.dataSource}
                ItemSeparatorComponent={listViewItemSeparator}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
              />
            )}
            {/* <TouchableOpacity
              onPress={() => {
                submitSelectItems();
              }}
            > */}
            <View style={[localeStyles.buttonView, { backgroundColor: colors.primary }]}>
              <Button mode="contained" style={localeStyles.button} onPress={submitSelectItems}>
                Подтвердить
              </Button>
              <Button mode="contained" style={localeStyles.button} onPress={onCancel}>
                Отменить
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const localeStyles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 5,
  },
  buttonView: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#00000040',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: Dimensions.get('window').height,
  },
  containerHome: {
    flex: 1,
  },
  containerItem: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.95,
  },
  containerMain: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
  },
  filter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  header: {
    backgroundColor: '#1F618D',
    width: '100%',
  },
  icon: {
    color: '#000',
    fontSize: 15,
  },
  input: {
    fontSize: 14,
    height: 30,
    marginTop: 30,
    padding: 0,
    width: '95%',
  },
  itemSeparator: {
    backgroundColor: '#000',
    height: 1,
    width: '100%',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  },
  notFoundContaner: {
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    padding: 20,
    width: '100%',
  },
  notFoundText: {
    color: 'red',
    textAlign: 'center',
  },
  subContainerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  // submitButton: {
  //   color: '#FFFFFF',
  //   fontSize: 14,
  //   fontStyle: 'normal',
  //   fontWeight: 'bold',
  // },
  text: {
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
  },
  textInput: {
    borderWidth: 0,
    fontSize: 14,
    textAlign: 'center',
  },
  textItem: {
    color: '#000',
    fontStyle: 'normal',
    padding: 10,
  },
});
