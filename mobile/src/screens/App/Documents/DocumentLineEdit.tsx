import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Keyboard, SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

import { IDocument, IGood, ILine, IRefData } from '../../../../../common';
import { IPackage, IGoodPackage } from '../../../../../common/base';
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
    () => (state.references?.packageGoods?.data as IGoodPackage[]).map((item) => 
      { if (item.goodkey === prodId) return  item.packagekey }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prodId, state.references?.packageGoods?.data],
  );

  const packageTypes = useMemo(
    () =>
      (state.references?.packageTypes?.data as IPackage[]).filter((item) =>
        packageGoods.find((i) => i === item.id)
      ),
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

  const selectedItem = useCallback((listItems: IListItem[], id: number | number[]) => {
    return listItems?.find((item) => (Array.isArray(id) ? id.includes(item.id) : item.id === id));
  }, []);

  const getListItems = <T extends IRefData>(con: T[]): IListItem[] =>
    con?.map((item) => ({ id: item.id, value: item.name }));

  const listPackageTypes = useMemo(() => getListItems(packageTypes), [packageTypes]);

  const ReferenceItem = useCallback(
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
  );

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
    lineId !== undefined
      ? actions.setForm({
          name: 'documentLineParams',
          id: docLine?.id,
          ...(docLine as IDocumentLineParams),
        })
      : actions.setForm({
          name: 'documentLineParams',
        });
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
    <SafeAreaView>
      <ScrollView>
        <View
          style={[
            styles.container,
            localeStyles.container,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>{productName || ''}</SubTitle>
          <TextInput
            mode={'flat'}
            label={'Количество'}
            editable={true}
            keyboardType="decimal-pad"
            onChangeText={(text) =>
              actions.setForm({
                ...state.forms?.documentLineParams,
                quantity: Number(!Number.isNaN(text) ? text : '1'),
              })
            }
            returnKeyType="done"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isFocused}
            // value={(line?.quantity ?? 1).toString()}
            value={(quantity ?? 1).toString()}
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
        <View style={[localeStyles.fieldContainer, { backgroundColor: colors.card }]}>
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
        </View>
        <ItemSeparator />
      </ScrollView>
    </SafeAreaView>
  );
};

export { DocumentLineEditScreen };

const localeStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  fieldContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    padding: 10,
  },
  inputCaption: {
    width: 70,
  },
  picker: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    flex: 1,
    padding: 10,
  },
  title: {
    padding: 10,
  },
});
