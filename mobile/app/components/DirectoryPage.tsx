import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Text, AsyncStorage, ScrollView} from 'react-native';

const DirectoryPage = (): JSX.Element => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async() => {
      setData(JSON.parse(await AsyncStorage.getItem('goods')));
    }
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}}>
        {
          data.map( (item, idx) => <View style={styles.productView} key={idx}>
            <View style={styles.productTextView}>
              <View style={styles.productIdView}>
                <Text style={styles.productId}>{idx + 1}</Text>
              </View>
              <View style={styles.productNameTextView}>
                <Text numberOfLines={5} style={styles.productTitleView}>{item.name}</Text>
              </View>
            </View>
          </View>)
        }
      </ScrollView> 
      <StatusBar barStyle = "light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFE0FF',
    flex: 1
  },
  productView: {
    flexDirection: 'column'
  },
  productTextView: {
    flexDirection: 'row',
    margin: 5
  },
  productIdView: {
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  productId: {
    margin: 15,
    textAlignVertical: 'center',
    color: '#000000'
  },
  productNameTextView: {
    maxHeight: 75,
    minHeight: 45,
    marginTop: 5,
    marginHorizontal: 5,
    width: '90%',
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
