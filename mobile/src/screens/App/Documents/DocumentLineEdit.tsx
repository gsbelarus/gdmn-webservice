import { useTheme, useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useCallback, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Keyboard, SafeAreaView, ScrollView, View, Modal } from 'react-native';
import { TextInput, Text, Colors, Button } from 'react-native-paper';

import { IDocument, IGood, ILine } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { formatValue } from '../../../helpers/utils';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';
import { ScanDataMatrix } from './components/ScanDataMatrix';
import { ScanDataMatrixReader } from './components/ScanDataMatrixReader';

type Props = StackScreenProps<RootStackParamList, 'DocumentLineEdit'>;

const DocumentLineEditScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const { docId, lineId, prodId, price, remains, quantity } = route.params;

  const [document] = useState<IDocument | undefined>( () => state.documents?.find((item) => item.id === docId) );
  const [line, setLine] = useState<ILine | undefined>(undefined);

  const [goodQty, setGoodQty] = useState<string>('1');

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();

  const [doScanned, setDoScanned] = useState(false);
  const [EID, setEID] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (line) {
      setLine({ ...line, quantity: parseFloat(goodQty) });
    }
  }, [goodQty]);

  useEffect(() => {
    if (line) {
      setLine({ ...line, EID });
    }
  }, [EID]);

  const good = useMemo(() => {
    return ((state.references?.goods?.data as unknown) as IGood[])?.find((item) => item.id === prodId);
  }, [prodId, state.references?.goods?.data]);

  const docLine: ILine | undefined = useMemo(() => document?.lines.find((item) => item.id === lineId), [lineId]);

  useEffect(() => {
    setLine({
      goodId: docLine?.goodId || prodId,
      id: docLine?.id || 1,
      quantity: docLine?.quantity ?? quantity ?? 1,
      price: docLine?.price ?? price,
      remains: docLine?.remains ?? remains,
      EID: docLine?.EID ?? EID,
    });

    setGoodQty((docLine?.quantity ?? quantity ?? 1).toString());
    setEID(docLine?.EID ?? EID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodId, document?.lines, lineId, price, remains]);

  const handelQuantityChange = useCallback((value: string) => {
    setGoodQty((prev) => {
      value = value.replace(',', '.');

      value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      return validNumber.test(value) ? value : prev;
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }
    return;
  }, [isFocused]);

  const handleSave = useCallback(() => {
    if (lineId) {
      actions.editLine({
        docId,
        line,
      });
    } else {
      actions.addLine({
        docId,
        line,
      });
    }
    navigation.navigate('DocumentView', { docId });
  }, [actions, line, lineId, docId]);

  const handleCancel = useCallback(() => {
    navigation.navigate('DocumentView', { docId });
  }, [navigation, docId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => <HeaderRight text="Отмена" onPress={handleCancel} />,
      headerRight: () => <HeaderRight text="Готово" onPress={handleSave} />,
    });
  }, [navigation, handleCancel, handleSave]);

  const handleEIDScanned = useCallback((data: string) => {
    setDoScanned(false);
    setEID(data);
  }, []);

  const currRef = useRef<any>(null);

  useEffect(() => {
    currRef?.current && setTimeout(() => currRef.current?.focus(), 1000);
  }, []);

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <Modal animationType="slide" visible={doScanned}>
        {state.settings?.barcodeReader ? (
          <ScanDataMatrixReader onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        ) : (
          <ScanDataMatrix onSave={(data) => handleEIDScanned(data)} onCancel={() => setDoScanned(false)} />
        )}
      </Modal>
      <SafeAreaView>
        <ScrollView>
          <View
            style={[
              styles.container,
              localStyles.container,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <SubTitle style={[localStyles.title, { backgroundColor: colors.background }]}>
              {good?.name || 'Товар не найден'}
            </SubTitle>
            <View style={localStyles.item}>
              <Text style={localStyles.label}>Цена</Text>
              <View>
                <Text style={localStyles.text}>{formatValue({ type: 'number', decimals: 2 }, line?.price ?? 0)}</Text>
              </View>
            </View>
            <ItemSeparator />
            <View style={localStyles.item}>
              <Text style={localStyles.label}>Остаток</Text>
              <View>
                <Text style={localStyles.text}>{line?.remains ?? 0}</Text>
              </View>
            </View>
            <ItemSeparator />
            <View style={localStyles.item}>
              <Text style={localStyles.label}>EID</Text>
              <View style={localStyles.flexDirectionRow}>
                <View
                  style={[
                    localStyles.flexGrow,
                    {
                      backgroundColor: colors.card,
                      alignSelf: 'center',
                      width: '90%',
                    },
                  ]}
                >
                  <Text style={localStyles.text}>{line?.EID || 'Не указан'}</Text>
                </View>
              </View>
            </View>
            <ItemSeparator />
            <TextInput
              mode={'flat'}
              label={'Количество'}
              editable={true}
              keyboardType="decimal-pad"
              onChangeText={handelQuantityChange}
              returnKeyType="done"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={isFocused}
              value={goodQty}
              ref={currRef}
              theme={{
                colors: {
                  placeholder: colors.primary,
                },
              }}
              style={{
                backgroundColor: colors.card,
              }}
            />
            <View style={localStyles.buttonView}>
              <Button
                mode="contained"
                icon="barcode-scan"
                style={[styles.rectangularButton, localStyles.button]}
                onPress={() => setDoScanned(true)}
              >
                Сканировать EID
              </Button>
              <Button
                mode="contained"
                icon="delete"
                style={[styles.rectangularButton, localStyles.button]}
                disabled={!line?.EID}
                onPress={() => setEID(undefined)}
              >
                Очистить EID
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export { DocumentLineEditScreen };

const localStyles = StyleSheet.create({
  button: {
    width: '100%',
  },
  buttonView: {
    flexDirection: 'column',
    padding: 10,
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  content: {
    height: '100%',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
  },
  item: {
    marginHorizontal: 8,
    marginVertical: 8,
  },
  label: {
    color: Colors.blue600,
    fontSize: 12,
  },
  text: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    padding: 10,
  },
});
