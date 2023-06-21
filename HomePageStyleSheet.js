import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, StatusBar, Pressable } from 'react-native';


export const HomePageStyleSheet = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection:"column",
		margin:0,
		padding:0,
    },

    title:{
        fontSize: 20,
    },

    buttonContainer:{
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    button:{
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonOutline:{
        backgroundColor: 'white',
        marginTop: 5,
    },

    buttonText:{
        color: "white",
        fontWeight: '700',
        fontSize: 16,
    }
});