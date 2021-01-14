import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Alert, Button, Text, FlatList, TouchableOpacity } from 'react-native';
import { FAB, IconButton, Searchbar } from 'react-native-paper';

import { IContact, IDocument, IDocumentStatus } from '../../../common';
import { statusColors } from '../constants';
import docStates from '../model/docStates';
import { useAppStore, useServiceStore } from '../store';
import ItemSeparator from './ItemSeparator';
import { IOption, RadioGroup } from './RadioGroup';
import RadioButton from './RadioGroup/RadioButton';

// import ContactListContainer from '../../components/contactListContainer';
import withModalProvider from './withModalProvider';

const Statuses: IDocumentStatus[] = docStates;

const DocumentItem = React.memo(({ item }: { item: IDocument }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state } = useAppStore();

  const contacts = useMemo(() => state.references?.contacts?.data as IContact[], [state.references?.contacts?.data]);

  const getContact = useCallback(
    (id: number | number[]): IContact =>
      contacts?.find((contact) => (Array.isArray(id) ? id.includes(contact.id) : contact.id === id)),
    [contacts],
  );

  const docHead = useMemo(() => item?.head, [item?.head]);
  const fromContact = useMemo(() => getContact(docHead?.fromcontactId), [docHead.fromcontactId, getContact]);
  // const toContact = useMemo(() => getContact(docHead?.tocontactId), [docHead.tocontactId, getContact]);

  const docDate = useMemo(() => new Date(item?.head?.date).toLocaleDateString('BY-ru'), [item?.head?.date]);

  const status = useMemo(() => Statuses.find((type) => type.id === item?.head?.status), [item?.head?.status]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DocumentView', { docId: item?.id });
      }}
    >
      <View style={[styles.item, { backgroundColor: colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: statusColors[item?.head?.status || 0] }]}>
          <MaterialCommunityIcons name="file-document" size={20} color={'#FFF'} />
        </View>
        <View style={styles.details}>
          <View style={styles.directionRow}>
            <Text style={[styles.name, { color: colors.text }]}>{`№ ${docHead?.docnumber} от ${docDate}`}</Text>
            <Text style={[styles.number, styles.field, { color: statusColors[item?.head?.status] }]}>
              {status ? status.name : ''}
            </Text>
          </View>
          <Text style={[styles.number, styles.field, { color: colors.text }]}>{fromContact?.name || ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const BackdropExample = () => {
  const { state: appState, actions: appActions } = useAppStore();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const ref = useRef<FlatList<IDocument>>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState(appState.documents as IDocument[]);

  const {
    apiService,
    state: { isLoading },
  } = useServiceStore();

  const radiogroup_options = [
    { id: 0, label: 'По дате (по убыванию)' },
    { id: 1, label: 'По дате (по возрастанию)' },
    { id: 2, label: 'По номеру (по убыванию)' },
    { id: 3, label: 'По номеру (по возрастанию)' },
  ];

  const [selectedOption, setSelectedOption] = useState<IOption>(radiogroup_options[0]);

  // callbacks
  const handleDismiss = useCallback(() => {
    Alert.alert('Modal Been Dismissed');
  }, []);
  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const renderItem = ({ item }: { item: IDocument }) => <DocumentItem item={item} />;

  // renders
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* <Button title="ok" onPress={handlePresentPress} /> */}
      {!isLoading && (
        <>
          <>
            <View style={styles.flexDirectionRow}>
              <Searchbar
                placeholder="Поиск по номеру"
                onChangeText={setSearchText}
                value={searchText}
                style={[styles.flexGrow, styles.searchBar]}
              />
              <IconButton icon="filter-outline" size={24} style={styles.iconSettings} onPress={handlePresentPress} />
            </View>
            <ItemSeparator />
          </>
          <FlatList
            ref={ref}
            data={data}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            scrollEventThrottle={400}
            onEndReached={() => ({})}
            ListEmptyComponent={<Text style={styles.emptyList}>Список пуст</Text>}
          />
          <FAB
            style={[styles.fabAdd, { backgroundColor: colors.primary }]}
            icon="file-plus"
            onPress={() => {
              // appActions.clearForm('DocumentEdit');
              navigation.navigate('DocumentEdit');
            }}
          />
        </>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['25%', '50%']}
        animationDuration={150}
        onDismiss={handleDismiss}
        backdropComponent={BottomSheetBackdrop}
      >
        <RadioButton
          options={radiogroup_options}
          onChange={setSelectedOption}
          activeButtonId={selectedOption?.id}
          circleStyle={{ fillColor: colors.primary }}
        />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  details: {
    margin: 8,
    marginRight: 0,
    flex: 1,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyList: {
    marginTop: 20,
    textAlign: 'center',
  },
  fabAdd: {
    bottom: 0,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  field: {
    opacity: 0.5,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexGrow: {
    flexGrow: 10,
  },
  iconSettings: {
    width: 36,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 12,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default withModalProvider(BackdropExample);
