import React, { useState } from 'react';
import { View, Modal, FlatList, Dimensions, KeyboardAvoidingView, TouchableOpacity, StyleSheet} from 'react-native';
import { Text, TextInput, Button, Checkbox } from 'react-native-paper';

interface IPropsItem {
  selected?: boolean;
  item?: IItem;
  onPressItem: (item: IItem) => void;
}

interface IItem {
  id: number;
  value: string;
}

interface IPropsDropdown {
  list: IItem[];
  getSingleSelectedItem: (selected: IItem) => void;
}

const myListItem = React.memo(({ selected, item, onPressItem }: IPropsItem) => {
  const onPress = () => onPressItem (item); 
  const textColor = selected ? 'red' : 'black';
  const checked = selected ? 'checked' : 'unchecked';
  const _width = Dimensions.get('window').width;
  return (
    <TouchableOpacity onPress = {onPress} >
      <View style = {{ width:_width * 0.8, backgroundColor:'white' }}>
        <View style = {{ flexDirection:'row', alignItems:'center',  flex:1 }}>
          <View style = {{ flex:0.13 }}>
            <Checkbox 
              status = {checked} 
              color = {textColor}
              onPress = {onPress}
            />
          </View>
          <View style = {{ flex:0.87 }}>
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

const Dropdown =  React.memo(({list,  getSingleSelectedItem}: IPropsDropdown) => {
  const [state, setState] = useState({
    modalVisible: false,
    flag: false,
    datas:[],
    dataSource:[],
    text: '',
    selected: undefined
  })

  /*Modal visible */
  const setModalVisible = (visible: boolean, datas, flag: boolean = false) => {
      setState( {...state,
          modalVisible: visible,
          datas: datas,
          dataSource: datas,
          flag: flag
      });
      if (flag == true) {
         setState({...state, selected: undefined});
      }
  }

  /*To close the modal */
  const toggleModal = () => {
    setState({...state, modalVisible: !state.modalVisible});
  }
  
  /*Search Items */
  const searchFilter = (text: string) => {
    const newData = state.datas.filter((item) => {
        const itemData = item.value.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })
    setState({...state, dataSource: newData, text:text})
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
  const selectItems = (item: IItem) => {
    setState({...state, modalVisible: !state.modalVisible})
    getSingleSelectedItem(state.selected);
  }

  const keyExtractor = (item: IItem) => item.id;

  const onPressItem = (item: IItem) => {
    setState({...state, selected: item}); 
  }

  return (
   <div></div>
  )
}) 

export default StyleSheet.create({
  container: {
      flex: 1
  },
  text: {
      fontSize: 14,
      color: '#000',
      fontStyle: 'normal'
  },
  picker: {
      width: Dimensions.get('window').width*0.8,
      height: 40,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: '#000',
      padding: 10,
      marginTop:20,
      alignSelf:'center'
  },
  icon: {
      fontSize: 15,
      color: '#000'
  }
});