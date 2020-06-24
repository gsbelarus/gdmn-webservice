import { useTheme, useScrollToTop, useNavigation} from '@react-navigation/native';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import { Text, TextInput } from 'react-native-paper';

import SubTitle from '../../../components/SubTitle';
import ItemSeparator from '../../../components/ItemSeparator';
import styles from '../../../styles/global';
import { IGood, IDocument, IReference } from '../../../../../common';
import { ISellLine, ISellDocument, ILineTara, ITara } from '../../../model';
import { useAppStore } from '../../../store';

const TaraItem = React.memo(({ item, line }:  { item: ITara; line: ISellLine; }) => {
  const navigation = useNavigation();
  const [taraStatus, setTaraStatus] = useState(true);
  const { colors } = useTheme();
 
  return  taraStatus ? (
    <TouchableOpacity
      style={[localeStyles.listContainer, {backgroundColor: colors.border }]}
      onPress={() => {setTaraStatus(false);}}
    >
      <View style={localeStyles.taraContanerView}>
        <Text  style={[localeStyles.fontSize16, { opacity: 0.7 }]}>
          {item.name}
        </Text>
        <Text  style={[localeStyles.fontSize16, { opacity: 0.7 }]}>
          вес ед.: {item.weight ?? 0}
        </Text>
        <Text  style={[localeStyles.fontSize16, { opacity: 0.7 }]}>
          количество: {line?.tara? line.tara.find((t) => t.tarakey === item.id)?.quantity : 0}
        </Text>
      </View> 
    </TouchableOpacity>
  ) : 
  (
    <View style={localeStyles.taraContanerView}>
      <Text  style={localeStyles.fontSize16}>
        {item.name}
      </Text>
      <Text  style={localeStyles.fontSize16}>
        количество: {line?.tara? line.tara.find((t) => t.tarakey === item.id)?.quantity : 0}
      </Text>
    </View> 
  );
}); 

export interface ISellProductDetailsRef {
  done(): void;
}

interface MyInputProps {
  route: any;
  navigation: any;
}

const SellProductDetailScreen = forwardRef<ISellProductDetailsRef, MyInputProps>(({ route, navigation }, ref) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const product = state.goods.find((item) => item.id === route.params.prodId);
  const document = state.documents.find((item) => item.id === route.params.docId);
  const lineDocuments =
    document instanceof Object && (document as IDocument)
      ? (document as IDocument).lines
      : (document as ISellDocument).lines;
  const lineDocument = lineDocuments.find((line) => line.id === route.params.lineID);
 // const taraList = state.references.find((ref) => ref.type === 'taraTypes').data  as ITara[];
  const [line, setLine] = useState<ISellLine>(undefined);
  const [value, setValue] = useState(1);
  const orderQ = (lineDocument as ISellLine)?.orderQuantity ?? 0;
  //const [tara, setTara] = useState<ILineTara[]>(undefined)

 /* const ref = React.useRef<FlatList<ITara>>(null);
  useScrollToTop(ref);*/

  const renderItem = ({ item }: {item: ITara}) => (
    <TaraItem item={item} line={line} />
  );

  useEffect(() => {
    if (route.params.modeCor) {
      if (lineDocument) {
        setValue(lineDocument.quantity);
      }
      setLine(lineDocument);
    //  setTara((lineDocument as ISellLine).tara ?? undefined);
    }
  }, [document.lines, route.params.modeCor, route.params.lineID]);
  
  useImperativeHandle(ref, () => ({
    done: () => {
      if (line !== undefined) {
        actions.editLine({
          docId: route.params.docId,
          lineId: line.id,
          value: route.params.modeCor ? value : value + line.quantity,
        });
      } else {
        actions.addLine({ docId: route.params.docId, line: { id: '0', goodId: product.id, quantity: value } });
      }
      navigation.navigate('ViewSellDocument', { docId: route.params.docId });
    },
  }));

  return (
    <View
      style={[
        styles.container,
        localeStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <SubTitle styles={[localeStyles.title, { backgroundColor: colors.background }]}>{product.name}</SubTitle>
      <TextInput
        mode={'flat'}
        label={'Кол-во по заявке'}
        editable={false}
        value={orderQ.toString()}
        theme={{
          colors: {
            placeholder: colors.primary,
          },
        }}
        style={{
          backgroundColor: colors.card,
        }}  
      />
      <TextInput
        mode={'flat'}
        label={'Количество'}
        editable={true}
        keyboardType="decimal-pad"
        onChangeText={(newValue) => setValue(Number(newValue))}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={true}
        value={value.toString()}
        style={{
          backgroundColor: colors.card,
        }}
      />

      <View style={localeStyles.flatContaner}>
        <FlatList
          //ref={ref}
          data={[]}
         // data={taraList ?? []}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          horizontal={true}
        />
      </View>
    </View>
  );
});

export { SellProductDetailScreen };

const localeStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 35,
    marginHorizontal: '25%',
  },
  container: {
    justifyContent: 'flex-start',
    padding: 0,
  },
  editQuantityView: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 20,
  },
  fontSize16: {
    fontSize: 16,
  },
  fontSize20: {
    fontSize: 20,
  },
  inputSpinner: {
    marginTop: 5,
    width: 180,
  },
  productName: {
    alignItems: 'center',
    color: '#000000',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 25,
  },
  productPrice: {
    color: '#000000',
    fontSize: 17,
    marginLeft: 5,
    textAlignVertical: 'center',
  },
  productPriceView: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 25,
    justifyContent: 'center', 
  },
  productQuantity: {
    color: '#000000',
    fontSize: 17,
    marginLeft: 15,
  },
  productQuantityView: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 15,
  },
  title: {
    padding: 10,
  },
  taraContanerView: {
    flexDirection: 'column',
    marginHorizontal: 3,
    marginVertical: 3,
    padding: 15,
    flexBasis: 145,
    minWidth: 120,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  listContainer: {
    flexBasis: 100,
    marginTop: 10,
    marginLeft: 0.5,
    borderRadius: 6,
  },
  flatContaner: {
    margin: 20,
  }
});
