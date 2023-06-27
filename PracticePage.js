
import { useEffect, useState, useRef, useCallback } from "react";
import { ConvoPageStyleSheetheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import "react-native-url-polyfill/auto"
import './prompts/generalizedPrompts.json'
import './prompts/appText.json'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
import { PracticePageStyleSheet } from './PracticePageStyleSheet';
import { getAuth } from "firebase/auth";
import { setStatusBarBackgroundColor, setStatusBarStyle } from 'expo-status-bar';
import SearchBar from "./SearchBar";
import { StyleSheet } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function PracticePage({navigation}) {
    const auth = getAuth();
    const user = auth.currentUser;
    const email = '';
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [fakeData, setFakeData] = useState();
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
    setStatusBarBackgroundColor("white")
    setStatusBarStyle("dark")
    return (
    <SafeAreaView style={PracticePageStyleSheet.container} onLayout={onLayoutRootView}>
        
        <View style={PracticePageStyleSheet.titleContainer}>
            <Text style = {PracticePageStyleSheet.title}>
            Practice
            </Text>
        </View>
        <View style = {PracticePageStyleSheet.searchBarContainer}>
        {/* {!clicked && <Text style={styles.title}>Programming Languages</Text>} */}
        <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked} //
        />
        </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    root: {
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      width: "100%",
      marginTop: 20,
      fontSize: 25,
      fontWeight: "bold",
      marginLeft: "10%",
    },
  });