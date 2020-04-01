import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Chip, Button } from 'react-native-paper';

import styles from '../../styles/global';
import SubTitle from '../../components/SubTitle';

const CompaniesScreen = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>();

  const { colors } = useTheme();
  const navigation = useNavigation();

  const companies = ['company1', 'company2', 'company3'];

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
                  style={[localeStyles.margin, localeStyles.chip, selectedCompany === item ? { backgroundColor: colors.primary } : {}]}
                  onPress={() => setSelectedCompany(item)}
                  selected={selectedCompany === item}
                  selectedColor={selectedCompany === item ? colors.card : colors.text}
                >
                  {item}
                </Chip>
              ))
            ) : (
              <Text>Не найдено</Text>
            )}
          </ScrollView>
        </View>
        <View style={localeStyles.buttonView}>
          <Button
            mode="contained"
            style={[styles.rectangularButton, localeStyles.button]}
            onPress={() => {
              navigation.navigate('ViewDocument', { docId: 1 });
            }}
          >
            ОК
          </Button>
          <Button
            mode="contained"
            style={[styles.rectangularButton, localeStyles.button, localeStyles.marginRight]}
            onPress={() => {
              navigation.navigate('DocumentsListScreen');
            }}
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
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonView: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
  },
  margin: {
    margin: 2,
  },
  marginRight: {
    marginRight: 10,
  },
  chip: {
    height: 50,
    justifyContent: 'center',
    fontSize: 18,
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
