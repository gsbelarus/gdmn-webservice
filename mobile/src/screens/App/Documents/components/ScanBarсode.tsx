import { useTheme, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { useAppStore } from '../../../../store';
import styles from '../../../../styles/global';

const ScanBarcodeScreen = () => {
  //const route = useRoute<RouteProp<DocumentStackParamList, 'ScanBarcode'>>();
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { state } = useAppStore();
  const navigation = useNavigation();

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    Alert.alert('Сохранить результат?', data, [
      {
        text: 'Да',
        onPress: () => {
          setScanned(false);
          findGood(data);
        },
      },
      {
        text: 'Нет',
        onPress: () => {
          setScanned(false);
        },
      },
    ]);
  };

  const findGood = (text: string) => {
    if (text === '' || Number.isNaN(text) || text.length < 12) {
      return;
    }

    /*   const finded = state.weighedGoods.find((good) => Number(good.id) === Number(text.slice(0, -1)));
    if (finded) {
      //отправляем на заполнение позиции
      navigation.navigate('SellProductDetail', {
        prodId: finded.goodkey,
        docId: route.params.docId,
        modeCor: false,
        weighedGood: finded.id,
      });
      return;
    }

    const findedFullCode = state.weighedGoods.find((good) => Number(good.id) === Number(text));
    if (findedFullCode) {
      //отправляем на заполнение позиции
      navigation.navigate('SellProductDetail', {
        prodId: findedFullCode.goodkey,
        docId: route.params.docId,
        modeCor: false,
        weighedGood: findedFullCode.id,
      });
      return;
    } */

    Alert.alert('Предупреждение!', `Запись не найдена с таким кодом: ${text}`, [
      {
        text: 'ОК',
        onPress: () => {
          setScanned(false);
        },
      },
    ]);
  };

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      {hasPermission === null ? (
        <Text style={styles.title}>Запрос на получение доступа к камере</Text>
      ) : hasPermission === false ? (
        <Text style={styles.title}>Нет доступа к камере</Text>
      ) : undefined}
      <>
        <BarCodeScanner
          onBarCodeScanned={({ data }) => (scanned ? undefined : handleBarCodeScanned(data))}
          style={StyleSheet.absoluteFillObject}
        />
        <Button
          onPress={() => {
            navigation.goBack();
          }}
        >
          Назад
        </Button>
      </>
    </View>
  );
};

export { ScanBarcodeScreen };

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
});
