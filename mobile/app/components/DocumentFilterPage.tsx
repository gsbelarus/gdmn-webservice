import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';
import DatePicker from 'react-native-datepicker';
import Swiper from 'react-native-web-swiper';

const DocumentFilterPage = (): JSX.Element => {

  const {navigate} = useNavigation();
  const [date, setDate] = useState(new Date());
  const [docTypes, setDocTypes] = useState([]);
  const [contacts, setContacts] = useState([]);

  const today = new Date();

  useEffect(() => {
    const getData = async() => {
      const d_docTypes = JSON.parse(await AsyncStorage.getItem('docTypes'));
      const d_contacts = JSON.parse(await AsyncStorage.getItem('contacts'));
      const newDT = d_docTypes.reduce((arr, item) => {if (arr[arr.length - 1].length == 2) {
        arr.push([]);
      }
      arr[arr.length - 1].push(item);
      return arr;}, [[]])
      setDocTypes(newDT);
      const newC = d_contacts.reduce((arr, item) => {if (arr[arr.length - 1].length == 2) {
        arr.push([]);
      }
      arr[arr.length - 1].push(item);
      return arr;}, [[]])
      setContacts(newC);
    }
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View  style={{flex: 1, borderColor: '#B1B1B1', borderRadius: 4, borderWidth: 1, borderStyle: 'solid'}} key={1}>
        <Text style={styles.subdivisionText}>Тип документа</Text>
        {docTypes && docTypes.length !== 0
        ? <Swiper
          controlsProps={{
            dotsTouchable: true,
            prevPos: false,
            nextPos: false,
            dotsPos: 'bottom',
          }}
        >
          {
            docTypes.map((d, idx) => (<View style={styles.slide} key={idx}>
              <View style={styles.slideTextView} key={`${idx}-1`}>
                <MaterialCommunityIcons
                  name="checkbox-blank-circle"
                  size={20}
                  color={'#F1FA3F'}
                />
                {console.log(d[0].NAME)}
                <Text numberOfLines={5}>{d[0] && d[0].NAME ? d[0].NAME : 'unknown'}</Text>
              </View>
              <View style={styles.slideTextView} key={`${idx}-2`}>
                <MaterialCommunityIcons
                  name="checkbox-blank-circle"
                  size={20}
                  color={'#F1FA3F'}
                />
                <Text numberOfLines={5}>{d[1] && d[1].NAME ? d[1].NAME : 'unknown'}</Text>
              </View>
            </View>)
            )
          }
        </Swiper>
        : <Text>Not found</Text>
      }
      </View>
      <View style={{flex: 1, borderColor: '#B1B1B1', borderRadius: 4, borderWidth: 1, borderStyle: 'solid', marginTop: 15, marginBottom: -60}} key={2}>
        <Text style={styles.subdivisionText}>Подразделение</Text>
        {contacts && contacts.length !== 0
          ? <Swiper
            controlsProps={{
              dotsTouchable: true,
              prevPos: false,
              nextPos: false,
              dotsPos: 'bottom',
            }}
          >
            {
              contacts.map((d, idx) => (<View style={styles.slide} key={idx}>
                <View style={styles.slideTextView} key={`${idx}-1`}>
                  <MaterialCommunityIcons
                    name="checkbox-blank-circle"
                    size={20}
                    color={'#F1FA3F'}
                  />
                  <Text>{d[0] && d[0].NAME ? d[0].NAME : 'unknown'}</Text>
                </View>
                <View style={styles.slideTextView} key={`${idx}-2`}>
                  <MaterialCommunityIcons
                    name="checkbox-blank-circle"
                    size={20}
                    color={'#F1FA3F'}
                  />
                  <Text>{d[1] && d[1].NAME ? d[1].NAME : 'unknown'}</Text>
                </View>
              </View>)
              )
            }
          </Swiper>
          : <Text>Not found</Text>
        }
      </View>
      <View style={{flex: 1.5, marginTop: 80}}>
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
              marginVertical: 30,
            },
            dateText: {
              fontSize: 20,
              color: "#676869"
            }
          }}
          onDateChange={(newDate) => {setDate(newDate)}}
        />
        <View style={styles.buttonView}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.buttonOk} 
              onPress={() => navigate('ProductPage')}
            >
              <Text style={styles.buttonOkText}>ОК</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => navigate('DocumentPage')}
            >
              <Text style={styles.buttonCancelText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar barStyle = "light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    flex: 1,
    justifyContent: 'space-between'
  },
  subdivisionText: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10
  },
  slide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  slideTextView: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    marginRight: 5,
    alignItems: 'center'
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20
  },
  buttonOk: {
    marginRight: 15,
    backgroundColor: '#2D3083',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  buttonOkText: {
    color: '#FFFFFF',
    fontSize: 17
  },
  buttonCancel: {
    marginLeft: 15,
    backgroundColor: '#2D3083',
    color: '#FFFFFF',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: '#212323'
  },
  buttonCancelText: {
    color: '#FFFFFF',
    fontSize: 17
  },
});

export default DocumentFilterPage;
