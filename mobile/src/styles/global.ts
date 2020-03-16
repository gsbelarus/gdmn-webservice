import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		padding: 15,
	},
	rectangularButton: {
		marginVertical: 15,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
	},
	circularButton: {
		borderRadius: 50,
		borderWidth: 1,
		height: 50,
		width: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		marginTop: 15,
		padding: 10,
		fontSize: 18,
		height: 50,
	},
	buttonText:{
		fontSize: 18,
	},
});
