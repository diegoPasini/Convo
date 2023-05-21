import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView } from 'react-native';
import { generateConvoResponse, generateMessageCorrection } from './api/gpt';
import transcribeAudio from './api/whisper';
import { TEST_VAR } from "@env";
import "react-native-url-polyfill/auto"
import { Audio } from "expo-av";
import * as Speech from 'expo-speech';



export default function App() {

	const [recording, setRecording] = useState();
	const [latestUri, setLatestUri] = useState();

	const [isSending, setSendingStatus] = useState(false);
	const [recordingState, setRecordingState] = useState("none")
	// const [conversationBlocks, setBlocks] = useState([]);
	const [conversationBlocks, setBlocks] = useState([])
	const blockList = useRef([])
	const [messageHistory, setMessageHistory] = useState({
		system:
		{
			role: "system",
			content: "Vas a hablar SOLO en español con el user y continuar la conversación. Responde en 15 palabras o menos"
		},
		chatHistory: [],
		latest: {},
	})

	useEffect(() => {
		console.log("changed")
		console.log(blockList.current)
		setBlocks(blockList.current)
		console.log("after")
	}, [blockList.current])

	const scrollViewRef = useRef();

  async function getGPTResponse(promptInput) {

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
	Speech.stop()
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
    try {
      const response = await transcribeAudio({uri: uri})
      const data = await response;
      if (response == undefined) {
        throw new Error("Audio request failed")
      }
	
	  return data.text
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  	async function speakResponse(text) {
		Speech.speak(text);
	}

	async function onSendRecording(event) {
		event.preventDefault()
		console.log("getting audio")
		console.log(blockList.current)
		setSendingStatus(true);
		if (recording) {
			uri = await stopRecording()
			audioTranscript = await getAudioTranscript(uri);
		} else {
			audioTranscript = await getAudioTranscript();
		}
		// setTranscript(audioTranscript)
		userBlockId = blockList.current.length
		aiBlockId = userBlockId + 1
		userBlock = createUserBlock(audioTranscript, userBlockId)
		blockList.current = [...blockList.current, userBlock]
		setBlocks(blockList.current)

		response = await getGPTResponse(audioTranscript)
		aiBlock = createAIBlock(response, aiBlockId)
		blockList.current = [...blockList.current, aiBlock]

		correctedUserBlock = await getCorrectedUserBlock(audioTranscript, userBlockId)
		blockList.current[userBlockId] = correctedUserBlock

		await speakResponse(response);
		// setLatestUri(undefined) // remove previous recording
		setRecordingState("none")
		setSendingStatus(false)
	}

	async function onRecordPressed(event) {
		if (recording == undefined) {
			startRecording()
		} else {
			stopRecording()
		}
	}

	async function getCorrectedUserBlock(transcript, id) {
		correction = await generateMessageCorrection(transcript)
		if (correction.isCorrect) {
			correctedUserBlock = createUserBlock(transcript, id, "correct") 
		} else {
			correctedUserBlock = createUserBlock(transcript, id, "incorrect")
		}
		return correctedUserBlock
	}

  return (
    <View style={styles.container}>
		<View style={styles.titleContainer}>
			<Text style={styles.title}>Paja</Text>
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
    </View>
  );
}

function createUserBlock(text, key, correctness = "unknown") {
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
	return (
		<View key={key} style={[styles.conversationBlock, styles.userInput, {borderColor: color}]}>
			<Text style={styles.label}>You:</Text>
			<Text style={styles.result}>{text}</Text>
		</View>
	)
}

function createAIBlock(text, key) {
	return (
	<View key={key} style={[styles.conversationBlock, styles.aiResponse]}>
		<Text style={styles.label}>Gabriela P. Toro:</Text>
		<Text style={styles.result}>{text}</Text>
	</View>
	)
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

  conversationBlock: {
	borderColor: "black",
	borderWidth: 3,
	marginBottom:10,
	minHeight: 100,
	flexDirection:"column",
    justifyContent: "space-evenly",
	borderRadius:25,
	padding:10
	
  },

  paddingView: {
	height:10,
  },

  userInput: {
	backgroundColor: "#4f95db"
  },

  aiResponse: {
	backgroundColor: "#d2d3d4"
  },

  label: {

  },

  result: {
	color:"black",
	fontSize:20
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
