import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

import Handle from './Handle';

interface IProps {
  data: unknown[];
}

const BottomSheetComponent = ({ data }: IProps) => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  // const data = useMemo(
  //   () =>
  //     Array(50)
  //       .fill(0)
  //       .map((_, index) => `index-${index}`),
  //   [],
  // );
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log('handleSheetChange', index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapTo(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
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
        <Text style={styles.title}>Backdrop Example</Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        handleComponent={Handle}
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetFlatList
          data={data}
          keyExtractor={(i: string) => i}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingVertical: 24,
  },
  itemContainer: {
    backgroundColor: '#eee',
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
