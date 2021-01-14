import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useMemo, Ref, ReactNode } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

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
  console.log('BottomSheetComponent');
  return (
    <View style={localStyles.container}>
      <BottomSheetModal ref={sheetRef} snapPoints={snapPoints} backdropComponent={BottomSheetBackdrop}>
        <View style={localStyles.content}>
          <View style={localStyles.headerContainer}>
            <MaterialCommunityIcons
              name={'close'}
              color={'#000'}
              size={24}
              onPress={() => {
                console.log('onPress');
                handelDismissFilter();
              }}
            />
            <View style={localStyles.title}>
              <Text style={localStyles.text}>{title}</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={localStyles.contentContainer}>{children}</View>
          <View style={[styles.rectangularButton, localStyles.buttons]}>
            <Button title="Выбрать" onPress={handelApplyFilter} />
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  buttons: {
    width: '100%',
  },
  container: {
    // alignItems: 'center',
    // flexDirection: 'row',
  },
  content: {
    marginHorizontal: 10,
  },
  contentContainer: {
    // backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  text: {
    fontSize: 20,
    // fontWeight: 'bold',
  },
  title: {
    alignItems: 'center',
    flex: 1,
  },
});

export default BottomSheet;
