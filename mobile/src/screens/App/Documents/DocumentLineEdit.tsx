import { useTheme, useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Keyboard, SafeAreaView, ScrollView, View } from 'react-native';
import { TextInput, List, Checkbox } from 'react-native-paper';

import { IDocument, IGood, ILine, IRefData, IPackage, IGoodPackage } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { IListItem, IDocumentLineParams } from '../../../model/types';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentLineEdit'>;

const DocumentLineEditScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();
  const { docId, lineId, prodId } = route.params;

  const [goodQty, setGoodQty] = useState<string>('1');

  const { quantity, packagekey } = useMemo(() => {
    return ((state.forms?.documentLineParams as unknown) || {}) as IDocumentLineParams;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.forms?.documentLineParams]);

  const [document, setDocument] = useState<IDocument>(undefined);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();

  const productName = useMemo(() => {
    return (
      ((state.references?.goods?.data as unknown) as IGood[])?.find((item) => item.id === prodId)?.name ||
      'товар не найден'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodId, state.references?.goods?.data]);

  const priceFSN = useMemo(() => {
    return ((state.references?.goods?.data as unknown) as IGood[])?.find((item) => item.id === prodId)?.pricefsn || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodId, state.references?.goods?.data]);

  const packageGoods = useMemo(
    () =>
      (state.references?.packageGoods?.data as IGoodPackage[]).map((item) => {
        if (item.goodkey === prodId) {
          return item.packagekey;
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prodId, state.references?.packageGoods?.data],
  );

  const packageTypes = useMemo(
    () => (state.references?.packageTypes?.data as IPackage[]).filter((item) => packageGoods.includes(item.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [packageGoods, state.references?.packageTypes?.data],
  );

  const updateDocumentLine = useCallback(() => {
    actions.editLine({
      docId,
      line: {
        id: lineId,
        goodId: prodId,
        quantity: quantity || 1,
        packagekey: packagekey || undefined,
      },
    });
    return lineId;
  }, [actions, docId, lineId, prodId, quantity, packagekey]);

  const addDocumentLine = useCallback(() => {
    const id = lineId || 1;
    actions.addLine({
      docId,
      line: {
        id,
        goodId: prodId,
        quantity: quantity || 1,
        packagekey: packagekey || undefined,
      },
    });
    return id;
  }, [actions, docId, lineId, prodId, quantity, packagekey]);

  /*const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);*/

  const getListItems = <T extends IRefData>(con: T[]): IListItem[] =>
    con?.map((item) => ({ id: item.id, value: item.name }));

  const listPackageTypes = useMemo(() => getListItems(packageTypes), [packageTypes]);

  /*const ReferenceItem = useCallback(
    (item: { value: string; onPress: () => void; color?: string; disabled?: boolean }) => {
      return (
        <TouchableOpacity
          {...item}
          onPress={item.disabled ? null : item.onPress}
          style={[localeStyles.picker, { borderColor: colors.border }]}
        >
          <Text style={[localeStyles.pickerText, { color: colors.text }]}>{item.value || 'не выбрано'}</Text>
          {!item.disabled && <MaterialCommunityIcons name="menu-right" size={30} color={colors.primary} />}
        </TouchableOpacity>
      );
    },
    [colors.border, colors.primary, colors.text],
  );*/

  useEffect(() => {
    actions.setForm({ ...state.forms?.documentLineParams, quantity: goodQty });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, goodQty]);

  useEffect(() => {
    setDocument(state.documents.find((item) => item.id === docId));
  }, [state.documents, docId]);

  useEffect(() => {
    if (state.forms?.documentLineParams) {
      return;
    }
    const docLine =
      lineId !== undefined &&
      (state.documents.find((item) => item.id === docId)?.lines?.find((i) => i.id === lineId) as ILine);

    // Инициализируем параметры
    actions.setForm(
      lineId !== undefined
        ? {
            name: 'documentLineParams',
            id: docLine?.id,
            ...(docLine as IDocumentLineParams),
          }
        : {
            name: 'documentLineParams',
          },
    );
    if (docLine) {
      setGoodQty(docLine.quantity.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, docId]);

  useEffect(() => {
    if (isFocused) {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));

      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }
  }, [isFocused]);

  const handelQuantityChange = useCallback((value: string) => {
    setGoodQty((prev) => {
      /*value = value.replace(',', '.');

      value = !value.includes('.') ? parseFloat(value).toString() : value;
      value = Number.isNaN(parseFloat(value)) ? '0' : value;

      const validNumber = new RegExp(/^(\d{1,6}(,|.))?\d{0,4}$/);
      return parseFloat(validNumber.test(value) ? value : prev).toString();*/
      value = Number.isNaN(parseFloat(value.replace(',', '.'))) ? '0' : value;
      const newValue = !value.includes(',') ? parseFloat(value.replace(',', '.')).toString() : value;
      let lastValid = prev;

      const validNumber = new RegExp(/^\d*.?\d*$/); // for comma
      if (validNumber.test(newValue)) {
        lastValid = newValue;
      } else {
        value = prev;
      }
      return lastValid;
    });
  }, []);

  /*useEffect(() => {
    setGoodQty(parseFloat(goodQty).toString());
  }, [goodQty]);*/

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HeaderRight
          text="Отмена"
          onPress={() => {
            actions.clearForm('documentLineParams');
            navigation.navigate('DocumentView', { docId: document?.id });
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            const id = lineId !== undefined ? updateDocumentLine() : addDocumentLine();
            if (!id) {
              return;
            }
            actions.clearForm('documentLineParams');
            navigation.navigate('DocumentView', { docId: document?.id });
          }}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document?.id,
    navigation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    route.params?.docId,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    route.params?.prodId,
    addDocumentLine,
    updateDocumentLine,
  ]);

  return (
    <SafeAreaView style={[localeStyles.area, { backgroundColor: colors.card }]}>
      <ScrollView>
        <View style={[styles.container, localeStyles.container]}>
          <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>{productName || ''}</SubTitle>
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
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={{
              backgroundColor: colors.card,
            }}
          />
          <TextInput
            mode={'flat'}
            label={'Цена'}
            editable={false}
            value={priceFSN.toString()}
            theme={{
              colors: {
                placeholder: colors.primary,
              },
            }}
            style={{
              backgroundColor: colors.card,
            }}
          />
        </View>
        {
          <List.Accordion id={'package'} key={'package'} title={'Упаковка'}>
            {listPackageTypes.map((packege) => {
              return (
                <List.Item
                  key={packege.id ?? '1'}
                  title={packege.value ?? ''}
                  onPress={() =>
                    actions.setForm({
                      ...state.forms?.documentLineParams,
                      packagekey: packege.id,
                    })
                  }
                  right={() => (
                    <Checkbox color={colors.primary} status={packagekey === packege.id ? 'checked' : 'unchecked'} />
                  )}
                  style={localeStyles.item}
                />
              );
            })}
          </List.Accordion>
        }
        {/*<View style={[localeStyles.fieldContainer, { backgroundColor: colors.card }]}>
          <Text style={localeStyles.inputCaption}>Упаковка:</Text>
          <ReferenceItem
            value={selectedItem(listPackageTypes, packagekey)?.value}
            disabled={false}
            onPress={() =>
              navigation.navigate('SelectItem', {
                formName: 'documentLineParams',
                title: 'Упаковка',
                fieldName: 'packagekey',
                list: listPackageTypes,
                value: [packagekey],
              })
            }
          />
        </View>*/}
        <ItemSeparator />
      </ScrollView>
    </SafeAreaView>
  );
};

export { DocumentLineEditScreen };

const localeStyles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  /*fieldContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    padding: 10,
  },
  inputCaption: {
    width: 70,
  },*/
  item: {
    marginLeft: 15,
  },
  title: {
    padding: 10,
  },
});
