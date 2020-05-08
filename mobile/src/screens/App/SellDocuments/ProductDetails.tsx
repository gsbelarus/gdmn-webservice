import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import { Text, Button } from 'react-native-paper';

import SubTitle from '../../../components/SubTitle';
import styles from '../../../styles/global';
import { IGood, IDocument } from '../../../../../common';
import { ISellLine, ISellDocument } from '../../../model';
import { useAppStore } from '../../../store';

const ProductDetailScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const product = state.goods.find((item) => item.id === route.params.prodId);
  const document = state.documents.find((item) => item.id === route.params.docId);
  const lineDocuments =  (document instanceof Object && (document as IDocument)) ? 
    (document as IDocument).lines : (document as ISellDocument).lines;
  const lineDocument = lineDocuments.find((line) => line.id === route.params.lineID);
  const [line, setLine] = useState<ISellLine>(undefined);
  const [value, setValue] = useState(1); 

  useEffect(() => {
    if (route.params.modeCor) {
      if (lineDocument) {
        setValue(lineDocument.quantity);
      }
      setLine(lineDocument);
    }
  }, [document.lines, route.params.modeCor, route.params.lineID]);

  return (
    <View
      style={[
        styles.container,
        localeStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>{product.name}</SubTitle>
      <View style={localeStyles.productPriceView}>
        <Text style={localeStyles.fontSize16}>Кол-во по заявке:</Text>
        <Text style={localeStyles.productPrice}>{(lineDocument as ISellLine)?.orderQuantity?? 0}</Text>
      </View>
      <View style={localeStyles.productQuantityView}>
        <Text style={localeStyles.fontSize16}>Количество:</Text>
        <Text style={localeStyles.productQuantity}>{lineDocument?.quantity?? 0}</Text>
      </View>
      <View style={localeStyles.editQuantityView}>
        <Text style={localeStyles.fontSize16}>Изменить количество:</Text>
        <InputSpinner
          returnKeyType="done"
          style={localeStyles.inputSpinner}
          inputStyle={localeStyles.fontSize20}
          value={value}
          max={1000}
          min={0}
          step={1}
          colorLeft={colors.primary}
          colorRight={colors.primary}
          onChange={setValue}
        />
      </View>
      <Button
        onPress={() => {
          if (line !== undefined) {
            actions.editLine({
              docId: route.params.docId,
              lineId: line.id,
              value: route.params.modeCor ? value : value + line.quantity,
            });
          } else {
            actions.addLine({ docId: route.params.docId, line: { id: '0', goodId: product.id, quantity: value } });
          }
        }
        }
        mode="contained"
        style={[styles.rectangularButton, localeStyles.button]}
      >
        Изменить
      </Button>
    </View>
  );
};

export { ProductDetailScreen };

const localeStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 35,
    marginHorizontal: '25%',
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  editQuantityView: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 100,
  },
  fontSize16: {
    fontSize: 16,
  },
  fontSize20: {
    fontSize: 20,
  },
  inputSpinner: {
    marginTop: 5,
    width: 180,
  },
  productName: {
    alignItems: 'center',
    color: '#000000',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 25,
  },
  productPrice: {
    color: '#000000',
    fontSize: 17,
    marginLeft: 5,
    textAlignVertical: 'center',
  },
  productPriceView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 45,
  },
  productQuantity: {
    color: '#000000',
    fontSize: 17,
    marginLeft: 5,
  },
  productQuantityView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 15,
  },
  title: {
    padding: 10,
  },
});
