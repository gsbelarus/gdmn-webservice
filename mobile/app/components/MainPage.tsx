import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, TouchableHighlight, } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';
import DatePicker from 'react-native-datepicker';
import Swiper from 'react-native-swiper';
import { path } from '../../App';

const MainPage = (): JSX.Element => {

  const {navigate} = useNavigation();
  const [date, setDate] = useState(new Date());
  const [pressStatus, setPressStatus] = useState(false);

  const today = new Date();

  const data = [1, 2, 3, 4, 5, 6, 7 ,8, 9, 10, 11, 12];
  const newData = data.reduce((arr, item) => {if (arr[arr.length - 1].length == 2) {
    arr.push([]);
  }
  arr[arr.length - 1].push(item);
  return arr;}, [[]]);

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => navigate('MessagePage')}>
          <MaterialIcons
            name="message"
            size={28}
            color={'#9CAEBA'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('SendMessagePage')}>
          <MaterialIcons
            name="create"
            size={28}
            color={'#9CAEBA'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.documentTypeView}>
        <Text style={styles.documentTypeText}>Тип документа</Text>
        <Swiper style={styles.documentTypeSwiper} showsButtons={true}>
          <MaterialIcons
            name="circle"
            size={24}
            color={'#F1FA3F'}
          />
          {
            newData.map((d) => (<View style={styles.slide}>
              <Text>{d[0]}</Text>
              <Text>{d[1]}</Text>
            </View>)
            )
          }
        </Swiper>
      </View>
      <View style={styles.subdivisionView}>
        <Text style={styles.subdivisionText}>Подразделение</Text>
        <Swiper style={styles.documentTypeSwiper} showsButtons={true}>
          <MaterialIcons
            name="circle"
            size={24}
            color={'#F1FA3F'}
          />
          {
            newData.map((d) => (<View style={styles.slide}>
              <Text>{d[0]}</Text>
              <Text>{d[1]}</Text>
            </View>)
            )
          }
        </Swiper>
      </View>
      <DatePicker
        style={{width: '100%'}}
        date={date}
        mode="date"
        placeholder="select date"
        format="DD MMM YYYY"
        minDate={new Date(1990, 0, 1)}
        maxDate={new Date(today.getFullYear() + 5, today.getMonth(), today.getDate())}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        iconComponent={
          <MaterialIcons 
          style={{
            position: 'absolute',
            right: 20,
          }}
          size={30}
          color='#8C8D8F' 
          name='date-range' 
          /> 
        }
        customStyles={{
          dateIcon: {
            position: 'relative',
            top: 4
          },
          dateInput: {
            height: 50,
            fontSize: 40,
            borderRadius: 4,
            marginLeft: 15,
            marginRight: 15
          },
          dateText: {
            fontSize: 20,
            color: "#676869"
          }
        }}
        onDateChange={(newDate) => {setDate(newDate)}}
      />
      <TouchableHighlight
        style={
          pressStatus
            ? styles.viewButtonPress
            : styles.viewButton
        } 
        onHideUnderlay={() => setPressStatus(false)}
        onShowUnderlay={() => setPressStatus(true)}
        onPress={() => navigate('MessagePage')}
      >
        <Text 
        style={
          pressStatus
          ? styles.viewButtonPressText
          : styles.viewButtonText
          }
        >Просмотреть документы</Text>
      </TouchableHighlight>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigate('MessagePage')}
      >
        <Text style={styles.createButtonText}>Создать новый документ</Text>
      </TouchableOpacity>
      <StatusBar barStyle="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  navigation: {
    marginLeft: 10,
    marginTop: 50,
    flexDirection: "row"
  },
  documentTypeView: {
    borderStyle: 'solid',
    borderColor: '#C1C1C1'
  },
  documentTypeSwiper: {
  },
  documentTypeText: {
  },
  subdivisionView: {
    borderStyle: 'solid',
    borderColor: '#C1C1C1'
  },
  subdivisionText: {
  },
  Text: {
  },
  slide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  slideText: {
  },
  viewButton: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#EEF2FC',
    padding: 10,
    height: 50,
    alignItems: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  viewButtonPress: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#2D3083',
    padding: 10,
    height: 50,
    alignItems: 'center',
    borderRadius: 4,
    borderColor: '#212323',
    borderWidth: 1
  },
  viewButtonText: {
    color: '#676869',
    fontSize: 20
  },
  viewButtonPressText: {
    color: '#FFFFFF',
    fontSize: 20
  },
  createButton: {
    marginTop: 200,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#2D3083',
    color: '#FFFFFF',
    padding: 15,
    height: 50,
    alignItems: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 17
  },
});

export default MainPage;
