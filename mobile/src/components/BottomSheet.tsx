import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useMemo, Ref, ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import ItemSeparator from './ItemSeparator';

interface IProps {
  sheetRef: Ref<BottomSheetModal>;
  children?: ReactNode;
  onClose: () => void;
}

const BottomSheet = ({ sheetRef, children, onClose }: IProps) => {
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  console.log('BottomSheetComponent');
  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        // handleComponent={Handle}
        backdropComponent={BottomSheetBackdrop}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons
              name={'close'}
              color={'#000'}
              size={26}
              onPress={() => {
                console.log('onPress');
                onClose();
              }}
            />
            <View style={styles.title}>
              <Text style={styles.text}>Настройка фильтра</Text>
            </View>
          </View>
          <ItemSeparator />
          <View style={styles.contentContainer}>{children}</View>
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    alignItems: 'center',
    flex: 1,
  },
});

export default BottomSheet;
