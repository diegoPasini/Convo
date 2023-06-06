import { Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';

import {SettingsPageStyleSheet} from './SettingsPageStyleSheet'


export default function SettingsPage({navigation}) {
    const[language, setLanguageVar] = useState(global.language)


    function setLanguage(language){
        if(global.language !== language){
             global.language = language;
             setLanguageVar(global.language);
        }
    }

    return(
        <SafeAreaView style={SettingsPageStyleSheet.container}>
            <View style={SettingsPageStyleSheet.titleContainer}>
                <Text style={SettingsPageStyleSheet.title}>
                    {global.settingsTitle}
                </Text>
            </View>
            <ScrollView style={SettingsPageStyleSheet.langugeSelector}>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Spanish")}}>
                    <Image source={require('./assets/SpanishFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>Spanish</Text>
                    {(global.language === 'Spanish') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("French")}}>
                    <Image source={require('./assets/FrenchFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>French</Text>
                    {(global.language === 'French') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("English")}}>
                    <Image source={require('./assets/AmericanFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Image source={require('./assets/EnglishFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>English</Text>
                    {(global.language === 'English') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Mandarin")}}>
                    <Image source={require('./assets/ChineseFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>Spanish</Text>
                    {(global.language === 'Mandarin') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Hebrew")}}>
                    <Image source={require('./assets/IsraeliFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>French</Text>
                    {(global.language === 'Hebrew') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Korean")}}>
                    <Image source={require('./assets/KoreanFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>English</Text>
                    {(global.language === 'Korean') && <View style={SettingsPageStyleSheet.overlay}/>}
                </TouchableOpacity>
                <TouchableOpacity style={SettingsPageStyleSheet.languageButton} onPress={()=>{setLanguage("Russian")}}>
                    <Image source={require('./assets/RussianFlag.png')}  style={SettingsPageStyleSheet.flag} />
                    <Text style={SettingsPageStyleSheet.languageSelectionText}>English</Text>
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

