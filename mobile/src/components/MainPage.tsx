import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, TouchableHighlight, AsyncStorage, Alert } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseUrl } from '../helpers/utils';
import { authApi } from '../api/auth';
import { useStore } from '../store';

const MainPage = (): JSX.Element => {

  const { navigate } = useNavigation();
  const [user, setUser] = useState();
  const [resUpd, setResUpd] = useState();

  const { state, actions } = useStore();

  useEffect(() => {
    const typesData = ['goods', 'remains', 'documenttypes', 'contacts', 'docs'];
    const getData = async () => {
      const data = await fetch(
        `${baseUrl}/test/all`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      ).then(res => res.json());
      data.status === 200
        ? data.result.map((item, idx) => AsyncStorage.setItem(typesData[idx], JSON.stringify(item)))
        : undefined;
    }

    const checkData = async () => {
      await AsyncStorage.clear();
      const keys = await AsyncStorage.getAllKeys();
      !!keys && typesData.filter(item => !keys.find(key => key === item)).length === 0
        ? undefined
        : await getData();

      /*const getMe = await fetch(
        `${baseUrl}me`,
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
    if (user) {
      const result = await fetch(
        `${baseUrl}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      if (result.status === 200) {
        setResUpd(result.result);
        Alert.alert(
          'Успех!',
          'Через несколько секунд нажжмите на "Получить обновления".',
          [
            {
              text: 'OK'
            },
          ]
        )
      } else {
        Alert.alert(
          'Запрос не был отправлен',
          '',
          [
            {
              text: 'OK'
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
            text: 'OK'
          },
        ]
      )
    }
  }

  const checkUpdateRequest = async () => {
    const result = await fetch(
      `${baseUrl}/messages?companyId=${user.companies[0]}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }
    ).then(res => res.json());
    if (result.status === 200) {
      const data = result.result.find(item => item.body.type === 'data');
      if (!data) {
        Alert.alert(
          'Упс!',
          'Что-то пошло не так!',
          [
            {
              text: 'OK',
              onPress: () => { }
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
            onPress: () => { }
          },
        ]
      )
    }
  }

  const _logoutAsync = async () => {
    Alert.alert(
      'Выйти из пользователя?', '',
      [
        {
          text: 'Подтвердить',
          onPress: async () => {
            const res = await authApi.logout();
            if (res.status === 200) {
              actions.logout();
              return;
            }
            return Alert.alert(
              'Ошибка сервера', res.result,
              [
                {
                  text: 'OK'
                },
              ],
            );
          }
        },
        {
          text: 'Отмена',
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 2 }}>
        <TouchableHighlight
          style={styles.viewButton}
          onPress={() => navigate('DirectoryPage')}
        >
          <Text style={styles.viewButtonText}>Справочник</Text>
        </TouchableHighlight>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigate('DocumentPage')}
          >
            <Text style={styles.createButtonText}>Документы</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={async () => { !resUpd ? sendUpdateRequest() : checkUpdateRequest() }}
          >
            <Text style={styles.createButtonText}>{!resUpd ? 'Обновить данные' : 'Получить обновления'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row-reverse' }}>
{/*         <TouchableOpacity onPress={_disconnectAsync} style={styles.systemButtons}>
          <MaterialCommunityIcons
            size={30}
            color='#FFF'
            name='logout-variant'
          />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={_logoutAsync} style={styles.systemButtons}>
          <MaterialCommunityIcons
            size={30}
            color='#FFF'
            name='account-convert'
          />
        </TouchableOpacity>
      </View>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginTop: 0,
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
  systemButtons: {
    margin: 10,
    borderRadius: 50,
    borderColor: '#2D3083',
    borderWidth: 1,
    height: 50,
    width: 50,
    backgroundColor: '#2D3083',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default MainPage;
