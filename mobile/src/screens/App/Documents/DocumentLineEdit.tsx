import { useTheme, useIsFocused, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Keyboard, SafeAreaView, ScrollView, View } from 'react-native';
import { TextInput, Text, Colors } from 'react-native-paper';

import { IDocument, IGood, ILine } from '../../../../../common';
import { HeaderRight } from '../../../components/HeaderRight';
import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { formatValue } from '../../../helpers/utils';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

type Props = StackScreenProps<DocumentStackParamList, 'DocumentLineEdit'>;

const DocumentLineEditScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const { docId, lineId, prodId, price, remains, quantity } = route.params;

  const [document, setDocument] = useState<IDocument>(undefined);
  const [line, setLine] = useState<ILine>(undefined);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();

  /*   const ref = useRef<typeof TextInput>(null);

  useEffect(() => {
    ref.current.propTypes.selection = {start: 0, end: 0};
  }, []); */

  const product = useMemo(() => {
    return ((state.references?.goods?.data as unknown) as IGood[])?.find((item) => item.id === prodId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodId, state.references?.goods?.data]);

  useEffect(() => {
    const docLine: ILine = document?.lines.find((item) => item.id === lineId);

    setLine({
      goodId: docLine?.goodId || prodId,
      id: docLine?.id || 1,
      quantity: docLine?.quantity || quantity || 1,
      price: docLine?.price || price,
      remains: docLine?.remains || remains,
    });

    setDocument(state.documents.find((item) => item.id === docId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.documents, prodId, document?.lines, lineId, docId, price, remains]);

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

  return (
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
          <SubTitle styles={[localStyles.title, { backgroundColor: colors.background }]}>
            {product?.name || 'Товар не найден'}
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
          <TextInput
            mode={'flat'}
            label={'Количество'}
            editable={true}
            // ref={ref}
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

const localStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 0,
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
