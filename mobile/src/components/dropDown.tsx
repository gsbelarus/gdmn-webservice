import { AntDesign } from '@expo/vector-icons';
import { useTheme, useScrollToTop } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Text, TextInput, Checkbox } from 'react-native-paper';

/*
Basic Usage

export const dropdownList = () => {
    return (
        <DropdownList
          list={[
              { id: 1, value: 'football' },
              { id: 2, value: 'baseball' },
              { id: 3, value: 'hockey' },
          ]}
          value={id: 2, value: 'baseball'}
          onValueChange={(item) => console.log(item.value)}
        />
    );
};
*/

interface IPropsItem {
  item?: IItem;
  isSelected?: boolean;
  onPressItem: (item: IItem) => void;
}

interface IItem {
  id?: number;
  value?: string;
}

interface IPropsDropdown {
  list: IItem[];
  selectedValue: IItem;
  visible: boolean;
  getSelectedItem: (selected: IItem) => void;
}

const MyListItem = React.memo(({ item, isSelected, onPressItem }: IPropsItem) => {
  const onPress = () => onPressItem(item);
  const textColor = isSelected ? 'red' : 'black';
  const checked = isSelected ? 'checked' : 'unchecked';
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
});

const Dropdown = React.memo(({ list, selectedValue, getSelectedItem, visible }: IPropsDropdown) => {
  const ref = React.useRef<FlatList<IItem>>(null);
  useScrollToTop(ref);
  const { colors } = useTheme();

  const [state, setState] = useState({
    modalVisible: false,
    datas: [],
    dataSource: [],
    text: '',
    selected: {} as IItem,
  });

  useEffect(() => {
    setState({ ...state, modalVisible: visible, datas: list, dataSource: list, selected: selectedValue });
  }, [visible, selectedValue, state, list]);

  /*Search Items */
  const searchFilter = (text: string) => {
    const newData = state.datas.filter((item) => {
      const itemData = item.value.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setState({ ...state, dataSource: newData, text });
  };

  /*Seperator between items */
  const listViewItemSeparator = () => {
    return <View style={localeStyles.itemSeparator} />;
  };

  /*Submit selected item and goes back to parent activity */
  const submitSelectItems = () => {
    getSelectedItem(state.selected);
    setState({ ...state, modalVisible: false, text: '' });
  };

  const keyExtractor = (item: IItem) => String(item.id);

  const onPressItem = (item: IItem) => {
    setState({ ...state, selected: item });
  };
  const renderItem = ({ item }: { item: IItem }) => {
    const isSelected = (state.selected as IItem).id === item.id;
    return <MyListItem item={item} isSelected={isSelected} onPressItem={onPressItem} />;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.modalVisible}
        onRequestClose={() => {
          setState({ ...state, modalVisible: !state.modalVisible });
        }}
        onDismiss={() => {
          setState({ ...state, modalVisible: !state.modalVisible });
        }}
      >
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
            {state.dataSource.length == 0 ? (
              <View style={localeStyles.notFoundContaner}>
                <Text style={localeStyles.notFoundText}>Не найдено</Text>
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
            <TouchableOpacity
              onPress={() => {
                submitSelectItems();
              }}
            >
              <View style={[localeStyles.button, { backgroundColor: colors.primary }]}>
                <Text style={localeStyles.submitButton}>ПРИНЯТЬ</Text>
                {/* <Text style={localeStyles.submitButton}>ЗАКРЫТЬ</Text> */}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
});

const DropdownList = React.memo(
  ({ list, value, onValueChange }: { list: IItem[]; value: IItem; onValueChange(item: IItem): void }) => {
    const { colors } = useTheme();
    const [stateList, setStateList] = useState({ selectedItem: {} as IItem, modalVisible: false });

    useEffect(() => {
      value === undefined
        ? setStateList({ ...stateList, selectedItem: {} })
        : setStateList({ ...stateList, selectedItem: value });
    }, [stateList, value]);

    /**This function open the dropdown modal */
    const openDropdown = () => {
      setStateList({ ...stateList, modalVisible: !stateList.modalVisible });
    };

    /**Set the state variable "selectedItem" after selecting item from dropdown       */
    const getSelectedValue = (item: IItem) => {
      setStateList({ ...stateList, modalVisible: !stateList.modalVisible, selectedItem: item });
      onValueChange(item);
    };
    const label =
      stateList === undefined || Object.keys(stateList.selectedItem).length === 0
        ? 'Выберите из списка'
        : stateList.selectedItem.value;

    return (
      <View style={{ flex: 1 }}>
        <View style={[localeStyles.picker, { borderColor: colors.border }]}>
          <TouchableOpacity onPress={openDropdown}>
            <View style={localeStyles.containerMain}>
              <View style={{ flex: 0.93 }}>
                <Text style={localeStyles.text}> {label} </Text>
              </View>
              <View style={{ flex: 0.07 }}>
                <AntDesign size={15} color={'#000'} name={'down'} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Dropdown
          visible={stateList.modalVisible}
          selectedValue={stateList.selectedItem}
          list={list}
          getSelectedItem={getSelectedValue}
        />
      </View>
    );
  },
);

export default DropdownList;

const localeStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#00000040',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
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
    marginBottom: 5,
    width: '95%',
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
    marginTop: 10,
    padding: 0,
    width: '95%',
  },
  itemSeparator: {
    backgroundColor: '#000',
    height: 0.9,
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
  picker: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    marginTop: 5,
    padding: 10,
    width: '100%',
  },
  subContainerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  submitButton: {
    color: '#FFFFFF',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
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
