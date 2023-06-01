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
                // position: 'absolute',
        // top: 20,
        // left: 20,
        paddingTop: 40,
        
    },

    title:{
        fontSize:50,
        textAlign: 'center',
    },

    languageSelector:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        
        // position: 'absolute',
        // top: 20,
        // left: 20,
    },

    languageButton:{
        flexDirection: 'row',
        borderColor: "black",
	    borderRadius: 30,
        borderWidth: 3,
        marginTop: 20,
        height: 100,
        width: 325,
        //color:'#f2f2f2',
        marginLeft: 20,
    },
    
    flag:{
	    resizeMode: "contain",
        marginTop: -5,
    },

    languageSelectionText:{
        marginLeft: 25,
        marginTop: 23,
        fontSize: 30,
        color: 'black',
    },

    overlay:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 255, 0.25)',
        borderRadius: 24,
        
    },

    exitButtonContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 200,
    },
    
    exitButton:{
        marginTop: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 3,
        backgroundColor: 'gray',
    },

    exitButtonText:{
        fontSize: 30,
        textAlign: 'center',
    },
});


