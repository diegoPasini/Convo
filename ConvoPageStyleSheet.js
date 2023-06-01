import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';

buttonHeight = 80
imagePad = 30
buttonSeparation = 0

export const ConvoPageStyleSheet = StyleSheet.create({

  	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection:"column",
		margin:0,
		padding:0,
  	},

	modal: {
		backgroundColor: "rgba(0,0,0,0.3)",
		alignItems: 'center',
		justifyContent: 'center',
		flex:1,
		margin:0,
	},

  	correctionPopup: {
		backgroundColor: "white",
		minHeight: 200,
		width: 375,
		alignItems: 'center',
		justifyContent: "space-evenly",
		flexDirection:"column",
		borderRadius:25,
		borderColor: "black",
		borderWidth:5,
		paddingHorizontal: 20,
	},

	correctionTitle: {
		fontSize:20,
		marginVertical:20,
	},
	
	correctionBody: {
		minHeight:50,
		alignItems: 'center',
		justifyContent: "center",
	},

	modalButton: {
		backgroundColor:"#03adfc",
		borderRadius: 25,
		height:50,
		width:100,
		alignItems: 'center',
		justifyContent: "center",
		marginVertical:20,
	},


  	titleContainer: {
		width:"100%",
		height:80,
		marginTop:40,
		//justifyContent: ,
		flexDirection: 'row-reverse',
	},

	settingsButtonContainer:{
		width: 45,
		marginTop: 20,
	},
	
	settingsButton:{
		height: 35,
		width: 35,
		//flex: 1,
		marginTop: 8,
		marginRight: 7, 
		position: 'absolute',
	},

	title: {
		fontSize:50,
		alignSelf: 'center',
		marginRight: 70
	},

  	convoWrapper: {
		width:"100%",
		height:"70%",
		borderBottomWidth: 5,
		borderTopWidth: 5,
		borderColor:"black",
  	},

	conversationContainer: {
		width:"100%",
		paddingHorizontal:10,
		paddingBottom:40,
		paddingTop:10,
		overflow: "hidden",
	},


  paddingView: {
	height:10,
  },

  userInput: {
	backgroundColor: "#4f95db"
  },



  bottomBar: {
	width: "100%",
	alignItems: 'center',
	flexDirection:"row",
    justifyContent: "space-evenly",
	height: buttonHeight+50,
  },


  iconButton: {
	height:buttonHeight,
	width:buttonHeight,
	alignItems: 'center',
    justifyContent: 'center',
	backgroundColor: "white",
	borderColor: "black",
	borderWidth: 5,
	borderRadius: buttonHeight/2,
	marginLeft:buttonSeparation,
	marginRight:buttonSeparation
  },

  img: {
	flex: 1,
	width: buttonHeight-imagePad,
	height: undefined,
	resizeMode: "contain"
  },


	micButton: recordingState => (
	{
		backgroundColor: getMicColor(recordingState)
	}),

	sendButton: isSending => ({
		backgroundColor: isSending ? "#90EE90" : undefined
	}),


});

function getMicColor(recordingState) {
	switch (recordingState) {
		case "recorded":
			return "#90EE90";
		case "recording":
			return "#ffcc66"
		default:
			return undefined
	}
}