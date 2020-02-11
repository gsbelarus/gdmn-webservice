import React from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';

const DirectoryPage = (): JSX.Element => {

  const {navigate} = useNavigation();

  const data = [{
    id: 1,
    title: 'Томат "Черри очень очень очень очень очень очень длинное предлинное название", Испания 0.75 кг'
  },
  {
    id: 2,
    title: 'Томат "Черри", Испания 0.75 кг'
  },
  {
    id: 3,
    title: 'Томат, Беларусь 0.75 кг'
  },
  {
    id: 4,
    title: 'Томат "Черри очень очень очень очень очень очень длинное предлинное название", Испания 0.75 кг'
  },
  {
    id: 5,
    title: 'Томат "Черри очень очень очень очень очень очень длинное предлинное название", Испания 0.75 кг'
  },
  {
    id: 6,
    title: 'Томат "Черри очень очень очень очень очень очень длинное предлинное название"'
  },
];

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        {
          data.map( (item, idx) => <View style={styles.productView} key={idx}>
            <View style={styles.productTextView}>
              <View style={styles.productIdView}>
                <Text style={styles.productId}>{item.id}</Text>
              </View>
              <View style={styles.productNameTextView}>
                <Text numberOfLines={5} style={styles.productTitleView}>{item.title}</Text>
              </View>
            </View>
          </View>)
        }
      </View> 
      <StatusBar barStyle = "light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFE0FF',
    flex: 1,
  },
  productView: {
    flexDirection: 'column',
  },
  productTextView: {
    flexDirection: 'row',
    margin: 5,
  },
  productIdView: {
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  productId: {
    margin: 15,
    textAlignVertical: 'center',
    color: '#000000',
  },
  productNameTextView: {
    maxHeight: 75,
    minHeight: 45,
    marginTop: 5,
    marginHorizontal: 5,
    width: '90%',
    //textAlignVertical: 'center',
    justifyContent: 'center',
    color: '#000000',
    fontWeight: 'bold'
  },
  productTitleView: {
    fontWeight: 'bold',
    textAlignVertical: 'center',
    minHeight: 25,
    maxHeight: 70,
    flexGrow: 1
  }
});

export default DirectoryPage;
