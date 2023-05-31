import { ConvoPageStyleSheetheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';

import {SettingsPageStyleSheet} from './SettingsPageStyleSheet'


export default function SettingsPage({navigation}) {
    return(
        <SafeAreaView style={SettingsPageStyleSheet.container}>
            <View style={SettingsPageStyleSheet.titleContainer}>
                <Text style={SettingsPageStyleSheet.title}>
                    Settings
                </Text>
            </View>
            <View style={SettingsPageStyleSheet.flagsView}>
                
            </View>
            <View style={SettingsPageStyleSheet.exitButtonContainer}>
                <TouchableOpacity style={SettingsPageStyleSheet.exitButton} onPress={()=>{navigation.navigate('ConvoPage')}}>
                    <Text style={SettingsPageStyleSheet.exitButtonText}>Exit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

