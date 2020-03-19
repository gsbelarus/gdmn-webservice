import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from '../../../styles/global';
import { useTheme, useScrollToTop } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { IDocument, IContact, IDocumentType, ILine, IGood } from '../../../model/inventory';
import documents from '../../../mockData/Document.json';
import contacts from '../../../mockData/GD_Contact.json';
import documentTypes from '../../../mockData/GD_DocumentType.json';
import goods from '../../../mockData/Goods.json';
import remains from '../../../mockData/Remains.json';

const LineItem = React.memo(({ item, status }: { item: ILine, status: number }) => {
	const { colors } = useTheme();
	const good: IGood = goods.find(i => i.id === item.goodId)
 
	return (
	<>
		<View style={localeStyles.productTextView}>
			<View style={localeStyles.productNameTextView}>
				<Text numberOfLines={5} style={localeStyles.productTitleView}>{good.name}</Text>
				<Text numberOfLines={5} style={localeStyles.productBarcodeView}>{good.barcode}</Text>
			</View>
			{
			status === 0
				?
				<TouchableOpacity
					style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}} 
					onPress={async () => {
						Alert.alert(
						'Вы уверены, что хотите удалить?',
						'',
						[
							{
								text: 'OK',
								onPress: async() => {}
							},
							{
								text: 'Отмена',
								onPress: () => {}
							},
						]
						);
					}}
				>
					<MaterialIcons
						size={25}
						color='#2D3083' 
						name='delete-forever' 
					/>
				</TouchableOpacity>
				: undefined
			}
		</View>
		
		<View style={localeStyles.productNumView}>
			<View style={{flex: 1, flexDirection: 'row'}}>
				<Ionicons 
					size={20}
					color='#8C8D8F' 
					name='md-pricetag' 
				/>
				<Text numberOfLines={5} style={localeStyles.productPriceView}>{remains?.find(remain => remain.goodId === good.id).price}</Text>
			</View>
			<Text numberOfLines={5} style={localeStyles.productQuantityView}>{item.quantity}</Text>
		</View>
	</>
	);
 });
 
 const ItemSeparator = () => {
	const { colors } = useTheme();
 
	return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
 };

const ViewDocumentScreen = ({route, navigation}) => {
  const { colors } = useTheme();
  const document: IDocument = documents.find(item => item.id === route.params.docId);
  const type: IDocumentType = documentTypes.find(item => item.id === document.head.doctype);
  const contact: IContact = contacts.find(item => item.id === document.head.tocontactId);
  const ref = React.useRef<FlatList<ILine>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: ILine }) => <LineItem item={item} status={document.head.status} />;

  return (
		<View style={[styles.container, {padding: 0}]}>
			<View style={localeStyles.documentHeader}>
				<Text numberOfLines={5} style={localeStyles.documentHeaderText}>{type.name}</Text>
				<Text numberOfLines={5} style={localeStyles.documentHeaderText}>{contact.name}</Text>
				<Text numberOfLines={5} style={localeStyles.documentHeaderText}>{new Date(document.head.date).toLocaleDateString()}</Text>
			</View>
			<FlatList
				ref={ref}
				data={document.lines}
				keyExtractor={(_, i) => String(i)}
				renderItem={renderItem}
				ItemSeparatorComponent={ItemSeparator}
			/>
		</View>
  );
};

export default ViewDocumentScreen;

const localeStyles = StyleSheet.create({
  documentHeader: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#5053A8'
  },
  documentHeaderText: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 2,
    textAlignVertical: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  productView: {
    flexDirection: 'column'
  },
  productTextView: {
    flexDirection: 'row',
    margin: 5
  },
  productNumView: {
    height: 25,
    flexDirection: 'row',
    backgroundColor: '#F0F0FF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 48,
    paddingHorizontal: 30
  },
  productIdView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  productNameView: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#E6E7FF'
  },
  productNameTextView: {
    maxHeight: 75,
    minHeight: 45,
    marginTop: 5,
    marginHorizontal: 5,
    width: '75%',
    textAlignVertical: 'center',
    color: '#000000',
    fontWeight: 'bold'
  },
  productPriceView: {
    marginLeft: 5
  },
  productTitleView: {
    fontWeight: 'bold',
    minHeight: 25,
    maxHeight: 70,
    flexGrow: 1
  },
  productBarcodeView: {
    marginTop: 5
  },
  productQuantityView: {
  },
});
