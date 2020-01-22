import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Button, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';
import { path } from '../../App';

const MessagePage = (): JSX.Element => {
  interface IMessage {
    producer: string;
    organisation: string;
    body: string;
  }

  interface IUser {
    id?: string;
    userName: string;
    organisations?: string[];
    firstName?: string;
    lastName?: string;
    numberPhone?: string;
  }

  const {navigate} = useNavigation();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const getMessages = async () => {
    const organisations = await fetch(
      `${path}me`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
      }
    ).then(res => res.json())
    .then(res => res.status === 200 && (res.result as IUser) ? (res.result as IUser).organisations : undefined);
    organisations 
    ?
      setMessages(await a(organisations))
    : undefined;
  }

  const a = async (organisations: string[]) => {
    let result = [];
    for(const organisation of organisations ) {
      const data = await fetch(
        `${path}message/get?organisation=${organisation}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include'
        }
      ).then(res => res.json());
      data.status === 200 ? result.push(...(data.result as IMessage[])) : undefined;
    }
    return result;
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
        <TouchableOpacity onPress={() => navigate('SendMessagePage')}>
          <MaterialIcons
            name="edit"
            size={28}
            color={'#9CAEBA'}
          />
        </TouchableOpacity>
      </View>
      <Button title="Get messages" onPress={getMessages} />
      {
        messages && messages.length !== 0
        ? <FlatList
          data={messages}
          renderItem={({item, index}) => (
            <Text key={index} style={{margin: 5}}>{item.body} - {item.producer} ({item.organisation})</Text>
          )}
          contentContainerStyle={{ padding: 10 }}
        />
        : undefined
      }
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

export default MessagePage;
