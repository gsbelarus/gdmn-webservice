import { useTheme, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Text } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { ILineTara, ITara, ISellDocument } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

export interface ISelectBoxingsRef {
  done(): void;
  cancel(): void;
}

type SelectBoxingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BoxingDetail'>;
type SelectBoxingsScreenRouteProp = RouteProp<RootStackParamList, 'BoxingDetail'>;

type Props = {
  route: SelectBoxingsScreenRouteProp;
  navigation: SelectBoxingsScreenNavigationProp;
};

const Line = React.memo(
  ({
    boxing,
    selected,
    quantity,
    onPress,
  }: {
    boxing: ITara;
    selected: boolean;
    quantity?: number;
    onPress: () => void;
  }) => {
    return (
      <TouchableOpacity onPress={onPress} style={localeStyles.line}>
        <Text style={localeStyles.fontSize18}>
          {boxing.name} {selected ? `- ${quantity ?? '0'}` : ''}
        </Text>
      </TouchableOpacity>
    );
  },
);

const SelectBoxingsScreen = forwardRef<ISelectBoxingsRef, Props>(({ route, navigation }, ref) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const findBoxingsLine = state.boxingsLine
    ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
    : undefined;
  const [boxingsLine, setBoxingsLine] = useState<ILineTara[]>(findBoxingsLine ? findBoxingsLine.lineBoxings : []);

  const refList = useRef<FlatList<ITara>>(null);

  useEffect(() => {
    const findBoxingsLineHock = state.boxingsLine
      ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
      : undefined;
    setBoxingsLine(findBoxingsLineHock ? findBoxingsLineHock.lineBoxings : []);
  }, [route.params.docId, route.params.lineId, state.boxingsLine]);

  useImperativeHandle(ref, () => ({
    done: () => {
      actions.setProducParams({ ...state.producParams, tara: boxingsLine });
    },
    cancel: () => {
      const document = state.documents ? state.documents.find((doc) => doc.id === route.params.docId) : undefined;
      const lines =
        document && (document as ISellDocument)
          ? (document as ISellDocument).lines.find((line) => line.id === route.params.lineId)
          : undefined;
      const idx = state.boxingsLine
        ? state.boxingsLine.findIndex(
            (item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId,
          )
        : -1;
      const newBoxingsLine = {
        docId: route.params.docId,
        lineDoc: route.params.lineId,
        lineBoxings: lines ? lines.tara : [],
      };
      const updateBoxingsLine =
        idx === -1
          ? state.boxingsLine
            ? [...state.boxingsLine, newBoxingsLine]
            : [newBoxingsLine]
          : [...state.boxingsLine.slice(0, idx), newBoxingsLine, ...state.boxingsLine.slice(idx + 1)];
      actions.setBoxingsLine(updateBoxingsLine);
    },
  }));

  const renderItem = ({ item, selected }: { item: ITara; selected: boolean }) => {
    const boxing = boxingsLine ? boxingsLine.find((box) => box.tarakey === item.id) : undefined;
    return (
      <Line
        boxing={item}
        selected={selected}
        quantity={boxing ? boxing.quantity : undefined}
        onPress={() => navigation.navigate('BoxingDetail', { ...route.params, boxingId: item.id })}
      />
    );
  };

  return (
    <ScrollView horizontal contentContainerStyle={[styles.container, localeStyles.container]}>
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Выбранная тара:</SubTitle>
      <FlatList
        key="boxingSelected"
        style={[{ backgroundColor: colors.card }, localeStyles.minHeight45]}
        ref={refList}
        data={
          boxingsLine && boxingsLine.length !== 0
            ? state.boxings.filter((box) => boxingsLine.some((item) => item.tarakey === box.id))
            : []
        }
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => renderItem({ item, selected: true })}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<Text style={[localeStyles.title, localeStyles.emptyList]}>Ничего не выбрано</Text>}
      />
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Новая тара:</SubTitle>
      <FlatList
        key="boxingNoSelected"
        style={[{ backgroundColor: colors.card }, localeStyles.minHeight45]}
        ref={refList}
        data={
          boxingsLine && boxingsLine.length !== 0
            ? state.boxings.filter((box) => !boxingsLine.some((item) => item.tarakey === box.id))
            : state.boxings
        }
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => renderItem({ item, selected: false })}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<Text>Тар нет</Text>}
      />
    </ScrollView>
  );
});

export { SelectBoxingsScreen };

const localeStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  emptyList: {
    paddingLeft: 15,
  },
  fontSize18: {
    fontSize: 18,
  },
  line: {
    alignItems: 'center',
    flexDirection: 'row',
    // height: 45,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  minHeight45: {
    minHeight: 45,
  },
  scrollContainer: {
    flexWrap: 'wrap',
  },
  title: {
    padding: 10,
  },
});
