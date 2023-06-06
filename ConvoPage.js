
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef, useCallback } from "react";
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
import './prompts/appText.json'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync();

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
    const [firstInSentence, setFirstCorrectionInSentence] = useState(false)
    const [parsedMessage, setParsedMessage] = useState("")
    const micIcon = require('./assets/icons/mic.png')
    const arrowIcon = require('./assets/icons/arrow.png')
    const [centerButtonImg, setCenterButtonImg] = useState(micIcon)
    //console.log(prompts.Spanish);
    //const promptsLanguage ={};\
    //console.log(global.language)
    //console.log(global.language === "English")
    prompts = require('./prompts/generalizedPrompts.json')

    switch (global.language) {
        case "Spanish":
            promptsLanguage = prompts.spanish
            break;
        case "French":
            promptsLanguage = prompts.french
            break;
        case "English":
            promptsLanguage = prompts.english
            break;
        case "Mandarin":
            promptsLanguage = prompts.mandarin
            break;
        case "Hebrew":
            promptsLanguage = prompts.hebrew
            break;
        case "Korean":
            promptsLanguage = prompts.korean
            break;
        case "Russian":
            promptsLanguage = prompts.russian
            break;
        case "Hindi":
            promptsLanguage = prompts.hindi
            break;
        case "Japanese":
            promptsLanguage = prompts.japanese
            break;
        default:
            promptsLanguage = prompts.spanish
            break;
    }

    appLanguages = require('./prompts/appText.json')
    switch (global.appLanguage) {
        case "English":
        default:
            global.appText = appLanguages.english
    }
    
    
    //console.log(promptsLanguage[0]["ttsName"])
    //console.log(promptsLanguage['ttsName'])
    //console.log("Reinstructing", promptsLanguage[0]["systemInstruction"])
    const [messageHistory, setMessageHistory] = useState({
        system:
        {
            role: "system",
            content: promptsLanguage.systemInstruction
        },
        chatHistory: [],
        latest: {},
    })
    
    
    const scrollViewRef = useRef();
    const correctionList = useRef({})

    const [fontsLoaded] = useFonts({
        'NotoSans': require('./assets/fonts/NotoSans-Regular.ttf'),
        'NotoSansBold': require('./assets/fonts/NotoSans-Regular.ttf'),
      });
    
      const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
    
      if (!fontsLoaded) {
        return null;
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

    async function stopRecording(cancelled = false) {
        console.log('Stopping recording..');
        setRecording(undefined);
        setRecordingState("recorded")
        if (cancelled) {
            setCenterButtonImg(micIcon)
            setRecordingState("none")
        }
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        setLatestUri(uri)
        console.log('Recording stopped and stored at', uri);
        return uri;
    }

    async function getGPTResponse(promptInput) {
        console.log("input gpt")
        console.log(messageHistory)
        const response = await generateConvoResponse({prompt: promptInput, messages: messageHistory}, promptsLanguage)

        const data = await response;
        if (response == undefined) {
            throw new Error(`Request failed`);
        }
        setMessageHistory(response)
        return (data.latest).trim() //remove whitespace
        // setPromptInput("");
    }

    async function getAudioTranscript(inputUri = undefined) {
        console.log("Audio submitted")

        uri = inputUri ? inputUri : latestUri
        const response = await transcribeAudio({uri: uri}, promptsLanguage)
        const data = await response;
        if (response == undefined) {
            throw new Error("Audio request failed")
        }

        return data
    }

    async function speakResponse(text) {
        textToSpeech(text, promptsLanguage);
    }

    

    async function sendRecording(isRetry = false) {
        try {
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
            setCenterButtonImg(micIcon)

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
            correctionList.current[userBlockId] = {correction: correction.correction, message: audioTranscript}
        } catch (error) {
            if (!isRetry) {
                try {
                    console.log("Retrying...")
                    sendRecording(true)
                } catch {
                    console.error(error);
                    alert(error.message);
                }
            } else {
                console.error(error);
                alert(error.message);
            }

		}
		

    }


    async function onRecordPressed(event) {
        if (recording == undefined) {
            startRecording()
            setCenterButtonImg(arrowIcon)
        } else {
            sendRecording()
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
                color = "gray"
                break;
        }
        if (correctness == "incorrect") {
            return (
                <TouchableOpacity 
                    key={key} 
                    onPress={() => onUserBlockPressed(key, correctness)}
                    style={[blockStyles.conversationBlock, ConvoPageStyleSheet.userInput]}>
                    <View style={blockStyles.authorContainer}>
                        <View style={[blockStyles.userIcon, , {backgroundColor: color}]}></View>
                        <Text style={[blockStyles.conversationAuthor, {fontFamily: "NotoSans",}]}>{global.appText.userTitle}</Text>
                    </View>
                    <Text style={[blockStyles.conversationText, {fontFamily: "NotoSans",}]}>{text}</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View 
                    key={key} 
                    style={[blockStyles.conversationBlock, ConvoPageStyleSheet.userInput]}>
                    <View style={blockStyles.authorContainer}>
                        <View style={[blockStyles.userIcon, , {backgroundColor: color}]}></View>
                        <Text style={[blockStyles.conversationAuthor, {fontFamily: "NotoSans",}]}>{global.appText.userTitle}</Text>
                    </View>
                    <Text style={[blockStyles.conversationText, {fontFamily: "NotoSans",}]}>{text}</Text>
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
        originalMessage = correctionList.current[key].message
        if (correctness == "incorrect") {
            console.log("Message", correctionList.current[key].message)
            const pattern = /- "([^"]*)"/g;
            const matches = correctionList.current[key].correction.match(pattern);
            console.log("Matches, ", matches)
            console.log("original message", originalMessage)
            const newList = [];
            if (matches) {
                const extractedText = matches.map(match => match.replace(/- "|"/g, ''));
                console.log("Extracted Text,", extractedText);
                setFirstCorrectionInSentence(false)
                console.log("Extracted Text Length,", extractedText.length)
                console.log("original message", originalMessage)
                for(let i = 0; i < extractedText.length; i++){
                    const str = extractedText[i]
                    index = originalMessage.indexOf(str)
                    
                    const beforeString = <Text style={{color:'black'}}>{originalMessage.substring(0, index)}</Text>
                    newList.push(beforeString)
                    newList.push(<Text style={{color:'red'}}>{originalMessage.substring(index, index + str.length)}</Text>)
                    originalMessage = originalMessage.substring(index+str.length)
                }   
                
            }  
            newList.push( <Text style={{color:'black'}}>{originalMessage}</Text>)          
            console.log("Fragmented Sentence")
            console.log(originalMessage)
            setParsedMessage(newList)
            
            setMessageCorrection(correctionList.current[key].correction)
            setModalVisible(true)
        }
    }
    
    

    // useEffect(()=> {
    //     if(global.language === "Spanish")
    //         promptsLanguage = prompts.Spanish
    //     else if(global.language === "French")
    //         promptsLanguage = prompts.French
    //     else if(global.language === "English")
    //         promptsLanguage = prompts.English
    //     setBlocks([])
    //     setMessageHistory({system:
    //         {
    //             role: "system",
    //             content: promptsLanguage[0]["systemInstruction"]
    //         },
    //         chatHistory: [],
    //         latest: {},})
    // }, []);

    return (
	
    <SafeAreaView style={ConvoPageStyleSheet.container} onLayout={onLayoutRootView}>

		<Modal visible={modalVisible} style={ConvoPageStyleSheet.modal}>
				<View style={ConvoPageStyleSheet.correctionPopup}>
					<Text style={ConvoPageStyleSheet.correctionTitle}>{global.appText.correctionsTitle}</Text>
                    <Text style={ConvoPageStyleSheet.originalMessage}>{parsedMessage}</Text>
					<Text style={ConvoPageStyleSheet.correctionBody}>{messageCorrection}</Text>
					<Pressable style={ConvoPageStyleSheet.modalButton} onPress={() => setModalVisible(false)}>
						<Text>{global.appText.settingsClose}</Text>
					</Pressable>
				</View>
		</Modal>
		
		<View style={ConvoPageStyleSheet.titleContainer}>
            <TouchableOpacity style={ConvoPageStyleSheet.settingsButtonContainer} onPress={()=>{navigation.navigate('SettingsPage')}}>
				<Image source={require('./assets/icons/settings.png')}  style={ConvoPageStyleSheet.settingsButton} />
			</TouchableOpacity>
			<Text style={ConvoPageStyleSheet.title}>{global.appText.appTitle}</Text>
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
            {recordingState == "recording" ? (<TouchableOpacity style={[ConvoPageStyleSheet.iconButton, ConvoPageStyleSheet.cancelButtonContainer]} onPress={() => stopRecording(true)}>
				<Image source={require('./assets/icons/x_icon.png')}  style={[ConvoPageStyleSheet.img, ConvoPageStyleSheet.cancelButtonImg]} />
			</TouchableOpacity>) : null
            }
			<TouchableOpacity style={[ConvoPageStyleSheet.iconButton, ConvoPageStyleSheet.micButton((recordingState))]} onPress={onRecordPressed}>
				<Image source={centerButtonImg}  style={ConvoPageStyleSheet.img} />
			</TouchableOpacity>
		</View>
		

    	<StatusBar style="auto" />
    </SafeAreaView>
  );
}