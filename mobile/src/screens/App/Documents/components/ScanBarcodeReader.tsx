/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react-native/no-inline-styles */
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { IGood } from '../../../../../../common';
import { IContact, IMGoodData, IMGoodRemain, IRem, IRemains, IWeightCodeSettings } from '../../../../../../common/base';
import { getRemGoodByContact } from '../../../../helpers/utils';
import { RootStackParamList } from '../../../../navigation/AppNavigator';
import { useAppStore } from '../../../../store';
import styles from '../../../../styles/global';

const ONE_SECOND_IN_MS = 1000;

type Props = StackScreenProps<RootStackParamList, 'ScanBarcodeReader'>;

type ScannedObject = IRem & { quantity: number, isWeightGood: boolean };

const ScanBarcodeReaderScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const [scanned, setScanned] = useState(false);
  const { state } = useAppStore();
  const [vibroMode, setVibroMode] = useState(false);

  const ref = useRef<TextInput>(null);

  const [barcode, setBarcode] = useState('');
  const [goodItem, setGoodItem] = useState<ScannedObject | undefined>(undefined);

  const docId = route.params?.docId;

  const document = useMemo(() => state.documents?.find((item: { id: number }) => item.id === docId), [
    docId,
    state.documents,
  ]);

  const weightCodeSettings = useMemo(() => (state.companySettings?.weightSettings as unknown) as IWeightCodeSettings, [
    state.companySettings?.weightSettings,
  ]);

  const goodRemains: IMGoodData<IMGoodRemain> = useMemo(() => {
    if (!document?.head?.fromcontactId) {
      return {};
    }

    const goodRem: IMGoodData<IMGoodRemain> = getRemGoodByContact(
      state.references?.contacts?.data as IContact[],
      state.references?.goods?.data as IGood[],
      (state.references?.remains?.data as unknown) as IRemains[],
      document.head.fromcontactId
    );

    return goodRem;
  }, [state.references?.contacts?.data, state.references?.goods?.data, state.references?.remains?.data, document?.head?.fromcontactId]);

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    if (!scanned && ref?.current) {
      ref.current.focus();
      ref.current.clear();
    }
  }, [scanned, ref]);

  useEffect(() => {
    if (!scanned) {
      return;
    }

    if (!barcode && scanned) {
      setGoodItem(undefined);
      return;
    }

    const getScannedObject = (brc: string): ScannedObject | undefined => {
      let charFrom = 0;

      let charTo = weightCodeSettings?.weightCode.length;

      if (brc.substring(charFrom, charTo) !== weightCodeSettings?.weightCode) {
        const remItem = goodRemains[brc];

        if (!remItem) {
          return;
        }

        return {
          ...remItem.good,
          price: remItem.remains ? remItem.remains[0].price : 0,
          remains: remItem.remains ? remItem.remains[0].q : 0,
          quantity: 1,
          isWeightGood: false,
        };
      }

      charFrom = charTo;
      charTo = charFrom + weightCodeSettings?.code;
      const code = Number(brc.substring(charFrom, charTo)).toString();

      charFrom = charTo;
      charTo = charFrom + weightCodeSettings?.weight;

      const qty = Number(brc.substring(charFrom, charTo)) / 1000;

      const remItem = Object.values(goodRemains)?.find((item: IMGoodRemain) => item.good.weightCode === code);

      if (!remItem) {
        return;
      }

      return {
        ...remItem.good,
        price: remItem.remains?.length ? remItem.remains[0].price : 0,
        remains: remItem.remains?.length ? remItem.remains[0].q : 0,
        quantity: qty,
        isWeightGood: true,
      };
    };

    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);

    const scannedObj: ScannedObject | undefined = getScannedObject(barcode);

    setGoodItem(scannedObj);
  }, [
    barcode,
    scanned,
    vibroMode,
    weightCodeSettings?.weightCode,
    weightCodeSettings?.code,
    weightCodeSettings?.weight,
    goodRemains,
  ]);

  if (!document) {
    return <Text style={styles.title}>Документ не найден</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[localStyles.content, { backgroundColor: colors.card }]}
    >
      {/* <View > */}
      <View style={localStyles.camera}>
        <View style={localStyles.header}>
          <IconButton
            icon="arrow-left"
            color={'#FFF'}
            size={30}
            style={localStyles.transparent}
            onPress={() => navigation.goBack()}
          />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={localStyles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
          <IconButton
            icon={'feature-search-outline'}
            color={'#FFF'}
            style={localStyles.transparent}
            onPress={() => navigation.navigate('RemainsList', { docId: document.id })}
          />
        </View>
        {!scanned ? (
          <View style={[localStyles.scannerContainer, { alignItems: 'center' }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={{ width: 0 }}
                autoFocus={true}
                ref={ref}
                // onFocus={() => Keyboard.dismiss()}
                showSoftInputOnFocus={false}
                onChangeText={(text) => handleBarCodeScanned(text)}
              />
            </TouchableWithoutFeedback>
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
            {scanned && !goodItem && (
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
            {scanned && goodItem && (
              <View style={localStyles.buttonsContainer}>
                <TouchableOpacity
                  style={[localStyles.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    navigation.navigate('DocumentLineEdit', {
                      prodId: goodItem.id,
                      docId,
                      price: goodItem.price,
                      remains: goodItem.remains,
                      quantity: goodItem.quantity,
                    });
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={localStyles.goodInfo}>
                    <Text style={localStyles.goodName} numberOfLines={3}>
                      {goodItem?.name}
                    </Text>
                    <Text style={localStyles.barcode}>{goodItem?.barcode}</Text>
                    <Text style={localStyles.barcode}>
                      цена: {goodItem?.price || 0} р., остаток: {goodItem?.remains}
                    </Text>
                     {goodItem.isWeightGood && <Text style={localStyles.barcode}>количество: {goodItem?.quantity}</Text>}
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {!scanned && (
          <View style={localStyles.footer}>
            <>
              <IconButton icon={'barcode-scan'} color={'#FFF'} size={40} />
              <Text style={localStyles.text}>Отсканируйте штрихкод</Text>
            </>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export { ScanBarcodeReaderScreen };

const localStyles = StyleSheet.create({
  barcode: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.5,
  },
  buttons: {
    alignItems: 'center',
    borderRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 100,
  },
  buttonsContainer: {
    margin: 10,
  },
  camera: {
    flex: 1,
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#0008',
    height: 100,
    justifyContent: 'center',
  },
  goodInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  goodName: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  header: {
    alignItems: 'center',
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
  },
  scannerContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#000',
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
