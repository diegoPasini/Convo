import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';


export const blockStyles = StyleSheet.create({
  conversationBlock: {
	borderColor: "black",
	borderWidth: 3,
	marginBottom:10,
	minHeight: 100,
	flexDirection:"column",
    // justifyContent: "space-evenly",
	borderRadius:25,
	padding:10
	
  },
  conversationText: {
	color:"black",
	fontSize:20,
	marginTop:10,
	marginBottom:5,
  },

  conversationAuthor: {
	position:"relative",
	top:0,
  },

})