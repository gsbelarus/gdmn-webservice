import { useTheme, useIsFocused, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Keyboard, SafeAreaView, ScrollView, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { IDocument, IGood, ILine } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import SubTitle from '../../../components/SubTitle';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentLineEdit'>;

const DocumentLineEditScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const { docId, lineId, prodId } = useRoute<RouteProp<DocumentStackParamList, 'DocumentLineEdit'>>().params;

  const [document, setDocument] = useState<IDocument>(undefined);
  // const [product, setProduct] = useState<IGood>(undefined);
  const [line, setLine] = useState<ILine>(undefined);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();

  const productName = useMemo(() => {
    return (
      ((state.references?.goods?.data as unknown) as IGood[])?.find((item) => item.id === prodId)?.name ||
      'товар не найден'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodId, state.references?.goods?.data]);

  // const productParams = useMemo(() => (state.forms?.productParams as unknown) as ILine, [state.forms?.productParams]);

  // useEffect(() => {
  //   // Поиск редактируемой позиции документа
  //   document?.lines && setLine(document.lines.find((item) => item.id === route.params?.lineId));
  // }, [document, route.params?.lineId]);

  useEffect(() => {
    const docLine: ILine = document?.lines.find((item) => item.id === lineId);

    setLine({
      goodId: docLine?.goodId || prodId,
      id: docLine?.id || 1,
      quantity: docLine?.quantity || 1,
    });

    setDocument(state.documents.find((item) => item.id === docId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.documents, prodId, document?.lines, lineId, docId]);

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
  }, [actions, document, product, route.params]); */

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
            navigation.navigate('DocumentView', { docId: document?.id });
            // actions.clearProductParams();
          }}
        />
      ),
      headerRight: () => (
        <HeaderRight
          text="Готово"
          onPress={() => {
            if (lineId) {
              actions.editLine({
                docId: route.params?.docId,
                line,
              });
            } else {
              actions.addLine({
                docId: route.params?.docId,
                line,
              });
            }
            navigation.navigate('DocumentView', { docId: document?.id });
            // actions.clearProductParams();
          }}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, document?.id, line, navigation, route.params?.docId, route.params?.prodId]);

  /*   const onPress = () => {
      if (isKeyboardVisible) {
        return;
      }
      navigation.navigate('SelectBoxingsScreen', {
        lineId: route.params.lineId,
        prodId: route.params.prodId,
        docId: route.params.docId,
        quantity: '0',
        batchNumber: '0',
      });
    }; */

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
            onChangeText={(text) => {
              setLine((prev) => ({
                ...prev,
                quantity: Number(!Number.isNaN(text) ? text : '1'),
              }));
            }}
            returnKeyType="done"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isFocused}
            value={(line?.quantity ?? 1).toString()}
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
});