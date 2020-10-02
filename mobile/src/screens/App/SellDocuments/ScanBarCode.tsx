import { useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { ISellLine, ISellDocument, IWeighedGoods } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const ScanBarCodeScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ScanBarCodeScreen'>>();
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { state, actions } = useAppStore();
  const navigation = useNavigation();

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  const editLineDocument = (weighedGood: IWeighedGoods) => {
    const document = state.documents.find((item) => item.id === route.params.docId);
    const editLine = (document as ISellDocument)?.lines.find(
      (item) => item.numreceive === weighedGood.numreceive && item.goodId === weighedGood.goodkey,
    );
    const good = state.goods.find((item) => item.id === weighedGood.goodkey);
    if (editLine) {
      actions.editLine({
        docId: route.params.docId,
        line: {
          ...editLine,
          quantity: Number(good ? weighedGood.weight / good.itemWeight : 0) + Number(editLine.quantity),
        } as ISellLine,
      });
    } else {
      const date = weighedGood.datework.split('.').reverse();
      actions.addLine({
        docId: route.params.docId,
        line: {
          id: '0',
          goodId: weighedGood.goodkey,
          tara: [],
          manufacturingDate: new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]) + 1)
            .toISOString()
            .slice(0, 10),
          quantity: good ? weighedGood.weight / good.itemWeight : 0,
          orderQuantity: 0,
          numreceive: weighedGood.numreceive,
          timework: weighedGood.timework,
        } as ISellLine,
      });
    }
  };

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    Alert.alert('Сохранить результат?', data, [
      {
        text: 'Да',
        onPress: () => {
          setScanned(false);
          const addGood = findGood(data);
          if (addGood) {
            editLineDocument(addGood);
            navigation.goBack();
          }
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

    const finded = state.weighedGoods.find((good) => Number(good.id) === Number(text.slice(0, -1)));
    if (finded) {
      return finded;
    }

    const findedFullCode = state.weighedGoods.find((good) => Number(good.id) === Number(text));
    if (findedFullCode) {
      return findedFullCode;
    }

    Alert.alert('Предупреждение!', `Запись не найдена с таким кодом: ${text}`, [
      {
        text: 'ОК',
        onPress: () => {
          setScanned(false);
        },
      },
    ]);
    return undefined;
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
          onBarCodeScanned={({ data }) => !scanned && handleBarCodeScanned(data)}
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

export { ScanBarCodeScreen };

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
});
