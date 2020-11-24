import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Chip, Button } from 'react-native-paper';

import SubTitle from '../../components/SubTitle';
import { appStorage } from '../../helpers/utils';
import { useAuthStore, useServiceStore } from '../../store';
import styles from '../../styles/global';

const CompaniesScreen = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>();
  const [companies, setCompanies] = useState<string[]>([]);

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
        setCompanies(response.data.companies || []);
      }
    };
    request();
  }, [apiService.auth]);

  useEffect(() => {
    const getCompanyId = async () => {
      const savedCompany = await appStorage.getItem(`${userID}/companyId`);

      /*
        Автоматический вход:
          Когда получим список организаций пользователя, проверим,
          есть ли у пользователя организация, под которой он заходил в последний раз,
          входит ли этот пользователь ещё в эту организацию.

        TODO Если хотим сменить то происходит снова автоматический вход
      */
      // console.log(savedCompany, savedCompany);
      !!savedCompany &&
        companies.some((company) => company === savedCompany) &&
        actions.setCompanyID({ companyId: savedCompany, companyName: savedCompany });
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
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Организации</SubTitle>
      <View style={localeStyles.container}>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
          <Text style={localeStyles.subdivisionText}>Выберите организацию: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {companies && companies.length !== 0 ? (
              companies.map((item, idx) => (
                <Chip
                  key={idx}
                  mode="outlined"
                  style={[
                    localeStyles.margin,
                    localeStyles.chip,
                    selectedCompany === item ? { backgroundColor: colors.primary } : {},
                  ]}
                  onPress={() => setSelectedCompany(item)}
                  selected={selectedCompany === item}
                  selectedColor={selectedCompany === item ? colors.card : colors.text}
                >
                  {item}
                </Chip>
              ))
            ) : (
              <Text>Вы не состоите ни в одной Организации</Text>
            )}
          </ScrollView>
        </View>
        <View style={localeStyles.buttonView}>
          <Button
            mode="contained"
            style={[styles.rectangularButton, localeStyles.button, localeStyles.marginRight]}
            onPress={logOut}
          >
            Выход
          </Button>
          <Button
            mode="contained"
            style={[styles.rectangularButton, localeStyles.button]}
            disabled={companies === undefined || companies.length === 0 || !selectedCompany}
            onPress={async () => {
              actions.setCompanyID({ companyId: selectedCompany, companyName: selectedCompany });
              await appStorage.setItem(`${userID}/companyId`, selectedCompany);
            }}
          >
            ОК
          </Button>
        </View>
      </View>
    </>
  );
};

export { CompaniesScreen };

const localeStyles = StyleSheet.create({
  areaChips: {
    alignItems: 'center',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonView: {
    flexDirection: 'row',
  },
  chip: {
    alignItems: 'center',
    fontSize: 20,
    height: 45,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
  margin: {
    margin: 2,
  },
  marginRight: {
    marginRight: 10,
  },
  scroll: {
    maxHeight: 150,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subdivisionText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
  },
  title: {
    padding: 10,
  },
});
