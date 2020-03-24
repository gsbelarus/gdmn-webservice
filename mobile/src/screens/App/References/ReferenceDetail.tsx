import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import SubTitle from '../../../components/SubTitle';
import styles from '../../../styles/global';

interface IEntity {
  id: string;
  name: string;
  [fieldName: string]: string;
}

const ReferenceDetailScreen = ({ route }) => {
  const item: IEntity = route.params.item;

  const fields = Object.entries(item);

  return (
    <View style={styles.container}>
      <SubTitle>{item.name}</SubTitle>
      {fields
        .filter((i) => !['id', 'name'].includes(i[0]))
        .map((field) => (
          <Text key={field[0]}>
            {field[0]}: {field[1]}
          </Text>
        ))}
    </View>
  );
};

export { ReferenceDetailScreen };
