/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react-native/no-inline-styles */
import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Vibration,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useAppStore } from '../../../../store';

const ONE_SECOND_IN_MS = 1000;

interface IProps {
  onSave: (data: string) => void;
  onCancel: () => void;
};

const ScanDataMatrixReader = ({ onSave, onCancel }: IProps) => {
  const { colors } = useTheme();
  const [scanned, setScanned] = useState(false);
  const { state } = useAppStore();
  const [vibroMode, setVibroMode] = useState(false);

  const ref = useRef<TextInput>(null);

  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
  }, [vibroMode]);

  const handleBarCodeScanned = (data: string) => {
    vibroMode && Vibration.vibrate(ONE_SECOND_IN_MS);
    setScanned(true);
    setBarcode(data);
  };

  useEffect(() => {
    if (!scanned && ref?.current) {
      ref.current.focus();
      ref.current.clear();
    }
  }, [scanned, ref]);

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
            onPress={onCancel}
          />
          <IconButton
            icon={vibroMode ? 'vibrate' : 'vibrate-off'}
            color={'#FFF'}
            style={localStyles.transparent}
            onPress={() => setVibroMode(!vibroMode)}
          />
        </View>
        {!scanned ? (
          <View style={[localStyles.scannerContainer, { alignItems: 'center' }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <TextInput
                style={{ width: 0 }}
                autoFocus={true}
                ref={ref}
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
            {scanned && barcode && (
              <View style={localStyles.buttonsContainer}>
                <TouchableOpacity
                  style={[localStyles.buttons, { backgroundColor: '#4380D3' }]}
                  onPress={() => {
                    onSave(barcode);
                  }}
                >
                  <IconButton icon={'checkbox-marked-circle-outline'} color={'#FFF'} size={30} />
                  <View style={localStyles.goodInfo}>
                    <Text style={localStyles.barcode}>{barcode}</Text>
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

export { ScanDataMatrixReader };

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
    // paddingTop: StatusBar.currentHeight ?? 0,
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
