import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import generateResponseText from './api/gpt';
import transcribeAudio from './api/whisper';
import { TEST_VAR } from "@env";
import "react-native-url-polyfill/auto"


export default function App() {

  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState("Result");

  const [transcript, setTranscript] = useState("Transcript");

  async function onSubmit(event) {
    console.log("Submitted")
    console.log("text input: " + promptInput)
    event.preventDefault();


    try {

      const response = await generateResponseText({prompt: promptInput})

      const data = await response;
      if (response == undefined) {
        throw new Error(`Request failed`);
      }

      setResult(data.message);
      // setPromptInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function onSubmitAudio(event) {
    console.log("Audio submitted")
    audio_file = "samantha.mp3"
    event.preventDefault()

    try {
      const response = await transcribeAudio({filename: audio_file})
      const data = await response;
      if (response == undefined) {
        throw new Error("Audio request failed")
      }

      setTranscript(data.message)
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>

      <TextInput style={styles.testInput}
        placeholder="Type a response"
        onChangeText={(e) => setPromptInput(e)}
        value = {promptInput}
      />
      <Button style={styles.button} title="Submit" onPress={onSubmit}/>
      <Text style={styles.result}>{result}</Text>
      <Button style={styles.button} title="Transcribe audio" onPress={onSubmitAudio}/>
      <Text style={styles.result}>{transcript}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
  }

});
