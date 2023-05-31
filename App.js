import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConvoPage from './ConvoPage';
import SettingsPage from './SettingsPage'

const Stack = createNativeStackNavigator();

export default function App() {
	return(
		<NavigationContainer>
			<Stack.Navigator screenOptions = {{headerShown: false}}>
				<Stack.Screen name = "ConvoPage" component = {ConvoPage} />
				<Stack.Screen name = "SettingsPage" component = {SettingsPage} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}