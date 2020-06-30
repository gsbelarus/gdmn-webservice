import React, { useState, useEffect } from 'react';
import { View, Modal, FlatList, Dimensions, KeyboardAvoidingView, TouchableOpacity, StyleSheet,  Platform } from 'react-native';
import { Text, TextInput, Checkbox } from 'react-native-paper';
import { useTheme,  useScrollToTop } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

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
  list: IItem [];
  selectedValue: IItem; 
  visible: boolean;
  getSelectedItem: (selected: IItem) => void;
}

const MyListItem = React.memo(({ item, isSelected, onPressItem }: IPropsItem) => {
  const onPress = () => onPressItem (item); 
  const textColor = isSelected ? 'red' : 'black';
  const checked = isSelected ? 'checked' : 'unchecked';
  return (
    <TouchableOpacity onPress = {onPress} >
      <View style = {localeStyles.containerItem}>
        <View style = {localeStyles.subContainerItem}>
          <View style = {{ flex: 0.13 }}>
            <Checkbox 
              status = {checked} 
              color = {textColor}
              onPress = {onPress}
            />
          </View>
          <View style = {{ flex: 0.87 }}>
            <Text style = {localeStyles.textItem}>
              {item.value}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
})

const Dropdown =  React.memo(({list, selectedValue, getSelectedItem, visible}: IPropsDropdown) => {
  const ref = React.useRef<FlatList<IItem>>(null);
  useScrollToTop(ref);
  const { colors } = useTheme();

  const [state, setState] = useState({
    modalVisible: false,
    datas: [],
    dataSource: [],
    text: '',
    selected: {} as IItem,
  })

  useEffect(() => { setState( {...state,  
      modalVisible: visible,
      datas: list,
      dataSource: list,
      selected: selectedValue})
  }, [visible, selectedValue]);
  
  /*Search Items */
  const searchFilter = (text: string) => {
    const newData = state.datas.filter((item) => {
        const itemData = item.value.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })
    setState({...state, dataSource: newData, text: text})
  }

  /*Seperator between items */
  const listViewItemSeparator = () => {
    return(
      <View 
        style={localeStyles.itemSeparator}>
      </View>
    )
  }

  /*Submit selected item and goes back to parent activity */
  const submitSelectItems = () => {
    getSelectedItem(state.selected);
    setState({...state, modalVisible: false, text: ''});
  }

  const keyExtractor = (item: IItem) => String(item.id);

  const onPressItem = (item: IItem) => {
    setState({...state, selected: item}); 
  }
  const renderItem = ({ item }: { item: IItem }) => {
    const isSelected = (state.selected as IItem).id === item.id;
    return( 
      <MyListItem item={item} isSelected={isSelected} onPressItem={onPressItem} />
    )
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.modalVisible}
        onRequestClose={() => {
            setState({...state, modalVisible: !state.modalVisible});
        }}
        onDismiss={() => {
            setState({...state, modalVisible:!state.modalVisible});
        }}>
        
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
            { state.dataSource.length == 0 ?
              <View style={localeStyles.notFoundContaner}>
                <Text style={localeStyles.notFoundText}>
                  Не найдено
                </Text>
              </View>
            :
              <FlatList
                style={{backgroundColor:'#fff'}}
                ref={ref}
                extraData={state}
                data={state.dataSource}
                ItemSeparatorComponent={listViewItemSeparator}
                renderItem={renderItem}
                keyExtractor={keyExtractor}   
              >
              </FlatList>
            }
            <TouchableOpacity  onPress= {() => {submitSelectItems()}}>
              <View style={[localeStyles.button, { backgroundColor: colors.primary}]}>
                <Text style={localeStyles.submitButton}> ПРИНЯТЬ </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
})

const DropdownList =  React.memo(({list, value, onValueChange}: {list: IItem[], value: IItem, onValueChange (item: IItem): void }) => {
  const { colors } = useTheme();
  const [stateList, setStateList] = useState({ selectedItem: {} as IItem, modalVisible: false})

  useEffect(() => { value === undefined ? 
    setStateList( {...stateList, selectedItem: {}}) : 
    setStateList( {...stateList, selectedItem: value})
  }, [value]);

  /**This function open the dropdown modal */
  const openDropdown = ()=> {
    setStateList({...stateList, modalVisible: !stateList.modalVisible})
  }

  /**Set the state variable "selectedItem" after selecting item from dropdown       */
  const getSelectedValue = (item: IItem) => {
    setStateList({...stateList, modalVisible: !stateList.modalVisible, selectedItem: item});
    onValueChange(item);
  }
  const label = (stateList === undefined) || Object.keys(stateList.selectedItem).length === 0 ? 
    'Выберите из списка' : stateList.selectedItem.value;

  return (
    <View style={{flex: 1}}> 
      <View style={[localeStyles.picker, { borderColor: colors.border}]}>
        <TouchableOpacity
            onPress={openDropdown}>
            <View style={localeStyles.containerMain}>
                <View style={{flex:0.93}}>
                  <Text  style={localeStyles.text} > {label} </Text> 
                </View>
                <View style={{flex:0.07}}>
                  <AntDesign
                    size={15}
                    color={'#000'}
                    name={"down"}
                  />
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
  )
})

export default DropdownList; 

const localeStyles = StyleSheet.create({
  containerHome: {
      flex: 1
  },
  containerMain: {
    flexDirection: 'row', 
    alignItems:'center',  
    height: '100%',
  },
  containerItem: {
    width:  Dimensions.get('window').width * 0.95, 
    backgroundColor: 'white',
  },
  subContainerItem: {
    flexDirection: 'row', 
    alignItems: 'center',  
    flex: 1, 
  },
  text: {
    fontSize: 14,
    color: '#000',
    fontStyle: 'normal',
  },
  textItem: {
    color:'#000',
    padding: 10,
    fontStyle: 'normal',
    },
  picker: {
    width: '100%',
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    alignSelf:'center',
    backgroundColor: '#FFFFFF',
  },
  icon: {
    fontSize: 15,
    color: '#000'
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#00000040',
    flexDirection: 'column',
  },
  modalView:{
    backgroundColor: '#FFFFFF',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  header:{
    backgroundColor:'#1F618D',
    width: "100%",
  },
  textInput:{
    textAlign: 'center',
    borderWidth: 0,
    fontSize: 14,
  },
  button:{
    width: Dimensions.get('window').width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButton: {
    color:'#FFFFFF',
    fontSize: 14,
    fontStyle:'normal',
    fontWeight:'bold',
  },
  filter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    width: "95%",
  },
  input: {
    fontSize: 14,
    height: 30,
    marginTop: 10,
    padding: 0,
    width: "95%",
  },
  itemSeparator: {
    height: 0.9,
    width: '100%',
    backgroundColor: '#000',
  },
  notFoundContaner: {
    backgroundColor:'#fff',  
    width: '100%', 
    height: 60,  
    alignItems: 'center', 
    padding: 20, 
  },
  notFoundText: {
    textAlign:'center',  
    color:'red',
  }
});