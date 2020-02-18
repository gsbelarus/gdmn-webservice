import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, TouchableHighlight, AsyncStorage, Alert } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { SimpleLineIcons } from '@expo/vector-icons';
import { path } from '../../App';

const MainPage = (): JSX.Element => {

  const {navigate} = useNavigation();

  useEffect( () => {
    const typesData = ['goods', 'docTypes', 'contacts', 'docs', 'docLines'];
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

  const _signOutAsync = async () => {
    const data = await fetch(
      `${path}logout`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include'
      }
    ).then(res => res.json())
    if (data.status === 200) {
      return Alert.alert(
        'You login in app!',
        '',
        [
          {
            text: 'OK',
            onPress: () => navigate('Auth')
          },
        ],
      );
    } else {
      return Alert.alert(
        data.result,
        'Try again',
        [
          {
            text: 'OK',
            onPress: () => {}
          },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoutButton}>
          <TouchableOpacity onPress={_signOutAsync}>
            <SimpleLineIcons
              name="logout"
              size={28}
              color={'#2D3083'}
            />
          </TouchableOpacity>
        </View>
      <View style={{flex: 2}}>
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
    marginTop: 30,
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
  logoutButton: {
    flex: 1,
    paddingLeft: 300
  }
});

export default MainPage;
