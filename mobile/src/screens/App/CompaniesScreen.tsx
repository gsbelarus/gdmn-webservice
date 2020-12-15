import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, RadioButton, Button, IconButton } from 'react-native-paper';

import SubTitle from '../../components/SubTitle';
import { appStorage } from '../../helpers/utils';
import { useAuthStore, useServiceStore } from '../../store';
import styles from '../../styles/global';

const CompaniesScreen = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>();
  const [companies, setCompanies] = useState<string[]>();

  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const {
    state: { userID },
    actions,
  } = useAuthStore();

  useEffect(() => {
    const request = async () => {
      const response = await apiService.auth.getUserStatus();
      if (response.result) {
        setCompanies(response.data?.companies || []);
      }
    };
    request();
  }, [apiService.auth]);

  useEffect(() => {
    const getCompanyId = async () => {
      // const savedCompany = await appStorage.getItem(`${userID}/companyId`);
      /*
        Автоматический вход:
          Когда получим список организаций пользователя, проверим,
          есть ли у пользователя организация, под которой он заходил в последний раз,
          входит ли этот пользователь ещё в эту организацию.

        TODO Если хотим сменить то происходит снова автоматический вход
      */
      // console.log(savedCompany, savedCompany);
      // !!savedCompany &&
      //   companies.some((company) => company === savedCompany) &&
      //   actions.setCompanyID({ companyId: savedCompany, companyName: savedCompany });
    };

    if (userID !== null && companies) {
      getCompanyId();
    }
  }, [userID, companies, actions]);

  const logOut = async () => {
    try {
      const res = await apiService.auth.logout();
      if (res.result) {
        actions.logOut();
        return;
      }
      Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть' }]);
    } catch (error) {
      Alert.alert('Ошибка', 'Нет ответа от сервера', [{ text: 'Закрыть' }]);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>Выбор организации</SubTitle>
        <ScrollView contentContainerStyle={localStyles.scrollContainer} style={localStyles.scroll}>
          <RadioButton.Group onValueChange={(newValue) => setSelectedCompany(newValue)} value={selectedCompany}>
            {companies?.length > 0 &&
              companies.map((el) => {
                return (
                  <TouchableOpacity onPress={() => setSelectedCompany(el)} key={el}>
                    <View style={localStyles.row}>
                      <RadioButton value={el} />
                      <Text>{el}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </RadioButton.Group>
        </ScrollView>
        <View style={localStyles.buttonView}>
          <Button
            mode="contained"
            icon="location-enter"
            style={[styles.rectangularButton, localStyles.button]}
            disabled={companies === undefined || companies.length === 0 || !selectedCompany}
            onPress={async () => {
              actions.setCompanyID({ companyId: selectedCompany, companyName: selectedCompany });
              await appStorage.setItem(`${userID}/companyId`, selectedCompany);
            }}
          >
            Войти
          </Button>
        </View>
      </View>
      <View style={styles.bottomButtons}>
        <IconButton
          icon="account"
          size={30}
          onPress={logOut}
          style={{
            ...styles.circularButton,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
          color={colors.background}
        />
      </View>
    </>
  );
};

export { CompaniesScreen };

const localStyles = StyleSheet.create({
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonView: {
    flexDirection: 'row',
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 10,
  },
  scroll: {
    marginVertical: 10,
    maxHeight: 200,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    padding: 10,
  },
});
