import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, TouchableHighlight, AsyncStorage } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { path } from '../../App';

const MainPage = (): JSX.Element => {

  const {navigate} = useNavigation();

  useEffect( () => {
    const typesData = ['goods', 'remains', 'docTypes', 'contacts', 'docs'];
    const getData = async() => {
      const data = await fetch(
        `${path}test/all`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }
      ).then(res => res.json());
      data.status === 200
      ? data.result.map((item, idx) => AsyncStorage.setItem(typesData[idx], JSON.stringify(item)))
      : undefined;
    }

    const checkData = async() => {
      const keys = await AsyncStorage.getAllKeys();
      keys.length !== 0 && typesData.filter( item => !keys.find(key => key === item)).length === 0
      ? undefined
      : await getData();
    }
    checkData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{flex: 1.5, marginTop: 80}}>
        <TouchableHighlight
          style={styles.viewButton} 
          onPress={() => navigate('DirectoryPage')}
        >
          <Text 
          style={styles.viewButtonText}>Справочник</Text>
        </TouchableHighlight>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigate('DocumentPage')}
          >
            <Text style={styles.createButtonText}>Документы</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar barStyle = "light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 100,
    flex: 1,
    justifyContent: 'space-between'
  },
  viewButton: {
    backgroundColor: '#2D3083',
    marginVertical: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 20
  },
  createButton: {
    //margin: 15,
    backgroundColor: '#2D3083',
    color: '#FFFFFF',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 20
  },
});

export default MainPage;
