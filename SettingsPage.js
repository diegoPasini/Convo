import { Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import { useEffect, useState, useCallback } from 'react';

import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
import {SettingsPageStyleSheet} from './SettingsPageStyleSheet'


SplashScreen.preventAutoHideAsync();


export default function SettingsPage({navigation}) {
    const[language, setLanguageVar] = useState(global.language)
    
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


    function setLanguage(language){
        if(global.language !== language){
             global.language = language;
             setLanguageVar(global.language);
        }
    }

    return(
        <SafeAreaView style={SettingsPageStyleSheet.container} onLayoutRootView={onLayoutRootView}>
            <View style={SettingsPageStyleSheet.titleContainer}>
                <TouchableOpacity style={SettingsPageStyleSheet.backIcon} onPress={()=>{console.log("Pressed");
                    navigation.navigate('ConvoPage')}}>
                    <Image source={require('./assets/BackIcon.png')}  style={SettingsPageStyleSheet.backIcon} />
                </TouchableOpacity>
                <Text style={SettingsPageStyleSheet.title}>
                    {global.appText.settingsTitle}
                </Text>
            </View>
            <View style={SettingsPageStyleSheet.descriptionContainer}>
                <Text style={SettingsPageStyleSheet.descriptionText}>
                    Pick a language then use the back button in the top left
                    {'\n'}Scroll down for more language options.
                </Text>
            </View>
            <ScrollView style={SettingsPageStyleSheet.langugeSelector}>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Spanish")}}>
                    <Image source={require('./assets/SpanishFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>{global.appText.spanishText}</Text>
                    {(global.language === 'Spanish') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("French")}}>
                    <Image source={require('./assets/FrenchFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>{global.appText.frenchText}</Text>
                    {(global.language === 'French') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("English")}}>
                    <Image source={require('./assets/AmericanFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Image source={require('./assets/EnglishFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>{global.appText.englishText}</Text>
                    {(global.language === 'English') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Mandarin")}}>
                    <Image source={require('./assets/ChineseFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>{global.appText.mandarinText}</Text>
                    {(global.language === 'Mandarin') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Hebrew")}}>
                    <Image source={require('./assets/IsraeliFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>{global.appText.hebrewText}</Text>
                    {(global.language === 'Hebrew') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Korean")}}>
                    <Image source={require('./assets/KoreanFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>{global.appText.koreanText}</Text>
                    {(global.language === 'Korean') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Russian")}}>
                    <Image source={require('./assets/RussianFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>{global.appText.russianText}</Text>
                    {(global.language === 'Russian') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
            </ScrollView>
            {/* <View style={SettingsPageStyleSheet.exitButtonContainer}>
                <TouchableOpacity style={SettingsPageStyleSheet.exitButton} onPress={()=>{navigation.navigate('ConvoPage')}}>
                    <Text style={SettingsPageStyleSheet.exitButtonText}>{global.appText.settingsClose}</Text>
                </TouchableOpacity>
            </View> */}
        </SafeAreaView>
    );
}

