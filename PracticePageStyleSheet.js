import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, StatusBar, Pressable } from 'react-native';


export const PracticePageStyleSheet = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'flex-start',
		flexDirection:"column",
		margin:0,
		paddingTop:"5%",
    },

    titleContainer:{
        height: 75, 
        width: "100%",
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#EE4266",

    }, 

    title:{
        fontSize: 45,
        color: "white",
        fontFamily: "NotoSans",
    },

    searchBarContainer:{
        height: 40, 
        width: "100%",
        // alignItems: 'center',
        justifyContent: 'flex-start',
        //backgroundColor: "blue"
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
        fontFamily: "NotoSans",
    }
});