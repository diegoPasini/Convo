import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable, StatusBar } from 'react-native';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const buttonHeight = windowHeight*.1
const imagePad = windowHeight*.04
const buttonSeparation = 0
// percents should add to 1
const titleHeight = Math.floor(windowHeight * .1)
const convoHeight = Math.floor(windowHeight * .7)
const buttonBarHeight = Math.floor(windowHeight * .15)

export const ConvoPageStyleSheet = StyleSheet.create({

  	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection:"column",
		margin:0,
		padding:0,
		// paddingTop: StatusBar.currentHeight,
		// borderColor: "red",
		// borderWidth: 3,
  	},

  	titleContainer: {
		width:"100%",
		height:"10%",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: 'row-reverse',
		margin:0,
		padding:0,
		marginTop: StatusBar.currentHeight,
		// borderColor: "red",
		// borderWidth: 1,
		
	},

	settingsButtonContainer:{
		height: "100%",
		position: 'absolute',
		left:10,
		alignContent:"center",
		justifyContent: "center",
	},
	
	settingsButton:{
		height: 30,
		width: 30,
		
		//flex: 1,

	},

	title: {
		fontSize:40,
		// alignSelf: 'center',
		// marginRight: 80
	},

  	convoWrapper: {
		width:"100%",
		height:"75%",
		borderBottomWidth: 2,
		borderTopWidth: 2,
		borderColor:"gray",
  	},

	conversationContainer: {
		width:"100%",
		//paddingHorizontal:10,
		//paddingBottom:40,
		//paddingTop:10,
		overflow: "hidden",
	},


  paddingView: {
	height:10,
  },

  userInput: {
	//backgroundColor: "#daf3ff"
  },

  bottomBar: {
	width: "100%",
	alignItems: 'center',
	flexDirection:"row",
    justifyContent: "space-evenly",
	height: buttonBarHeight,
	// borderColor:"red",
	// borderWidth:1,
	padding:0,
	margin:0,
  },


  iconButton: {
	height:buttonHeight,
	width:buttonHeight,
	alignItems: 'center',
    justifyContent: 'center',
	backgroundColor: "white",
	borderColor: "black",
	borderWidth: 3,
	borderRadius: buttonHeight/2,
	// marginBottom:15,
  },

  img: {
	flex: 1,
	width: buttonHeight-imagePad,
	height: undefined,
	resizeMode: "contain"
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