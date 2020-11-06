import { useTheme, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import { IGoodGroup } from '../../../../../common/base';
import { DocumentStackParamList } from '../../../navigation/DocumentsNavigator';
import { useAppStore } from '../../../store';

const GoodGroupListScreen = () => {
  const route = useRoute<RouteProp<DocumentStackParamList, 'GoodGroupList'>>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { state } = useAppStore();
  const groups = state.references?.goodgroups?.data as IGoodGroup[];

  return (
    <View style={[localStyles.content, { backgroundColor: colors.card }]}>
      <ScrollView>
        <List.AccordionGroup>
          {groups
            .filter((group) => !group.parent)
            .map((group) => (
              <List.Accordion
                id={group.id}
                key={group.id}
                title={group.name ?? ''}
                style={{ backgroundColor: colors.background }}
              >
                {groups
                  .filter((item) => group.id === item.parent)
                  .map((item) => (
                    <List.Item
                      key={item.id}
                      title={item.name ?? ''}
                      onPress={() => navigation.navigate('GoodList', { docId: route.params?.docId, group: item.id })}
                      style={localStyles.item}
                    />
                  ))}
              </List.Accordion>
            ))}
        </List.AccordionGroup>
      </ScrollView>
    </View>
  );
};

export { GoodGroupListScreen };

const localStyles = StyleSheet.create({
  content: {
    height: '100%',
  },
  item: {
    marginLeft: 15,
  },
});
