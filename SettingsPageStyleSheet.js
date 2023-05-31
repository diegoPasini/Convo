import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';


export const SettingsPageStyleSheet = StyleSheet.create({
    container: {
		flex: 1,
		backgroundColor: '#fff',
		//alignItems: 'center',
		//justifyContent: 'center',
		flexDirection:"column",
		margin:0,
		padding:0,
  	},

    titleContainer:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60,
        
    },

    title:{
        fontSize:50,
        textAlign: 'center',
    },

    exitButtonContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 200,
    },
    
    exitButton:{
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: 'gray',
    },

    exitButtonText:{
        fontSize: 30,
        textAlign: 'center',
    },
});


