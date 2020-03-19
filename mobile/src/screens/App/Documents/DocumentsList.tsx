import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard, TextInput } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { styles } from '../../../styles/global';
import { useTheme } from '@react-navigation/native';

const DocumentsListScreen = () => {
  const { colors } = useTheme();

  return (
	<View style={styles.container} >
		<Title style={{ alignItems: 'center'}}>Documents List</Title>
	</View>
  );
};

export default DocumentsListScreen;
