import React from 'react';
import { View } from 'react-native';
import { Subheading, Switch } from 'react-native-paper';

type Props = {
  label: string;
  value: boolean;
  onValueChange: () => void;
};

export default function SettingsItem({ label, value, onValueChange }: Props) {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Subheading numberOfLines={5} style={{width: '90%'}}>{label}</Subheading>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
