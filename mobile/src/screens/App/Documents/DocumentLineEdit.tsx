import { useTheme, useIsFocused, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Keyboard, SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { TextInput,  Text } from 'react-native-paper';

import { IDocument, IGood, ILine, IRefData } from '../../../../../common';
import { IPackage, IGoodPackage } from '../../../../../common/base';
import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';
import { IListItem, IDocumentLineParams } from '../../../model/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentLineEdit'>;

const DocumentLineEditScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();
  const { docId, lineId, prodId } = route.params;

  const {
    quantity,
    packagekey,
  } = useMemo(() => {
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
  }, [prodId, state.references?.goods?.data]); 

  const packageGoods = useMemo(() => (state.references?.packageGoods?.data as IGoodPackage[]).filter((item) => item.goodkey === prodId), [
    prodId, state.references?.packageTypes?.data, 
  ]);

  const packageTypes = useMemo(() => (state.references?.packageTypes?.data as IPackage[]).filter(
    (item) => packageGoods.find((i) => i.packagekey === item.id) ? item : undefined
  ), [
    packageGoods, state.references?.packageTypes?.data, 
  ]);
  
  const updateDocumentLine = useCallback(() => {
    actions.editLine({
      docId: docId,
      line: {
        id: lineId,
        goodId: prodId,
        quantity: quantity || 1,
        packagekey: packagekey || undefined,
      }
    });
    return lineId;
  }, [actions, docId, lineId, prodId, quantity, packagekey]);

  const addDocumentLine = useCallback(() => {
    const id = lineId || 1;
    actions.addLine({
      docId: docId,
      line: {
        id: id,
        goodId: prodId,
        quantity: quantity || 1,
        packagekey: packagekey || undefined,
      }
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
          {!item.disabled && (
            <MaterialCommunityIcons
              style={localeStyles.pickerButton}
              name="menu-right"
              size={30}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>
      );
    },
    [colors.border, colors.primary, colors.text],
  );

  // const productParams = useMemo(() => (state.forms?.productParams as unknown) as ILine, [state.forms?.productParams]);

  // useEffect(() => {
  //   // Поиск редактируемой позиции документа
  //   document?.lines && setLine(document.lines.find((item) => item.id === route.params?.lineId));
  // }, [document, route.params?.lineId]);

  useEffect(() => {
    setDocument(state.documents.find((item) => item.id === docId));
  }, [state.documents, docId]);

  useEffect(() => {
    if (state.forms?.documentLineParams) {
      return;
    }
    const docLine = lineId !== undefined && ((state.documents.find((item) => item.id === docId))?.lines?.find((i) => i.id === lineId) as ILine);
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
  }, [actions, state.documents, prodId, document?.lines, lineId, docId]);

  /*   useEffect(() => {
    if (route.params.weighedGood) {
      const good = state.weighedGoods.find((item) => item.id === route.params.weighedGood);
      const date = good.datework.split('.').reverse();
      good
        ? actions.setProducParams({
            id: route.params.lineId,
            goodId: route.params.prodId,
            quantity: good.weight,
            manufacturingDate: new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]) + 1)
              .toISOString()
              .slice(0, 10),
            //timeWork: good.timework,
            numreceive: good.numreceive,
          })
        : undefined;
    }
  }, [actions, route.params.lineId, route.params.prodId, route.params.weighedGood, state.weighedGoods]); */

  /* useEffect(() => {
    if (!document || !product) {
      return;
    }

    if (!route.params?.modeCor) {
      actions.setProducParams({
        id: route.params.lineId,
        goodId: route.params.prodId,
        quantity: 1,
        manufacturingDate: new Date(document.head.date).toISOString().slice(0, 10),
      });
    } else {
      if (!line) {
        return;
      }
      route.params?.manufacturingDate
        ? actions.setProducParams({ ...line, manufacturingDate: route.params.manufacturingDate })
        : actions.setProducParams(line);
    }
  }, [
    actions,
    document,
    line,
    product,
    route.params.lineId,
    route.params.manufacturingDate,
    route.params.modeCor,
    route.params.prodId,
    route.params.weighedGood,
  ]); */

  /*   useEffect(() => {
    // TODO для чего этот эффект?
    if (state.forms.productParams && route.params?.manufacturingDate) {
      actions.setProducParams({ ...state.productParams, manufacturingDate: route.params.manufacturingDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, document, product, route.params]);

  
  */

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
  }, [actions, document?.id, navigation, route.params?.docId, route.params?.prodId, addDocumentLine, updateDocumentLine]);

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
            onChangeText={
              (text) => actions.setForm({ ...state.forms?.documentLineParams, quantity: Number(!Number.isNaN(text) ? text : '1') })
            }
            returnKeyType="done"

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
            value={(priceFSN).toString()}
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
        <View style={localeStyles.fieldContainer}>
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
  title: {
    padding: 10,
  },
  picker: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
  },
  pickerButton: {
    alignSelf: 'center',
    padding: 0,
    textAlign: 'right',
  },
  pickerText: {
    alignSelf: 'center',
    flexGrow: 1,
    padding: 10,
  },
  inputCaption: {
    width: 70,
  },
  fieldContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    margin: 5,
  },
});
