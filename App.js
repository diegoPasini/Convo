import * as React from 'react';
import { ConvoPageStyleSheetheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConvoPage from './ConvoPage';
import SettingsPage from './SettingsPage'
import HomePage from './HomePage'
import LoginPage from './LoginPage';
import './global.js'
import { initializeApp } from 'firebase/app';

const chatStack = createNativeStackNavigator();
function ConvoScreen() {
	return(
		<chatStack.Navigator screenOptions = {{headerShown: false}}>
			<chatStack.Screen name = "ConvoPage" component = {ConvoPage}/>
			<chatStack.Screen name = "SettingsPage" component = {SettingsPage}/>
		</chatStack.Navigator>
	); 
}


const Tab = createBottomTabNavigator();
export default function App() {
	NavigationBar.setVisibilityAsync("hidden");
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
			<Tab.Navigator 
			screenOptions = {{
				headerShown: false,
				tabBarActiveTintColor: '#0782F9',
                tabBarInactiveTintColor: 'gray',
                //Tab bar styles can be added here
                tabBarStyle:{
					paddingVertical: 5,
					//borderTopLeftRadius:15,
					borderRadius:15,
					backgroundColor:'white',
					//position:'absolute',
					height:60, 
					left: "5%",
					//right: 15,
					width: "90%",
					bottom: "1%",
					},
                tabBarLabelStyle:{paddingBottom:3},
				}
			}
			
			>
				<Tab.Screen name = "HomePage" 
				component = {HomePage}
				options ={{
					tabBarIcon:({focused}) => (
					<View style={{alignItems:"center", justifyContent: "center", top: 3,}}>	
						<Image
						source = {require('./assets/icons/home_icon.png')}
						resizeMode = "contain"
						style={{
							width: 30,
							height: 30,
							tintColor: focused ? "#0782F9" : "gray",
						}}
						/>
					</View>
					),
				}}
				/>
				<Tab.Screen name = "ConvoPage" 
				component = {ConvoScreen} 
				options ={{
					tabBarIcon:({focused}) => (
					<View style={{alignItems:"center", justifyContent: "center", top: 3,}}>	
						<Image
						source = {require('./assets/icons/speech_icon.png')}
						resizeMode = "contain"
						style={{
							width: 30,
							height: 30,
							tintColor: focused ? "#0782F9" : "gray",
						}}
						/>
					</View>
					),
				}}
				/>
				<Tab.Screen name = "LoginPage" 
				component = {LoginPage}
				options ={{
					tabBarIcon:({focused}) => (
					<View style={{alignItems:"center", justifyContent: "center", top: 3,}}>	
						<Image
						source = {require('./assets/icons/stats_icon.png')}
						resizeMode = "contain"
						style={{
							width: 30,
							height: 30,
							tintColor: focused ? "#0782F9" : "gray",
						}}
						/>
					</View>
					),
				}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
}