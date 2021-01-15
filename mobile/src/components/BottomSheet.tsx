import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import React, { useMemo, Ref, ReactNode } from 'react';
import { StyleSheet, View, Text, Button, ScrollView } from 'react-native';

import styles from '../styles/global';
import ItemSeparator from './ItemSeparator';

interface IProps {
  sheetRef: Ref<BottomSheetModal>;
  children?: ReactNode;
  title?: string;
  handelDismissFilter: () => void;
  handelApplyFilter: () => void;
}

const BottomSheet = ({ sheetRef, children, title, handelDismissFilter, handelApplyFilter }: IProps) => {
  const snapPoints = useMemo(() => ['40%', '90%'], []);
  const { colors } = useTheme();
  console.log('BottomSheetComponent');
  return (
    <View>
      <BottomSheetModal ref={sheetRef} snapPoints={snapPoints} backdropComponent={BottomSheetBackdrop}>
        <View style={localStyles.content}>
          <View style={localStyles.headerContainer}>
            <MaterialCommunityIcons name={'close'} color={'#000'} size={24} onPress={handelDismissFilter} />
            <Text style={localStyles.text}>{title}</Text>
            <MaterialCommunityIcons name={'check'} color={'#000'} size={24} onPress={handelApplyFilter} />
          </View>
          <ItemSeparator />
          <View style={localStyles.contentContainer}>{children}</View>
          <ItemSeparator />
        </View>
      </BottomSheetModal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  content: {
    marginHorizontal: 10,
  },
  contentContainer: {
    //
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 20,
    // fontWeight: 'bold',
  },
});

export default BottomSheet;
