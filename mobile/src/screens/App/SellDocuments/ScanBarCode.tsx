import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { IGood } from '../../../../../common';
import { ISellDocument, ISellLine, IWeighedGoods } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

const ScanBarCodeScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ScanBarCodeScreen'>>();
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  //фонарик: torch - включен, off - выключен
  const [flashMode, setFlashMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { state, actions } = useAppStore();
  const navigation = useNavigation();

  const [document, setDocument] = useState<ISellDocument>(undefined);
  const [error, setError] = useState<string>(undefined);
  const [barcode, setBarcode] = useState('');
  const [weighedGood, setWeighedGood] = useState<IWeighedGoods>(undefined);
  const [good, setGood] = useState<IGood>(undefined);

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  useEffect(() => {
    setDocument(state.documents?.find((item) => item.id === route.params.docId) as ISellDocument);
  }, [route.params.docId, state.documents]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleBarCodeScanned = useCallback((data: string) => {
    setScanned(true);
    setBarcode(data);
  }, []);

  useEffect(() => {
    if (!scanned) {
      setBarcode('');
    }
  }, [scanned]);

  const findGood = useCallback(() => {
    if (barcode === '' || Number.isNaN(barcode) || barcode.length < 12) {
      setError('Неверный штрих-код');
      return;
    }

    const finded = state.weighedGoods.find((item) => Number(item.id) === Number(barcode.slice(0, -1)));
    if (finded) {
      return finded;
    }

    const findedFullCode = state.weighedGoods.find((item) => Number(item.id) === Number(barcode));
    if (findedFullCode) {
      return findedFullCode;
    }

    setError('Товар не найден');
    return undefined;
  }, [barcode, state.weighedGoods]);

  useEffect(() => {
    if (!weighedGood) {
      setGood(undefined);
      return;
    }

    const goodObj = ((state.goods as unknown) as IGood[])?.find((item) => item.id === weighedGood.goodkey);
    setGood(goodObj);
  }, [weighedGood]);

  useEffect(() => {
    if (!barcode) {
      setWeighedGood(undefined);
      return;
    }

    const done = document?.lines
      ?.reduce((prev, curr) => {
        return prev.concat(curr.barcodes ?? []);
      }, [] as string[])
      .find((item) => item === barcode);

    if (done) {
      setError('Ранее был считан');
      return;
    }

    const weighedGoodObj = findGood();

    setWeighedGood(weighedGoodObj);
  }, [barcode, findGood]);

  const editLineDocument = useCallback(() => {
    if (!weighedGood) {
      return;
    }

    const editLine = document?.lines?.find(
      (item) => item.numreceive === weighedGood.numreceive && item.goodId === weighedGood.goodkey,
    );
    if (editLine) {
      actions.editLine({
        docId: route.params.docId,
        line: {
          ...editLine,
          quantity: Number(good ? weighedGood.weight / good.itemWeight : 0) + Number(editLine.quantity),
          barcodes: (editLine.barcodes ?? []).concat([barcode]),
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
          barcodes: [barcode],
          //timework: weighedGood.timework,
        } as ISellLine,
      });
    }
  }, [actions, barcode, good, route.params.docId, weighedGood]);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      {hasPermission === null ? (
        <Text style={styles.title}>Запрос на получение доступа к камере</Text>
      ) : hasPermission === false ? (
        <Text style={styles.title}>Нет доступа к камере</Text>
      ) : undefined}
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
        }}
        whiteBalance="auto"
        onBarCodeScanned={({ data }: { data: string }) => !scanned && handleBarCodeScanned(data)}
        style={localStyles.camera}
      >
        <View style={localStyles.header}>
          <TouchableOpacity style={localStyles.transparent} onPress={() => navigation.goBack()}>
            <Feather name={'arrow-left'} color={'#FFF'} size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.transparent} onPress={() => setFlashMode(!flashMode)}>
            <MaterialCommunityIcons
              name={flashMode ? 'flashlight' : 'flashlight-off'}
              color={flashMode ? '#FF8' : '#FFF'}
              size={30}
            />
          </TouchableOpacity>
        </View>
        {!scanned ? (
          <View style={[localStyles.scannerContainer, localStyles.alignItemsCenter]}>
            <View style={localStyles.areaScan}>
              <View style={localStyles.flexRow}>
                <View style={[localStyles.border, localStyles.borderTop, localStyles.borderLeft]} />
                <View style={[localStyles.border, localStyles.borderTop, localStyles.borderRight]} />
              </View>
              <View style={localStyles.flexRow}>
                <View style={[localStyles.border, localStyles.borderBottom, localStyles.borderLeft]} />
                <View style={[localStyles.border, localStyles.borderBottom, localStyles.borderRight]} />
              </View>
            </View>
          </View>
        ) : (
          <View style={localStyles.scannerContainer}>
            <View style={localStyles.buttonsContainer}>
              <TouchableOpacity
                style={[localStyles.buttons, localStyles.backgroundColorYellow]}
                onPress={() => {
                  setScanned(false);
                  setError(undefined);
                }}
              >
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={localStyles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && (!good || error) && (
              <View style={localStyles.infoContainer}>
                <View style={[localStyles.buttons, localStyles.backgroundColorRed]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={localStyles.text}>{barcode}</Text>
                    <Text style={localStyles.text}>{error ?? 'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && good && (
              <View style={localStyles.buttonsContainer}>
                <TouchableOpacity
                  style={[localStyles.buttons, localStyles.backgroundColorBlue]}
                  onPress={() => {
                    editLineDocument();
                    navigation.goBack();
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  {/* <Text style={localStyles.text}>Выбрать</Text> */}
                  <Text style={localStyles.text}>{good.name}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={localStyles.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={localStyles.text}>Наведите рамку на штрихкод</Text>
            </>
          </View>
        )}
      </Camera>
    </View>
  );
};

export { ScanBarCodeScreen };

const localStyles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  areaScan: {
    flexDirection: 'column',
    height: '50%',
    justifyContent: 'space-between',
    width: '70%',
  },
  backgroundColorBlue: {
    backgroundColor: '#4380D3',
  },
  backgroundColorRed: {
    backgroundColor: '#CC3C4D',
  },
  backgroundColorYellow: {
    backgroundColor: '#FFCA00',
  },
  border: {
    height: 50,
    width: 50,
  },
  borderBottom: {
    borderBottomColor: '#FF8',
    borderBottomWidth: 2,
  },
  borderLeft: {
    borderLeftColor: '#FF8',
    borderLeftWidth: 2,
  },
  borderRight: {
    borderRightColor: '#FF8',
    borderRightWidth: 2,
  },
  borderTop: {
    borderTopColor: '#FF8',
    borderTopWidth: 2,
  },
  buttons: {
    alignItems: 'center',
    borderRadius: 10,
    elevation: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonsContainer: {
    height: 100,
    padding: 10,
  },
  camera: {
    flex: 1,
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: StatusBar.currentHeight ?? 0,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#0008',
    height: 100,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#0008',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  infoContainer: {
    height: 100,
    padding: 10,
    // justifyContent: 'center',
  },
  scannerContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});
