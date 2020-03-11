
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import Dialog from 'react-native-dialog';
import { useStore } from '../store';
import { IBaseUrl } from '../model';

export const Settings = (props: { confirm: () => void }): JSX.Element => {
  const [server, setServer] = useState<IBaseUrl>(undefined);
  const [newServer, setNewServer] = useState<IBaseUrl>(undefined);
  const [showDialog, setShowDialog] = useState(false);
  const { state: { baseUrl }, actions } = useStore();

  useEffect(() => {
    const getServer = async () => {
      setServer(baseUrl);
      // const pathFromStorage = JSON.parse(await AsyncStorage.getItem('pathServer'));
      // setServer(pathFromStorage ? pathFromStorage : `${config.server.name}:${config.server.port}`);
      // if (!pathFromStorage) await AsyncStorage.setItem('pathServer', JSON.stringify(`${config.server.name}:${config.server.port}`));
    }

    getServer();
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {
        showDialog
          ? null

          : <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2}>IP-адрес сервера:</Text>
                <Text numberOfLines={2}>{server?.server || ''}</Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text
                  style={styles.buttonText}
                  onPress={() => setShowDialog(true)}
                >Изменить</Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={{ ...styles.button, ...styles.buttonConfirm }}
                onPress={() => props.confirm()}
              >
                <Text style={styles.buttonText}>Готово</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
    </View>
  );
}

 {/* <View>
            <Dialog.Container visible={true}>
              <Dialog.Title>Настройка</Dialog.Title>
              <Dialog.Description>
                Введите новый адрес сервера.
            </Dialog.Description>
              <Dialog.Input
                value={newServer}
                onChangeText={setNewServer}
              />
              <Dialog.Button
                label="Сохранить"
                onPress={async () => {
                  setShowDialog(false);
                  await AsyncStorage.setItem('pathServer', JSON.stringify(newServer));
                  setServer(JSON.parse(await AsyncStorage.getItem('pathServer')))
                  setNewServer('');
                }}
              />
              <Dialog.Button
                label="Отмена"
                onPress={() => {
                  setShowDialog(false);
                  setNewServer('');
                }}
              />
            </Dialog.Container>
          </View> */}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginTop: 30,
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#2D3083',
    justifyContent: 'center',
    borderRadius: 7,
    borderColor: '#212323',
    height: 35,
  },
  buttonConfirm: {
    height: 50
  },
  buttonText: {
    color: '#FFF'
  },
});
