import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Button, Picker, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';
import { path } from '../../App';

const SendMessagePage = (): JSX.Element => {

  interface IUser {
    id?: string;
    userName: string;
    organisations?: string[];
    firstName?: string;
    lastName?: string;
    numberPhone?: string;
  }

  const {navigate} = useNavigation();
  const [textMessage, onChangeText] = useState('');
  const [organisations, setOrganisations] = useState([]);
  const [producer, setProducer] = useState('');
  const [selectedOrganisation, onSelectOrganisation] = useState('');
  const [consumers, setConsumers] = useState([]);
  const [selectedConsumer, onSelectConsumer] = useState('');


  useEffect( () => {
    const getOrganisation = async() => {
      if(!organisations || organisations.length === 0) {
        setOrganisations(await fetch(
          `${path}me`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
          }
        ).then(res => res.json())
        .then(res => { res.status === 200 && (res.result as IUser) ? setProducer((res.result as IUser).userName) : undefined; return res})
        .then(res => res.status === 200 && (res.result as IUser) ? (res.result as IUser).organisations : []));
      }
    }
      
    getOrganisation();
  }, [])

  useEffect(() => {
    const getConsumers = async() => {
      const result = await fetch(
        `${path}user/byOrganisation?idOrganisation=${selectedOrganisation}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        }
      ).then(res => res.json())
      .then(res => res.status === 200 && (res.result as IUser[]) ? res.result as IUser[] : []);
      setConsumers(result.reduce( (users, user) => [...users, user.userName], ['all']).filter( user => user !== producer));
    }

    getConsumers();
  }, [selectedOrganisation])

  const sendMessage = async() => {
    await fetch(
      `${path}message/new`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          producer,
          organisation: selectedOrganisation,
          consumer: selectedConsumer !== 'all' ? selectedConsumer : undefined,
          sedingTime: (new Date()).toString(),
          body: textMessage
        })
      }
    ).then(res => res.json())
  }

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => navigate('ProfilePage')}>
          <MaterialIcons
            name="menu"
            size={28}
            color={'#9CAEBA'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('MessagePage')}>
          <MaterialIcons
            name="message"
            size={28}
            color={'#9CAEBA'}
          />
        </TouchableOpacity>
      </View>
      <Picker
        selectedValue={selectedOrganisation}
        style={{height: 50, width: 100}}
        onValueChange={itemValue => onSelectOrganisation(itemValue) }
      >
        {
          organisations.map(organisation => {
            return <Picker.Item key={organisation} label={organisation} value={organisation} />
          })
        }
      </Picker>
      <Picker
        selectedValue={selectedConsumer}
        style={{height: 50, width: 100}}
        onValueChange={itemValue => onSelectConsumer(itemValue) }
      >
        {
          consumers.map(consumer => {
            return <Picker.Item key={consumer} label={consumer} value={consumer} />
          })
        }
      </Picker>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => onChangeText(text)}
        value={textMessage}
        placeholder="Type here to enter your message"
        placeholderTextColor={'#9A9FA1'}
        multiline={true}
        autoCapitalize="sentences"
        underlineColorAndroid="transparent"
        selectionColor={'black'}
        returnKeyType="done"
        autoCorrect={false}
        blurOnSubmit={true}
        onSubmitEditing={sendMessage}
      />
      <Button title="Send messages" onPress={sendMessage} />
      <StatusBar barStyle="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3EFF4',
    flex: 1,
    flexDirection: "column"
  },
  navigation: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: "row"
  },
  input: {
    margin: 15,
    borderColor: '#70667D',
    borderWidth: 1,
    fontSize: 24,
    height: 40
  },
  submitButton: {
    backgroundColor: '#70667D',
    padding: 10,
    margin: 15,
    height: 40,
    alignItems: 'center'
  },
  submitButtonText:{
    color: 'white',
    fontSize: 18
  }
});

export default SendMessagePage;
