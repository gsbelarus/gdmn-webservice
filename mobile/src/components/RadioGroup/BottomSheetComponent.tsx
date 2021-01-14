// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
// import React, { useMemo, Ref, ReactNode } from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import BottomSheet from '../BottomSheet';

// interface IProps {
//   sheetRef: Ref<BottomSheetModal>;
//   children?: ReactNode;
//   onClose: () => void;
// }

// const BottomSheetComponent = ({ sheetRef, children, onClose }: IProps) => {
//   const snapPoints = useMemo(() => ['50%', '90%'], []);
//   console.log('BottomSheetComponent');
//   return (
//     // <View style={styles.container}>
//     <BottomSheet sheetRef={sheetRef} onClose={onClose}>
//       <RadioGroup
//         options={filter_options}
//         onChange={setSelectedOption}
//         activeButtonId={selectedOption?.id}
//         // circleStyle={{ fillColor: colors.primary }}
//       />
//       <View style={[styles.rectangularButton, localStyles.buttons]}>
//         <Button title="Выбрать" onPress={handelApplyFilter} />
//       </View>
//     </BottomSheet>
//     // </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // alignItems: 'center',
//     // flexDirection: 'row',
//   },
//   content: {
//     marginHorizontal: 10,
//   },
//   contentContainer: {
//     // backgroundColor: 'white',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   title: {
//     alignItems: 'center',
//     flex: 1,
//   },
// });

// export default BottomSheetComponent;
