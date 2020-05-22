import React, { useState, useEffect } from 'react';
import { View, Modal, FlatList, Dimensions, KeyboardAvoidingView, TouchableOpacity, StyleSheet} from 'react-native';
import { Text, TextInput, Checkbox } from 'react-native-paper';
import { useTheme,  useScrollToTop } from '@react-navigation/native';
import { MaterialIcons, Feather, Foundation } from '@expo/vector-icons';

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
  getSelectedItem: (selected: IItem) => void;
  visible: boolean;
}

const MyListItem = React.memo(({ item, isSelected, onPressItem }: IPropsItem) => {
  const onPress = () => onPressItem (item); 
  const textColor = isSelected ? 'red' : 'black';
  const checked = isSelected ? 'checked' : 'unchecked';
  const width = Dimensions.get('window').width;
  return (
    <TouchableOpacity onPress = {onPress} >
      <View style = {{ width: width * 0.8, backgroundColor: 'white' }}>
        <View style = {{ flexDirection: 'row', alignItems: 'center',  flex: 1 }}>
          <View style = {{ flex: 0.13 }}>
            <Checkbox 
              status = {checked} 
              color = {textColor}
              onPress = {onPress}
            />
          </View>
          <View style = {{ flex: 0.87 }}>
            <Text style = {{
              color:'#000',
              padding: 10,
              fontStyle: 'normal'
              }}>
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
        style={{
            height: 0.5,
            width: Dimensions.get('window').width,
            backgroundColor: '#000'
        }}>
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
      behavior="height">
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
              <View style={{backgroundColor:'#fff',  width:'100%', height:60,  alignItems:'center', padding:20 }}>
                <Text style={{textAlign:'center',  color:'red'}}>
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
                <Text style={{
                  color:'#FFFFFF',
                  fontSize: 14,
                  fontStyle:'normal',
                  fontWeight:'bold'}}> SUBMIT </Text>
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

  useEffect(() => { setStateList( {...stateList,  
    selectedItem: value})
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

  const label = Object.keys(stateList.selectedItem).length === 0 ? 'Select item' : stateList.selectedItem.value;

  return (
    <View style={{flex:1}}> 
      <View style={[localeStyles.picker, { borderColor: colors.border }]}>
        <TouchableOpacity
            onPress={openDropdown}>
            <View style={{flexDirection: 'row', alignItems:'center'}}>
                <View style={{flex:0.90}}>
                  <Text style={localeStyles.text}> {label} </Text> 
                </View>
                <View style={{flex:0.10}}>
                  <MaterialIcons
                    size={20}
                    color={'#000'}
                    name="chevron-right"
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
export { DropdownList } 

const localeStyles = StyleSheet.create({
  containerHome: {
      flex: 1
  },
  text: {
      fontSize: 14,
      color: '#000',
      fontStyle: 'normal'
  },
  picker: {
      width: Dimensions.get('window').width * 0.9,
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
      width: Dimensions.get('window').width * 0.9,
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
      width: Dimensions.get('window').width * 0.9,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center'
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
});