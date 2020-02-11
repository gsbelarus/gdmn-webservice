import React from 'react';
import { StyleSheet, View, StatusBar, Text} from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

const AddProductToDocPage = (): JSX.Element => {

  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.productId}>Product id = </Text>
      <Text style={styles.productId}>{navigate.getParam('id')}</Text>
      <StatusBar barStyle = "light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFE0FF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
  productId: {
    margin: 15,
    textAlignVertical: 'center',
    color: '#000000',
  }
});

export default AddProductToDocPage;
