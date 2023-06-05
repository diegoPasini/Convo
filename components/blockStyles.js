import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';


export const blockStyles = StyleSheet.create({
  
	conversationBlock: {
	//borderColor: "black",
	//borderWidth: 3,
	marginBottom:0,
	minHeight: 80,
	flexDirection:"column",
    // justifyContent: "space-evenly",
	//borderRadius:25,
	padding:10,
	paddingHorizontal:10,
	
  },
  conversationText: {
	color:"black",
	fontSize:17,
	marginTop:10,
	marginBottom:5,
  },

  authorContainer:{
	//flex: 1,
	flexDirection: 'row',
	//height: 50,
  },

  userIcon:{
	width: 12,
	height: 12,
	borderRadius:12/2,
	marginTop:5,
	backgroundColor: 'gray',
  },

  conversationAuthor: {
	position:"relative",
	top:0,
	marginLeft: 5,
	fontSize:15,
  },

})