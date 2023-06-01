
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from "react";
import { ConvoPageStyleSheetheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import { generateConvoResponse, generateMessageCorrection } from './api/gpt';
import transcribeAudio from './api/whisper';
import "react-native-url-polyfill/auto"
import { Audio } from "expo-av";
import Modal from "react-native-modal";
import { AiBlock } from './components/blocks';
import { blockStyles } from './components/blockStyles';
import { textToSpeech } from './api/TextToSpeech';
import { ConvoPageStyleSheet } from './ConvoPageStyleSheet.js'
import './prompts/generalizedPrompts.json'
 
export default function ConvoPage({navigation}) {
    const hideAIResponse = true;
    const [recording, setRecording] = useState();
    const [latestUri, setLatestUri] = useState();

    const [isSending, setSendingStatus] = useState(false);
    const [recordingState, setRecordingState] = useState("none")
    // const [conversationBlocks, setBlocks] = useState([]);
    const [conversationBlocks, setBlocks] = useState([])
    const blockList = useRef([])
    const [modalVisible, setModalVisible] = useState(false);
    const [messageCorrection, setMessageCorrection] = useState("")
    const prompts = require('./prompts/generalizedPrompts.json');
    //console.log(prompts.Spanish);
    //const promptsLanguage ={};\
    //console.log(global.language)
    //console.log(global.language === "English")
    if(global.language === "Spanish")
        promptsLanguage = prompts.Spanish
    else if(global.language === "French")
        promptsLanguage = prompts.French
    else if(global.language === "English")
        promptsLanguage = prompts.Spanish
    
    //console.log(promptsLanguage[0]["ttsName"])
    //console.log(promptsLanguage['ttsName'])
    const [messageHistory, setMessageHistory] = useState({
        system:
        {
            role: "user",
            content: promptsLanguage[0]["systemInstruction"]
        },
        chatHistory: [],
        latest: {},
    })


    const scrollViewRef = useRef();
    const correctionList = useRef({})


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
    try {
        const response = await transcribeAudio({uri: uri}, promptsLanguage)
        const data = await response;
        if (response == undefined) {
        throw new Error("Audio request failed")
        }
        //console.log("Text: ", response.text)
        return data.text
    } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
    }
    }

    async function speakResponse(text) {
        textToSpeech(text, promptsLanguage);
    }



    async function onSendRecording(event) {
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

        correction = await generateMessageCorrection(audioTranscript, promptsLanguage)
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


    }


    async function onRecordPressed(event) {
        if (recording == undefined) {
            startRecording()
        } else {
            stopRecording()
        }
    }

    async function getCorrectedUserBlock(transcript, isCorrect, id) {
        if (isCorrect) {
            correctedUserBlock = createUserBlock(transcript, id, "correct") 
        } else {
            correctedUserBlock = createUserBlock(transcript, id, "incorrect")
        }
        return correctedUserBlock
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
        if (correctness == "incorrect") {
            return (
                <TouchableOpacity 
                    key={key} 
                    onPress={() => onUserBlockPressed(key, correctness)}
                    style={[blockStyles.conversationBlock, ConvoPageStyleSheet.userInput, {borderColor: color}]}>
                    <Text style={blockStyles.conversationAuthor}>You:</Text>
                    <Text style={blockStyles.conversationText}>{text}</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View 
                    key={key} 
                    style={[blockStyles.conversationBlock, ConvoPageStyleSheet.userInput, {borderColor: color}]}>
                    <Text style={blockStyles.conversationAuthor}>You:</Text>
                    <Text style={blockStyles.conversationText}>{text}</Text>
                </View>
            )
        }
        
    }

    function createAIBlock(text, id) {
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
	
    <SafeAreaView style={ConvoPageStyleSheet.container}>

		<Modal visible={modalVisible} style={ConvoPageStyleSheet.modal}>
				<View style={ConvoPageStyleSheet.correctionPopup}>
					<Text style={ConvoPageStyleSheet.correctionTitle}>Corrección de mensaje</Text>
					<Text style={ConvoPageStyleSheet.correctionBody}>{messageCorrection}</Text>
					<Pressable style={ConvoPageStyleSheet.modalButton} onPress={() => setModalVisible(false)}>
						<Text>Close</Text>
					</Pressable>
				</View>
		</Modal>
		
		<View style={ConvoPageStyleSheet.titleContainer}>
            <TouchableOpacity style={ConvoPageStyleSheet.settingsButton} onPress={()=>{navigation.navigate('SettingsPage')}}>
				<Image source={require('./assets/settings.png')}  style={ConvoPageStyleSheet.settingsButton} />
			</TouchableOpacity>
			<Text style={ConvoPageStyleSheet.title}>Convo</Text>
		</View>



		<View style={ConvoPageStyleSheet.convoWrapper}>
			<ScrollView
				style={ConvoPageStyleSheet.conversationContainer} 
				ref={scrollViewRef}
				onContentSizeChange={
					() => scrollViewRef.current.scrollToEnd({animated: true})}>
				{ conversationBlocks }
				<View style={ConvoPageStyleSheet.paddingView}></View>
			</ScrollView> 
		</View>
		

		<View style={ConvoPageStyleSheet.bottomBar}>
			<TouchableOpacity style={[ConvoPageStyleSheet.iconButton, ConvoPageStyleSheet.micButton((recordingState))]} onPress={onRecordPressed}>
				<Image source={require('./assets/mic.png')}  style={ConvoPageStyleSheet.img} />
			</TouchableOpacity>
			<TouchableOpacity style={[ConvoPageStyleSheet.iconButton, ConvoPageStyleSheet.sendButton(isSending)]} onPress={onSendRecording}>
				<Image source={require('./assets/arrow.png')}  style={ConvoPageStyleSheet.img} />
			</TouchableOpacity>
		</View>
		

    	<StatusBar style="auto" />
    </SafeAreaView>
  );
}