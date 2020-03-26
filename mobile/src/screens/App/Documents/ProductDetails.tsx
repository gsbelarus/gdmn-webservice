import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, Button } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import InputSpinner from "react-native-input-spinner";

import SubTitle from "../../../components/SubTitle";
import styles from "../../../styles/global";
import products from "../../../mockData/Goods.json";
import remains from "../../../mockData/Remains.json";

const ProductDetailScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const product = products.find(item => item.id === route.params.prodId);
  const remain = remains.find(item => item.goodId === route.params.prodId);
  const [value, setValue] = useState(1);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          padding: 0,
          justifyContent: "flex-start"
        }
      ]}
    >
      <SubTitle
        styles={[localeStyles.title, { backgroundColor: colors.background }]}
      >
        {product.name}
      </SubTitle>
      <View style={localeStyles.productPriceView}>
        <Text style={{ fontSize: 17 }}>Цена:</Text>
        <Text style={localeStyles.productPrice}>{remain.price}</Text>
      </View>
      <View style={localeStyles.productQuantityView}>
        <Text style={{ fontSize: 16 }}>Количество:</Text>
        <Text style={localeStyles.productQuantity}>{remain.quantity}</Text>
      </View>
      <View style={localeStyles.editQuantityView}>
        <Text style={{ fontSize: 16 }}>Добавить количество:</Text>
        <InputSpinner
          returnKeyType="done"
          style={localeStyles.inputSpinner}
          inputStyle={{ fontSize: 20 }}
          value={value}
          max={1000}
          min={1}
          step={1}
          colorLeft={colors.primary}
          colorRight={colors.primary}
          onChange={setValue}
          onMin={() => {
            Alert.alert("Предупреждение", "Минимальное значение уже выбрано!");
          }}
        />
      </View>
      <Button
        onPress={() => navigation.goBack()}
        style={{
          ...styles.rectangularButton,
          height: 35,
          alignItems: "center"
        }}
      >
        Отправить
      </Button>
    </View>
  );
};

export { ProductDetailScreen };

const localeStyles = StyleSheet.create({
  title: {
    padding: 10
  },
  inputSpinner: {
    marginTop: 5,
    width: 180
  },
  productName: {
    marginTop: 25,
    color: "#000000",
    fontWeight: "bold",
    fontSize: 19,
    alignItems: "center"
  },
  productPriceView: {
    marginLeft: 15,
    marginTop: 45,
    flexDirection: "row"
  },
  productPrice: {
    marginLeft: 5,
    textAlignVertical: "center",
    color: "#000000",
    fontSize: 17
  },
  productQuantityView: {
    marginLeft: 15,
    marginTop: 15,
    flexDirection: "row"
  },
  productQuantity: {
    marginLeft: 5,
    color: "#000000",
    fontSize: 17
  },
  editQuantityView: {
    marginLeft: 15,
    marginTop: 100,
    flexDirection: "column",
    alignItems: "center"
  }
});
