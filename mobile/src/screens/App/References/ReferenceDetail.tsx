import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-paper";
import {
  useScrollToTop,
  useTheme,
  useNavigation
} from "@react-navigation/native";

import ItemSeparator from "../../../components/ItemSeparator";
import SubTitle from "../../../components/SubTitle";
import styles from "../../../styles/global";

interface IEntity {
  id: string;
  name: string;
  [fieldName: string]: string;
}

const LineItem = React.memo(({ item }: { item: [string, string] }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[localStyles.item, { backgroundColor: colors.card }]}>
      <View style={localStyles.details}>
        <Text style={[localStyles.name, { color: colors.text }]}>
          {item[0]}
        </Text>
        <Text
          style={[
            localStyles.value,
            localStyles.fieldName,
            { color: colors.text }
          ]}
        >
          {item[1]}
        </Text>
      </View>
    </View>
  );
});

const ReferenceDetailScreen = ({ route }) => {
  const { colors } = useTheme();

  const item: IEntity = route.params.item;

  const fields = Object.entries(item);

  const ref = React.useRef<FlatList<[string, string]>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: [string, string] }) => (
    <LineItem item={item} />
  );

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <SubTitle
        styles={[localStyles.title, { backgroundColor: colors.background }]}
      >
        {item.name}
      </SubTitle>
      <ItemSeparator />
      <FlatList
        ref={ref}
        data={fields.filter(i => !["id", "name"].includes(i[0]))}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export { ReferenceDetailScreen };

const localStyles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: "#e91e63",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  content: {
    height: "100%"
  },
  details: {
    margin: 10
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8
  },
  letter: {
    color: "white",
    fontWeight: "bold"
  },
  name: {
    fontSize: 16,
    fontWeight: "bold"
  },
  title: {
    padding: 10
  },
  fieldName: {
    opacity: 0.5
  },
  value: {
    fontSize: 14
  }
});
