import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Chip, List } from 'react-native-paper';

import { IDocument } from '../../../../../common';
import SubTitle from '../../../components/SubTitle';
import { ISellLine, ISellDocument, ITara, ILineTara } from '../../../model';
import { useAppStore } from '../../../store';
import styles from '../../../styles/global';

export interface ISellProductDetailsRef {
  done(): void;
}

interface MyInputProps {
  route: any;
  navigation: any;
}

const ListChips = ({
  data,
  onPress,
  selected,
}: {
  data: ITara[];
  onPress: (item: ITara) => void;
  selected: ILineTara[];
}) => {
  const { colors } = useTheme();
  return (
    <View style={localeStyles.scrollContainer}>
      {data.map((item, idx) => {
        const selectedBoxing = selected.find((box) => box.tarakey === item.id);
        return (
          <Chip
            key={idx}
            mode="outlined"
            style={[localeStyles.margin, selectedBoxing ? { backgroundColor: colors.primary } : {}]}
            onPress={() => onPress(item)}
            selected={selectedBoxing !== undefined}
            selectedColor={selectedBoxing ? colors.card : colors.text}
          >
            <>
              <Text>{item.name}</Text>
              {selectedBoxing ? (
                <Text>
                  шт. {selectedBoxing.quantity ?? '-'} / вес {selectedBoxing.weight ?? 0}
                </Text>
              ) : undefined}
            </>
          </Chip>
        );
      })}
    </View>
  );
};

const SellProductDetailScreen = forwardRef<ISellProductDetailsRef, MyInputProps>(({ route, navigation }, ref) => {
  const { colors } = useTheme();
  const { state, actions } = useAppStore();

  const product = state.goods.find((item) => item.id === route.params.prodId);
  const document = state.documents.find((item) => item.id === route.params.docId);
  const lineDocuments =
    document instanceof Object && (document as IDocument)
      ? (document as IDocument).lines
      : (document as ISellDocument).lines;
  const lineDocument = lineDocuments.find((line) => line.id === route.params.lineId);
  const [line, setLine] = useState<ISellLine>(lineDocument);
  const [value, setValue] = useState('1');
  const orderQ = (lineDocument as ISellLine)?.orderQuantity ?? 0;
  const findBoxingsLine = state.boxingsLine
    ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
    : undefined;
  const [boxingsLine, setBoxingsLine] = useState<ILineTara[]>(findBoxingsLine ? findBoxingsLine.lineBoxings : []);

  useEffect(() => {
    if (route.params.modeCor) {
      if (lineDocument) {
        setValue(lineDocument.quantity.toString());
      }
      setLine(lineDocument);
    }
  }, [document.lines, route.params.modeCor, route.params.lineId, lineDocument]);

  useEffect(() => {
    const findBoxingsLineHock = state.boxingsLine
      ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
      : undefined;
    setBoxingsLine(findBoxingsLineHock ? findBoxingsLineHock.lineBoxings : []);
  }, [route.params.docId, route.params.lineId, state.boxingsLine]);

  useImperativeHandle(ref, () => ({
    done: () => {
      const findBoxingsLineHock = state.boxingsLine
        ? state.boxingsLine.find((item) => item.docId === route.params.docId && item.lineDoc === route.params.lineId)
        : undefined;
      const boxings = findBoxingsLineHock ? findBoxingsLineHock : undefined;
      if (line) {
        actions.editLine({
          docId: route.params.docId,
          line: {
            ...line,
            quantity: Number.parseFloat(route.params.modeCor ? value : value + line.quantity),
            tara: boxings ? boxings.lineBoxings : undefined,
          },
        });
      } else {
        actions.addLine({
          docId: route.params.docId,
          line: {
            id: '0',
            goodId: product.id,
            quantity: Number.parseFloat(value),
            tara: boxings ? boxings.lineBoxings : undefined,
          },
        });
      }
      navigation.navigate('ViewSellDocument', { docId: route.params.docId });
    },
  }));

  const onPress = (item: ITara) => {
    if (boxingsLine.some((box) => box.tarakey === item.id)) {
      const idx = state.boxingsLine
        ? state.boxingsLine.findIndex(
            (bLine) => bLine.docId === route.params.docId && bLine.lineDoc === route.params.lineId,
          )
        : -1;
      const idxl = idx > -1 ? state.boxingsLine[idx].lineBoxings.findIndex((bLine) => bLine.tarakey === item.id) : -1;
      const updateBoxings =
        idxl > -1
          ? [...state.boxingsLine[idx].lineBoxings.slice(0, idx), ...state.boxingsLine[idx].lineBoxings.slice(idx + 1)]
          : state.boxingsLine
          ? [...(state.boxingsLine ? state.boxingsLine[idx].lineBoxings : [])]
          : [];
      const newBoxingsLine = {
        docId: route.params.docId,
        lineDoc: route.params.lineId,
        lineBoxings: updateBoxings,
      };
      const updateBoxingsLine =
        idx === -1
          ? state.boxingsLine
            ? [...state.boxingsLine, newBoxingsLine]
            : [newBoxingsLine]
          : [...state.boxingsLine.slice(0, idx), newBoxingsLine, ...state.boxingsLine.slice(idx + 1)];
      actions.setBoxingsLine(updateBoxingsLine);
    } else {
      navigation.navigate('BoxingDetail', {
        boxingId: item.id,
        lineId: route.params.lineId,
        prodId: route.params.prodId,
        docId: route.params.docId,
        modeCor: route.params.modeCor,
      });
    }
  };

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
        onChangeText={setValue}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={true}
        value={value}
        style={{
          backgroundColor: colors.card,
        }}
      />

      <View style={[localeStyles.areaChips, { borderColor: colors.border }]}>
        <Text style={[localeStyles.subdivisionText, { color: colors.primary }]}>Тары: </Text>
        <List.AccordionGroup>
          <List.Accordion title="Ящики" id="1">
            <ListChips
              data={state.boxings ? state.boxings.filter((item) => item.type === 'box') : []}
              onPress={onPress}
              selected={boxingsLine}
            />
          </List.Accordion>
          <List.Accordion title="Бумага" id="2">
            <ListChips
              data={state.boxings ? state.boxings.filter((item) => item.type === 'paper') : []}
              onPress={onPress}
              selected={boxingsLine}
            />
          </List.Accordion>
          <List.Accordion title="Поддоны" id="3">
            <ListChips
              data={state.boxings ? state.boxings.filter((item) => item.type === 'pan') : []}
              onPress={onPress}
              selected={boxingsLine}
            />
          </List.Accordion>
        </List.AccordionGroup>
      </View>
    </View>
  );
});

export { SellProductDetailScreen };

const localeStyles = StyleSheet.create({
  areaChips: {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 10,
  },
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
  flatContaner: {
    margin: 20,
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
  listContainer: {
    borderRadius: 6,
    flexBasis: 100,
    marginLeft: 0.5,
    marginTop: 10,
  },
  margin: {
    margin: 2,
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
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 25,
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
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subdivisionText: {
    fontSize: 11,
    marginBottom: 5,
    textAlign: 'left',
  },
  taraContanerView: {
    backgroundColor: '#fff',
    borderRadius: 4,
    flexBasis: 145,
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 3,
    marginVertical: 3,
    minWidth: 120,
    padding: 15,
  },
  title: {
    padding: 10,
  },
});