import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Chip, Button } from 'react-native-paper';

import SubTitle from '../../components/SubTitle';
import { useAuthStore, useServiceStore } from '../../store';
import styles from '../../styles/global';

const CompaniesScreen = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>();
  const [companies, setCompanies] = useState<string[]>([]);

  const { colors } = useTheme();
  const { apiService } = useServiceStore();
  const { actions } = useAuthStore();

  useEffect(() => {
    const request = async () => {
      const response = await apiService.auth.getUserStatus();
      if (response.result) {
        setCompanies(response.data.companies || []);
      }
    };
    request();
  }, [apiService.auth]);

  const logOut = async () => {
    const res = await apiService.auth.logout();
    if (res.result) {
      actions.logOut();
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
            style={[styles.rectangularButton, localeStyles.button]}
            disabled={companies === undefined || companies.length === 0 || !selectedCompany}
            onPress={() => {
              actions.setCompanyID(selectedCompany);
            }}
          >
            ОК
          </Button>
          <Button
            mode="contained"
            style={[styles.rectangularButton, localeStyles.button, localeStyles.marginRight]}
            onPress={logOut}
          >
            Выход
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
    fontSize: 18,
    height: 50,
    justifyContent: 'center',
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
