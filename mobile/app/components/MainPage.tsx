import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, TouchableHighlight, AsyncStorage, Alert } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { SimpleLineIcons } from '@expo/vector-icons';
import { path } from '../../App';

const MainPage = (): JSX.Element => {

  const {navigate} = useNavigation();
  const [user, setUser] = useState();
  const [resUpd, setResUpd] = useState();

  useEffect( () => {
    const typesData = ['goods', 'remains', 'documenttypes', 'contacts', 'docs'];
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
      await AsyncStorage.clear();
      const keys = await AsyncStorage.getAllKeys();
      !!keys && typesData.filter( item => !keys.find(key => key === item)).length === 0
      ? undefined
      : await getData();

     /* const getMe = await fetch(
        `${path}me`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }
      ).then(res => res.json());
      getMe.status === 200 && getMe.result !== 'not authenticated'
      ? setUser(getMe.result)
      : undefined;*/
    }
    checkData();
  }, []);

  const sendUpdateRequest = async () => {
    if(user) {
      const result = await fetch(
        `${path}messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            head: {
              companyId: user.companies[0]
            },
            body: {
              type: "cmd",
              payload: {
                name: "get_references",
                params: [
                  "documenttypes", "goodgroups", "goods", "remains", "contacts"
                ]
              }
            }
          })
        }
      ).then(res => res.json());
      if(result.status === 200) {
        setResUpd(result.result);
        Alert.alert(
          'Успех!',
          'Через несколько секунд нажжмите на "Получить обновления".',
          [
            {
              text: 'OK',
              onPress: () => {}
            },
          ]
        )
      } else {
        Alert.alert(
          'Запрос не был отправлен',
          '',
          [
            {
              text: 'OK',
              onPress: () => {}
            },
          ]
        )
      }
    } else {
      Alert.alert(
        'Упс!',
        'Что-то пошло не так!',
        [
          {
            text: 'OK',
            onPress: () => {}
          },
        ]
      )
    }
  }

  const checkUpdateRequest = async () => {
    const result = await fetch(
      `${path}messages?companyId=${user.companies[0]}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include'
      }
    ).then(res => res.json());
    if(result.status === 200) {
      const data = result.result.find(item => item.body.type === 'data');
      if(!data) {
        Alert.alert(
          'Упс!',
          'Что-то пошло не так!',
          [
            {
              text: 'OK',
              onPress: () => {}
            },
          ]
        )
      } else {
        data.body.payload.map(item => AsyncStorage.setItem(item.name, JSON.stringify(item.data)));
        setResUpd(undefined);
      }
    } else {
      Alert.alert(
        'Упс!',
        'Что-то пошло не так!',
        [
          {
            text: 'OK',
            onPress: () => {}
          },
        ]
      )
    }
  }

  const _signOutAsync = async () => {
    Alert.alert(
      'Подтвердите выход',
      '',
      [
        {
          text: 'OK',
          onPress: async() => {
            const data = await fetch(
              `${path}logout`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json'},
                credentials: 'include'
              }
            ).then(res => res.json())
            if (data.status !== 200) {
              return Alert.alert(
                data.result,
                'Попробуйте еще раз',
                [
                  {
                    text: 'OK',
                    onPress: () => {}
                  },
                ],
              );
            } else {
              navigate('Auth');
            }
          }
        },
        {
          text: 'Отмена',
          onPress: () => {}
        },
      ],
    );
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
          <TouchableOpacity
            style={styles.createButton} 
            onPress={async() => {!resUpd ? sendUpdateRequest() : checkUpdateRequest()} }
          >
            <Text style={styles.createButtonText}>{!resUpd ? 'Обновить данные' : 'Получить обновления'}</Text>
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
    marginBottom: 15,
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
