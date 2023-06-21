import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConvoPage from './ConvoPage';
import SettingsPage from './SettingsPage'
import HomePage from './HomePage'
import LoginPage from './LoginPage';
import './global.js'
import { initializeApp } from 'firebase/app';

const Stack = createNativeStackNavigator();

export default function App() {
	const firebaseConfig = {
        apiKey: "AIzaSyAQ-iN0n8U5LbFTX0orq_8W1l8co4WcrmE",
        authDomain: "convo-914a5.firebaseapp.com",
        projectId: "convo-914a5",
        storageBucket: "convo-914a5.appspot.com",
        messagingSenderId: "795495671938",
        appId: "1:795495671938:web:2f3696838ed72201adec9b",
        measurementId: "G-T8VZNEXMNJ"
      };
      
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
	return(
		<NavigationContainer>
			<Stack.Navigator screenOptions = {{headerShown: false}}>
				<Stack.Screen name = "HomePage" component = {HomePage}/>
				<Stack.Screen name = "ConvoPage" component = {ConvoPage} />
				<Stack.Screen name = "LoginPage" component = {LoginPage}/>
				<Stack.Screen name = "SettingsPage" component = {SettingsPage} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}