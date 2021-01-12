import BottomSheet, { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef, useMemo, Ref, ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Handle from './Handle';
import ItemSeparator from './ItemSeparator';

interface IProps {
  sheetRef: Ref<BottomSheetModal>;
  children?: ReactNode;
}

const BottomSheetComponent = ({ sheetRef, children }: IProps) => {
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  // useEffect(() => {
  //   // eslint-disable-next-line @babel/no-unused-expressions
  //   visible ? sheetRef.current?.collapse() : sheetRef.current?.close();
  // }, [visible]);

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
            <Text style={styles.title}>Настройка фильтра</Text>
          </View>
          <ItemSeparator />
          <View style={styles.contentContainer}>{children}</View>
        </View>
      </BottomSheetModal>
    </View>
  );
};

// eslint-disable-next-line no-lone-blocks
{
  /* <BottomSheetFlatList
          data={data}
          keyExtractor={(i: string) => i}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        /> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 0,
  },
  content: {
    marginHorizontal: 10,
  },
  contentContainer: {
    // backgroundColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    // paddingVertical: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 46,
  },
});

export default BottomSheetComponent;
