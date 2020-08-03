import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

import ItemSeparator from '../../../components/ItemSeparator';
import SubTitle from '../../../components/SubTitle';
import { ILineTara } from '../../../model';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

export interface ISelectBoxingsRef {
  done(): void;
}

type SelectBoxingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BoxingDetail'>;
type SelectBoxingsScreenRouteProp = RouteProp<RootStackParamList, 'BoxingDetail'>;

type Props = {
  route: SelectBoxingsScreenRouteProp;
  navigation: SelectBoxingsScreenNavigationProp;
};

const Line = React.memo(
  ({ name, title, selected, onPress }: { name: number; title: string; selected: boolean; onPress: () => void }) => {
    const { colors } = useTheme();
    return (
      <>
        <TouchableOpacity onPress={onPress}>
          <View key={name} style={localeStyles.line}>
            <Text style={localeStyles.fontSize18}>{title}</Text>
            {selected ? <MaterialIcons name="check" size={30} color={colors.primary} /> : null}
          </View>
        </TouchableOpacity>
        <ItemSeparator />
      </>
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

  useEffect(() => {
    const findBoxingsLineHock = state.boxingsLine
      ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
      : undefined;
    setBoxingsLine(findBoxingsLineHock ? findBoxingsLineHock.lineBoxings : []);
  }, [route.params.docId, route.params.lineId, state.boxingsLine]);

  useImperativeHandle(ref, () => ({
    done: () => {
      console.log('done');
    },
  }));

  return (
    <View
      style={[
        styles.container,
        localeStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>Выбор тары:</SubTitle>
      <View style={localeStyles.areaChips}>
        {boxingsLine.map((box) => {
          const boxing = state.boxings.find((item) => item.id === box.tarakey);
          return (
            <Line
              key={boxing.id}
              name={boxing.id}
              title={boxing.name}
              selected={true}
              onPress={() => navigation.navigate('BoxingDetail', { ...route.params, boxingId: boxing.id })}
            />
          );
        })}
      </View>
    </View>
  );
});

export { SelectBoxingsScreen };

const localeStyles = StyleSheet.create({
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  fontSize18: {
    fontSize: 18,
  },
  line: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 45,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  title: {
    padding: 10,
  },
});
