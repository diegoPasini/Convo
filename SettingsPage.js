import { Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import { useState } from 'react';

import {SettingsPageStyleSheet} from './SettingsPageStyleSheet'


export default function SettingsPage({navigation}) {
    const [spanishShowView, setShowViewSpanish] = useState(global.language === 'Spanish');
    const [frenchShowView, setShowViewFrench] = useState(global.language === 'French');
    const [englishShowView, setShowViewEnglish] = useState(global.language === 'English');

    function setLanguage(language){
        if(global.language !== language){
            global.language = language
        }
        console.log("Language " + global.language)
        
        if(global.language === 'Spanish'){
            setShowViewSpanish(true) 
            setShowViewEnglish(false)
            setShowViewFrench(false)   
        }
        else if(global.language === 'French'){
            setShowViewSpanish(false) 
            setShowViewEnglish(false)
            setShowViewFrench(true)   
        }
        else if(global.language === 'English'){
            setShowViewSpanish(false) 
            setShowViewEnglish(true)
            setShowViewFrench(false)   
        }
    }

    return(
        <SafeAreaView style={SettingsPageStyleSheet.container}>
            <View style={SettingsPageStyleSheet.titleContainer}>
                <Text style={SettingsPageStyleSheet.title}>
                    Settings
                </Text>
            </View>
            <View style={SettingsPageStyleSheet.langugeSelector}>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Spanish")}}>
                    <Image source={require('./assets/Spanish.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>Spanish</Text>
                    {spanishShowView && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("French")}}>
                    <Image source={require('./assets/French.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>French</Text>
                    {frenchShowView && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("English")}}>
                    <Image source={require('./assets/English.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>English</Text>
                    {englishShowView && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
            </View>
            <View style={SettingsPageStyleSheet.exitButtonContainer}>
                <TouchableOpacity style={SettingsPageStyleSheet.exitButton} onPress={()=>{navigation.navigate('ConvoPage')}}>
                    <Text style={SettingsPageStyleSheet.exitButtonText}>Exit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

