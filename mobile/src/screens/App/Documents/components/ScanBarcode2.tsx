/* eslint-disable react-native/no-inline-styles */
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { IGood, IReference } from '../../../../../../common';
import { DocumentStackParamList } from '../../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../../store';
import styles from '../../../../styles/global';

const ScanBarcodeScreen2 = () => {
  const route = useRoute<RouteProp<DocumentStackParamList, 'ScanBarcode2'>>();
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  //фонарик: torch - включен, off - выключен
  const [flashMode, setFlashMode] = useState(false);
  const [visible, setVisible] = React.useState(true);
  const onDismissSnackBar = () => setVisible(false);
  const [scanned, setScanned] = useState(false);
  const { state, actions } = useAppStore();
  const navigation = useNavigation();

  const [barcode, setBarcode] = useState('');
  const [goodName, setGoodName] = useState('');

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  /*
  const editLineDocument = (weighedGood: IWeighedGoods) => {
     const document = state.documents.find((item) => item.id === route.params.docId);
    const editLine = (document as ISellDocument)?.lines.find(
      (item) => item.numreceive === weighedGood.numreceive && item.goodId === weighedGood.goodkey,
    );
    const good = state.references?.goods.find((item) => item.id === weighedGood.goodkey);
    if (editLine) {
      actions.editLine({
        docId: route.params?.docId,
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
  */

  const handleBarCodeScanned = (data: string) => {
    console.log('data', data);
    setScanned(true);
    setBarcode(data);
    // Alert.alert('Сохранить результат?', data, [
    //   {
    //     text: 'Да',
    //     onPress: () => {
    //       setScanned(false);
    //       const addGood = findGood(data);
    //       if (addGood) {
    //         // editLineDocument(addGood);
    //         navigation.goBack();
    //       }
    //     },
    //   },
    //   {
    //     text: 'Нет',
    //     onPress: () => {
    //       setScanned(false);
    //     },
    //   },
    // ]);
  };

  useEffect(() => {
    if (!barcode) {
      setGoodName('');
      return;
    }

    const goodObj = ((state.references?.goods as unknown) as IReference<IGood>)?.data?.find(
      (item) => item.barcode === barcode,
    );

    setGoodName(goodObj ? goodObj.name : 'не найден');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcode, state.references?.goods]);

  /*   const findGood = (text: string) => {
    if (text === '' || Number.isNaN(text) || text.length < 12) {
      return;
    }

    const finded = state.references?.goods?.data?.find((good) => Number(good.id) === Number(text.slice(0, -1)));
    if (finded) {
      return finded;
    }
    /*
    const findedFullCode = state.weighedGoods.find((good) => Number(good.id) === Number(text));
    if (findedFullCode) {
      return findedFullCode;
    } */
  /*
    Alert.alert('Предупреждение!', `Запись не найдена с таким кодом: ${text}`, [
      {
        text: 'ОК',
        onPress: () => {
          setScanned(false);
        },
      },
    ]);
    return undefined;
  }; */

  return (
    // <SafeAreaView>
    <View style={[localStyles.content, { backgroundColor: colors.card, paddingTop: StatusBar.currentHeight ?? 0 }]}>
      {hasPermission === null ? (
        <Text style={styles.title}>Запрос на получение доступа к камере</Text>
      ) : hasPermission === false ? (
        <Text style={styles.title}>Нет доступа к камере</Text>
      ) : undefined}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0008', padding: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'transparent',
          }}
          onPress={() => navigation.goBack()}
        >
          <Feather name={'arrow-left'} color={'#FFF'} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'transparent',
          }}
          onPress={() => setFlashMode(!flashMode)}
        >
          <MaterialCommunityIcons
            name={flashMode ? 'flashlight' : 'flashlight-off'}
            color={flashMode ? '#FF8' : '#FFF'}
            size={30}
          />
        </TouchableOpacity>
      </View>
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
        }}
        whiteBalance="auto"
        onBarCodeScanned={({ data }: { data: string }) => !scanned && handleBarCodeScanned(data)}
        style={localStyles.camera}
      >
        {!scanned ? (
          <View style={[styles.container, { alignItems: 'center' }]}>
            <View style={{ width: '75%', height: '50%', flexDirection: 'column', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[localStyles.border, localStyles.borderTop, localStyles.borderLeft]} />
                <View style={[localStyles.border, localStyles.borderTop, localStyles.borderRight]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[localStyles.border, localStyles.borderBottom, localStyles.borderLeft]} />
                <View style={[localStyles.border, localStyles.borderBottom, localStyles.borderRight]} />
              </View>
            </View>
          </View>
        ) : (
          <View style={localStyles.scanResultContainer}>
            <TouchableOpacity style={localStyles.rescanButton} onPress={() => setScanned(false)}>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
              <Text style={localStyles.button}>Пересканировать</Text>
            </TouchableOpacity>

            {!goodName && (
              <TouchableOpacity style={localStyles.selectButton} onPress={() => navigation.goBack()}>
                <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                <Text style={localStyles.button}>Выбрать</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Camera>
      <View style={[localStyles.textContainer, { backgroundColor: colors.text }]}>
        {!scanned ? (
          <>
            {/* <Image source={scan} style={{ width: 60, height: 60, tintColor: '#fff' }} /> */}
            <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
            <Text style={localStyles.text}>Наведите рамку на штрихкод</Text>
          </>
        ) : (
          <>
            <Text style={localStyles.text}>{`Штрихкод: ${barcode || ''}`}</Text>
            <Text style={localStyles.text}>{`Товар: ${goodName || ''}`}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export { ScanBarcodeScreen2 };

const localStyles = StyleSheet.create({
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
  button: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  rescanButton: {
    backgroundColor: '#CC3C4D',
    borderRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  scanResultContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
  selectButton: {
    backgroundColor: '#FAC',
    borderRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  textContainer: {
    alignItems: 'center',
    bottom: 0,
    height: 100,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    width: '100%',
  },
});
