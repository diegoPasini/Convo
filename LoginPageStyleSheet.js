import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, StatusBar, Pressable } from 'react-native';


export const LoginPageStyleSheet = StyleSheet.create({
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

    inputContainer:{
        marginTop:10,
        width: '80%',
        
    },

    input:{
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5, 
        //alignItems: 'center',
        //textAlign: 'center',
    },
    
    inputOutline:{
        borderColor: "black",
        //marginTop: 20,
        borderWidth: 2,
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
        marginTop: 20,
        alignItems: 'center',
    },

    registerButton:{
        backgroundColor: 'white',
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
    },

    buttonOutline:{
        borderColor: "#0782F9",
        marginTop: 20,
        borderWidth: 2,
    },

    registerButtonText:{
        color: "black",
        fontWeight: '700',
        fontSize: 16,
    }
});