import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { ModalList, IItem } from './ModalList';

const DropdownList = ({
  list,
  value,
  onValueChange,
}: {
  list: IItem[];
  value: IItem;
  onValueChange(item: IItem): void;
}) => {
  const { colors } = useTheme();
  const [modalView, setModalView] = useState({ visible: false });
  const [selectedItem, setSelectedItem] = useState<IItem>({});

  useEffect(() => {
    setSelectedItem(value || {});
  }, [value]);

  const openDropdown = useCallback(() => {
    setModalView({ visible: true });
  }, []);

  const handleSelectItem = useCallback(
    async (item: IItem) => {
      setSelectedItem(item);
      setModalView({ visible: false });
      onValueChange(item);
    },
    [onValueChange],
  );

  const label = useMemo(() => (Object.keys(selectedItem).length === 0 ? 'Выберите из списка' : selectedItem.value), [
    selectedItem,
  ]);

  return (
    <View style={localeStyles.containerHome}>
      <View style={[localeStyles.picker, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={openDropdown}>
          <View style={localeStyles.containerMain}>
            <View style={localeStyles.containerLabel}>
              <Text style={localeStyles.text}> {label} </Text>
            </View>
            <View style={localeStyles.containerDropdownButton}>
              <Ionicons name="md-arrow-dropdown" size={24} color="black" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <ModalList
        visible={modalView.visible}
        selectedValue={selectedItem}
        list={list}
        onOk={handleSelectItem}
        onCancel={() => setModalView({ visible: false })}
      />
    </View>
  );
};

export default DropdownList;

const localeStyles = StyleSheet.create({
  containerDropdownButton: {
    flex: 0.07,
  },
  containerHome: {
    flex: 1,
  },
  containerLabel: {
    flex: 0.93,
  },
  containerMain: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
  },
  picker: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    marginTop: 5,
    padding: 10,
    width: '100%',
  },
  text: {
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
  },
});
