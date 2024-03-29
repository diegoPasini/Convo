import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, StatusBar, Pressable } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const titleHeight = Math.floor(windowHeight * .1)

export const SettingsPageStyleSheet = StyleSheet.create({
    container: {
		// flex: 1,
		// backgroundColor: '#fff',
		// //alignItems: 'center',
		// //justifyContent: 'center',
		// flexDirection:"column",
		// margin:0,
		// padding:0,

        flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection:"column",
		margin:0,
		padding:0,
        

  	},

    titleContainer:{
		width:"100%",
		height:"10%",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: 'row-reverse',
		margin:0,
		padding:0,
		marginTop: StatusBar.currentHeight,
        borderColor: "gray",
		borderBottomWidth: 2,
    },

    backIconContainer: {
        height: "100%",
		position: 'absolute',
		right:20,
		alignContent:"center",
		justifyContent: "center",
        // borderColor: "red",
		// borderWidth: 1,
    },

    backIcon:{
        // position: 'absolute',
        // left: 10,
        // resizeMode: "contain",
        // width: 50,
        // top:10, 
        // paddingVertical: 30,
        // paddingHorizontal: 20,
		height: 40,
		width: 40,
    },

    title:{
        fontSize:40,
        textAlign: 'center',
        fontFamily: "NotoSans",
    },

    descriptionContainer:{
        // position: 'absolute',
        // top: 20,
        // left: 20,
        //paddingTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: "90%",
        marginLeft: 20,
        height:"15%",
    },
    
    descriptionText:{
        fontSize: 16,
        fontFamily: "NotoSans",
        textAlign: 'center',
    },

    languageSelectorContainer: {
        width:"100%",
        height:"75%",
        borderColor: "gray",
		borderTopWidth: 2,
        borderBottomWidth:2,
        // borderColor: "blue",
		// borderWidth: 1,
        
    },

    languageSelector:{
        flex: 1,
        // flexDirection: 'column',
        overflow: "hidden",
        // justifyContent: 'space-evenly',
        // alignItems: 'center',
        // position: 'absolute',
        // top: 20,
        // left: 20,
        // borderColor: "red",
		// borderWidth: 3,
        width:"100%",
        paddingHorizontal:"2%",
    },

    languageButton:{
        flexDirection: 'row',
        borderColor: "black",
	    borderRadius: 30,
        borderWidth: 2,
        marginTop: 20,
        height: 50,
        width: "100%",
        //color:'#f2f2f2',
        // marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    

    flag:{
        position: 'absolute',
	    resizeMode: "contain",
        width: 50,
        left: 20,
        alignContent: 'flex-start',
    },

    languageSelectionText:{
        fontSize: 25,
        color: 'black',
        textAlign: 'center',
        fontFamily: "NotoSans",
        
    },

    overlay:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
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


