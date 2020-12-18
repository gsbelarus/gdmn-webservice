import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useMemo, useState, useEffect, ReactNode } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

import Handle from './Handle';

interface IProps {
  data: unknown[];
  visible: boolean;
  onApply: () => void;
  onDismiss: () => void;
  children?: ReactNode;
}

const BottomSheetComponent = ({ data, visible, onApply, onDismiss, children }: IProps) => {
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['70%', '90%'], []);

  useEffect(() => {
    // eslint-disable-next-line @babel/no-unused-expressions
    visible ? sheetRef.current?.collapse() : sheetRef.current?.close();
  }, [visible]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    [],
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Настройка фильтра</Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        // onChange={handleSheetChange}
        handleComponent={Handle}
        backdropComponent={BottomSheetBackdrop}
      >
        <View style={styles.contentContainer}>
          <View style={styles.buttons}>
            <Button title="Применить" onPress={onDismiss} />
            <Button title="Сбросить" onPress={onDismiss} />
          </View>
          {children}
          {/* <BottomSheetFlatList
          data={data}
          keyExtractor={(i: string) => i}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        /> */}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingVertical: 24,
  },
  itemContainer: {
    margin: 6,
    padding: 6,
  },
  title: {
    fontSize: 46,
    fontWeight: '800',
    lineHeight: 46,
  },
});

export default BottomSheetComponent;
