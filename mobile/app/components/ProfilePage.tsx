import React from 'react';
import { StyleSheet, View, StatusBar, Button, Alert } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

const ProfilePage = (): JSX.Element => {

  const {navigate} = useNavigation();

  const _signOutAsync = async () => {
    const data = await fetch(
      `http://192.168.0.63:3649/api/signout`,
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
      <Button title="I'm done, sign me out" onPress={_signOutAsync} />
      <StatusBar barStyle="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 200,
    backgroundColor: '#E3EFF4',
    flex: 1
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

export default ProfilePage;
