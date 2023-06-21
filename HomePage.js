
import { useEffect, useState, useRef, useCallback } from "react";
import { ConvoPageStyleSheetheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import "react-native-url-polyfill/auto"
import './prompts/generalizedPrompts.json'
import './prompts/appText.json'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
import { HomePageStyleSheet } from './HomePageStyleSheet';
import { getAuth } from "firebase/auth";


SplashScreen.preventAutoHideAsync();

export default function HomePage({navigation}) {
    const auth = getAuth();
    const user = auth.currentUser;
    const email = '';
    if (user !== null) {
        const email = user.email;
    }
    const [fontsLoaded] = useFonts({
        'NotoSans': require('./assets/fonts/NotoSans-Regular.ttf'),
        'NotoSansBold': require('./assets/fonts/NotoSans-Regular.ttf'),
      });
    
      const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
    
      if (!fontsLoaded) {
        return null;
      }

    return (
	
    <SafeAreaView style={HomePageStyleSheet.container} onLayout={onLayoutRootView}>
        <Text style = {HomePageStyleSheet.title}>Email {email}</Text>
        <View style = {HomePageStyleSheet.buttonContainer}>
        <TouchableOpacity style = {HomePageStyleSheet.button} onPress={() => {navigation.navigate("LoginPage");
        console.log(user.email)}}>
            <Text style = {HomePageStyleSheet.buttonText}>Login Page</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}