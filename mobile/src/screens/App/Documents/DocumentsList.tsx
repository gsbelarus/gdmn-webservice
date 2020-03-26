import {
  useScrollToTop,
  useTheme,
  useNavigation
} from "@react-navigation/native";
import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";

import ItemSeparator from "../../../components/ItemSeparator";
import contacts from "../../../mockData//GD_Contact.json";
import documents from "../../../mockData/Document.json";
import documentTypes from "../../../mockData/GD_DocumentType.json";
import { IDocument, IDocumentType, IContact } from "../../../model/inventory";
import styles from "../../../styles/global";

const DocumentList: IDocument[] = documents;
const DocumentTypes: IDocumentType[] = documentTypes;
const Contacts: IContact[] = contacts;

const DocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  const statusColors = ["#C52900", "#C56A00", "#008C3D", "#06567D"];
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ViewDocument", { docId: item.id });
      }}
    >
      <View style={[localStyles.item, { backgroundColor: colors.card }]}>
        <View
          style={[
            localStyles.avatar,
            { backgroundColor: statusColors[item.head.status] }
          ]}
        >
          <Text style={localStyles.letter}>
            {DocumentTypes.find(type => type.id === item.head.doctype)
              .name.slice(0, 1)
              .toUpperCase()}
          </Text>
        </View>
        <View style={localStyles.details}>
          <Text style={[localStyles.name, { color: colors.text }]}>
            {DocumentTypes.find(type => type.id === item.head.doctype).name}
          </Text>
          <Text
            style={[
              localStyles.number,
              localStyles.field,
              { color: colors.text }
            ]}
          >
            {
              Contacts.find(contact => contact.id === item.head.fromcontactId)
                .name
            }{" "}
            от {new Date(item.head.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const DocumentsListScreen = ({ navigation }) => {
  const ref = React.useRef<FlatList<IDocument>>(null);
  useScrollToTop(ref);

  const renderItem = ({ item }: { item: IDocument }) => (
    <DocumentItem item={item} />
  );

  return (
    <>
      <FlatList
        ref={ref}
        data={DocumentList}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <Button
        mode="contained"
        style={[styles.rectangularButton, { marginHorizontal: 15 }]}
        onPress={() => {
          navigation.navigate("CreateDocument");
        }}
      >
        Create Document
      </Button>
    </>
  );
};

export { DocumentsListScreen };

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
    margin: 8
  },
  field: {
    opacity: 0.5
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
    fontSize: 14,
    fontWeight: "bold"
  },
  number: {
    fontSize: 12
  }
});
