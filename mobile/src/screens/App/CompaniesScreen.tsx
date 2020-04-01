import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Chip } from 'react-native-paper';

const CompaniesScreen = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>();

  const { colors } = useTheme();

  const companies = ['company1', 'company2', 'company3'];

  return (
    <>
      <View style={localeStyles.container}>
        <View style={[localeStyles.areaChips, { borderColor: colors.border }]} key={1}>
          <Text style={localeStyles.subdivisionText}>Выберите организацию: </Text>
          <ScrollView contentContainerStyle={localeStyles.scrollContainer} style={localeStyles.scroll}>
            {companies && companies.length !== 0 ? (
              companies.map((item, idx) => (
                <Chip
                  key={idx}
                  mode="outlined"
                  style={[localeStyles.margin, selectedCompany === item ? { backgroundColor: colors.primary } : {}]}
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
  },
  button: {
    flex: 1,
    marginLeft: 7,
  },
  buttonDatePicker: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  container: {
    margin: 10,
    // padding: 0,
  },
  containerDate: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
  },
  containerModalDatePicker: {
    borderRadius: 8,
    borderWidth: 1,
    margin: 10,
    paddingVertical: 10,
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
    marginBottom: 5,
    textAlign: 'left',
  },
  textDate: {
    flex: 1,
    flexGrow: 4,
    fontSize: 20,
    textAlign: 'center',
  },
});
