import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import { generateConvoResponse, generateMessageCorrection } from './api/gpt';
// import transcribeAudio from './api/whisper';
import transcribeAudio from './api/deepgram';
import "react-native-url-polyfill/auto"
import { Audio } from "expo-av";
import Modal from "react-native-modal";
import { AiBlock } from './components/blocks';
import { blockStyles } from './components/blockStyles';
import { textToSpeech } from './api/TextToSpeech';

export default function App() {
	const hideAIResponse = false;
	const [recording, setRecording] = useState();
	const [latestUri, setLatestUri] = useState();

	const [isSending, setSendingStatus] = useState(false);
	const [recordingState, setRecordingState] = useState("none")
	// const [conversationBlocks, setBlocks] = useState([]);
	const [conversationBlocks, setBlocks] = useState([])
	const blockList = useRef([])
	const [modalVisible, setModalVisible] = useState(false);
	const [messageCorrection, setMessageCorrection] = useState("")
	const [messageHistory, setMessageHistory] = useState({
		system:
		{
			role: "system",
			content: "Vas a hablar SOLO en español como un amigo"
		},
		chatHistory: [],
		latest: {},
	})

	// useEffect(() => {
	// 	console.log("changed")
	// 	console.log(blockList.current)
	// 	setBlocks(blockList.current)
	// 	console.log("after")
	// }, [blockList.current])

	const scrollViewRef = useRef();
	const correctionList = useRef({})
	

  async function getGPTResponse(promptInput) {

	if (promptInput == undefined) {
		throw new Error("Missing prompt input")
	}

    try {
	
		const response = await generateConvoResponse({prompt: promptInput, messages: messageHistory})

		const data = await response;
		if (response == undefined) {
			throw new Error(`Request failed`);
		}
		setMessageHistory(response)
		return (data.latest).trim() //remove whitespace
		// setPromptInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function startRecording() {
	// Speech.stop()
    try {
      setRecordingState("recording")
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    setRecordingState("recorded")
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setLatestUri(uri)
    console.log('Recording stopped and stored at', uri);
    return uri;
  }

  async function getAudioTranscript(inputUri = undefined) {
    console.log("Audio submitted")
    
    uri = inputUri ? inputUri : latestUri
	const response = await transcribeAudio({uri: uri})
	const data = await response;
//   if (response.status != 200) {
//     throw new Error("Audio request failed")
//   }
	
	return data
  }

  	async function speakResponse(text) {
		textToSpeech(text);
	}

	

	async function onSendRecording(event) {

		try {
			event.preventDefault()
			setSendingStatus(true);
			if (recording) {
				uri = await stopRecording()
				audioTranscript = await getAudioTranscript(uri);
			} else {
				audioTranscript = await getAudioTranscript();
			}
			console.log("out of audio")
			// setTranscript(audioTranscript)
			userBlockId = blockList.current.length
			aiBlockId = userBlockId + 1
			userBlock = createUserBlock(audioTranscript, userBlockId)
			blockList.current = [...blockList.current, userBlock]
			setBlocks(blockList.current)

			response = await getGPTResponse(audioTranscript)
			aiBlock = createAIBlock(response, aiBlockId)
			blockList.current = [...blockList.current, aiBlock]
			setBlocks(blockList.current)

			await speakResponse(response);
			// setLatestUri(undefined) // remove previous recording
			setRecordingState("none")
			setSendingStatus(false)

			correction = await generateMessageCorrection(audioTranscript)
			correctedUserBlock = await getCorrectedUserBlock(audioTranscript, correction.isCorrect, userBlockId)
			blockList.current = blockList.current.map((v, i) => {
				if (i == userBlockId) {
					return correctedUserBlock;
				} else {
					return v;
				}
			});

			setBlocks(blockList.current)
			console.log("correction")
			console.log(correction.correction)
			correctionList.current[userBlockId] = correction.correction
		} catch (error) {
			console.error(error);
      		alert(error.message);
		}
		


	}
	

	async function onRecordPressed(event) {
		if (recording == undefined) {
			startRecording()
		} else {
			stopRecording()
		}
	}

	async function getCorrectedUserBlock(transcript, isCorrect, id) {
		if (transcript == undefined) {
			throw new Error("Missing audio transcript")
		} else if (id == undefined) {
			throw new Error("Missing corrected user block key")
		}
		if (isCorrect) {
			correctedUserBlock = createUserBlock(transcript, id, "correct") 
		} else {
			correctedUserBlock = createUserBlock(transcript, id, "incorrect")
		}
		return correctedUserBlock
	}


	

	function createUserBlock(text, key, correctness = "unknown") {
		if (text == undefined) {
			throw new Error("Missing audio transcript")
		} else if (key == undefined) {
			throw new Error("Missing user block key")
		}

		switch (correctness) {
			case "correct":
				color = "green"
				break;
			case "incorrect":
				color = "red"
				break;
			default:
				color = "black"
				break;
		}
		if (correctness == "incorrect") {
			return (
				<TouchableOpacity 
					key={key} 
					onPress={() => onUserBlockPressed(key, correctness)}
					style={[blockStyles.conversationBlock, styles.userInput, {borderColor: color}]}>
					<Text style={blockStyles.conversationAuthor}>You:</Text>
					<Text style={blockStyles.conversationText}>{text}</Text>
				</TouchableOpacity>
			)
		} else {
			return (
				<View 
					key={key} 
					style={[blockStyles.conversationBlock, styles.userInput, {borderColor: color}]}>
					<Text style={blockStyles.conversationAuthor}>You:</Text>
					<Text style={blockStyles.conversationText}>{text}</Text>
				</View>
			)
		}
		
	}

	function createAIBlock(text, id) {
		if (text == undefined) {
			throw new Error("Missing AI response text")
		} else if (id == undefined) {
			throw new Error("Missing AI block key")
		}
		console.log("id: " + id)
		return (
			<AiBlock text={text} key={id} hideResponse={hideAIResponse}/>
		)
	}
	

	const onUserBlockPressed = (key, correctness) => {
		console.log("Block pressed")
		if (correctness == "incorrect") {
			setMessageCorrection(correctionList.current[key])
			setModalVisible(true)
		}
	}

  return (
	
    <SafeAreaView style={styles.container}>

		<Modal visible={modalVisible} style={styles.modal}>
				<View style={styles.correctionPopup}>
					<Text style={styles.correctionTitle}>Corrección de mensaje</Text>
					<Text style={styles.correctionBody}>{messageCorrection}</Text>
					<Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
						<Text>Close</Text>
					</Pressable>
				</View>
		</Modal>
		
		<View style={styles.titleContainer}>
			<Text style={styles.title}>Convo</Text>
		</View>



		<View style={styles.convoWrapper}>
			<ScrollView
				style={styles.conversationContainer} 
				ref={scrollViewRef}
				onContentSizeChange={
					() => scrollViewRef.current.scrollToEnd({animated: true})}>
				{ conversationBlocks }
				<View style={styles.paddingView}></View>
			</ScrollView> 
		</View>
		

		<View style={styles.bottomBar}>
			<TouchableOpacity style={[styles.iconButton, styles.micButton((recordingState))]} onPress={onRecordPressed}>
				<Image source={require('./assets/mic.png')}  style={styles.img} />
			</TouchableOpacity>
			<TouchableOpacity style={[styles.iconButton, styles.sendButton(isSending)]} onPress={onSendRecording}>
				<Image source={require('./assets/arrow.png')}  style={styles.img} />
			</TouchableOpacity>
		</View>
		

    	<StatusBar style="auto" />
    </SafeAreaView>
  );
}


buttonHeight = 80
imagePad = 30
buttonSeparation = 0

const styles = StyleSheet.create({

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
		// flex:1,
	},

	correctionTitle: {
		fontSize:20,
		marginVertical:20,
		// bottom:"10%"
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
		height:100,
		marginTop:30,
		alignItems: 'center',
		justifyContent: 'center',
		// borderBottomWidth: 10,
		// borderColor:"black",
  	},

	title: {
		fontSize:50,
	},

  	convoWrapper: {
		width:"100%",
		height:"65%",
		borderBottomWidth: 10,
		borderTopWidth: 10,
		borderColor:"black",
  	},

	conversationContainer: {
		width:"100%",
		paddingHorizontal:10,
		paddingBottom:40,
		paddingTop:10,
		// marginBottom:10,
		// paddingVertical:20,
		// borderWidth:10,
		// borderColor:"red",
		overflow: "hidden",
	},


  paddingView: {
	height:10,
  },

  userInput: {
	backgroundColor: "#4f95db"
  },



 



  bottomBar: {
	// borderTopWidth: 10,
	// borderColor: "black",
	width: "100%",
	alignItems: 'center',
	flexDirection:"row",
    justifyContent: "space-evenly",
	// flex:1,
	height: buttonHeight+100,
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
	// aspectRatio: 1,
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
