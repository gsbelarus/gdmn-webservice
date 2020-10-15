/* eslint-disable react-native/no-inline-styles */
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Vibration } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { IGood, IReference } from '../../../../../../common';
import { useAppStore } from '../../../../store';
import styles from '../../../../styles/global';

const ONE_SECOND_IN_MS = 1000;

const ScanBarcodeScreen2 = () => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  //фонарик: torch - включен, off - выключен
  const [flashMode, setFlashMode] = useState(false);
  const [visible, setVisible] = React.useState(true);
  const [scanned, setScanned] = useState(false);
  const { state, actions } = useAppStore();
  const navigation = useNavigation();

  const [barcode, setBarcode] = useState('');
  const [good, setGood] = useState<IGood>(undefined);

  useEffect(() => {
    const permission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    permission();
  }, []);

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setGood(undefined);
      return;
    }

    Vibration.vibrate(10 * ONE_SECOND_IN_MS);

    const goodObj = ((state.references?.goods as unknown) as IReference<IGood>)?.data?.find(
      (item) => item.barcode === barcode,
    );

    setGood(goodObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcode, scanned, state.references?.goods]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text style={styles.title}>Нет доступа к камере</Text>;
  }

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <Camera
        flashMode={flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
        }}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={false}
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
          <View style={[localStyles.scannerContainer, { alignItems: 'center' }]}>
            <View
              style={{
                width: '70%',
                height: '50%',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
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
          <View style={localStyles.scannerContainer}>
            <View style={localStyles.buttonsContainer}>
              <TouchableOpacity
                style={[localStyles.buttons, { backgroundColor: '#FFCA00' }]}
                onPress={() => setScanned(false)}
              >
                <IconButton icon={'barcode-scan'} color={'#FFF'} size={30} />
                <Text style={localStyles.text}>Пересканировать</Text>
              </TouchableOpacity>
            </View>
            {scanned && !good && (
              <View style={localStyles.infoContainer}>
                <View style={[localStyles.buttons, { backgroundColor: '#CC3C4D' }]}>
                  <IconButton icon={'information-outline'} color={'#FFF'} size={30} />
                  <View>
                    <Text style={localStyles.text}>{barcode}</Text>
                    <Text style={localStyles.text}>{'Товар не найден'}</Text>
                  </View>
                </View>
              </View>
            )}
            {scanned && good && (
              <View style={localStyles.buttonsContainer}>
                <TouchableOpacity
                  style={[localStyles.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => navigation.goBack()}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  {/* <Text style={localStyles.text}>Выбрать</Text> */}
                  <Text style={localStyles.text}>{good?.name}</Text>
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
