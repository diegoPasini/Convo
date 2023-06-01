import { Configuration, OpenAIApi } from "openai";
import { DEEPGRAM_KEY } from "@env";
const samantha = require("./samantha.mp3")
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Audio } from "expo-av";
import { Buffer, Blob } from 'buffer';
import {decode as atob, encode as btoa} from 'base-64'


const configuration = new Configuration({
  apiKey: DEEPGRAM_KEY,
});
const openai = new OpenAIApi(configuration);

export const transcribeAudio = async (req) =>  {
	if (!configuration.apiKey) {
		console.warn("No API key")
		return;
	}

	const uri = req.uri || '';
	if (!uri) {
		console.error("Audio does not exist")
		return
	}
	
	response = await makeFetchRequest(uri)
	// console.log(response)
	resJson = await response.json()
	// console.log(resJson)
	if (response.status != 200) {
		throw new Error(`Error with Deepgram request: ${resJson.err_code} - ${resJson.err_msg}`)
	}


	transcript = resJson.results.channels[0].alternatives[0].transcript
	console.log("Transcript: " + transcript)
	return transcript;
}


async function makeFetchRequest(uri) {
	model = "general"
	var url = `https://api.deepgram.com/v1/listen?model=${model}`;
	var bearer = 'Token ' + DEEPGRAM_KEY

	const [{ localUri }] = await Asset.loadAsync(
		    require("./samantha.mp3")
		);
	
	base64 = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 })
	// console.log(base64.substr(0, 10))
	leadingStr = "data:audio/mpeg;name=samantha.mp3;base64,"
	fullBase64 = leadingStr + base64
	console.log(fullBase64)
	// fetchedUri = await fetch(uri)
	// blob = fetchedUri.blob()

	const options = {
		method: "POST",
		headers: {
			Authorization: bearer,
			'content-type': "application/json"
		},
		body: JSON.stringify({
			// RAW_BODY: fullBase64
			raw_body: ""
		})
	}

	const formData = new FormData()
	// formData.append('RAW_BODY', blob, "audio-file.m4a");

	formData.append("model", "nova");
	formData.append("language", "es")

	raw_body = {
		uri: uri,
		type: 'audio/mp4',
		name: 'audio.m4a'
	}



	result = await fetch(url, options)
// 	await fetch(url, {
// 		method: 'POST',
// 		headers: {
// 				"Authorization": bearer,
// 				"accept": 'application/json',
// 				"Content-Type": "audio/m4a"
// 		},
// 		body: base64
// })

	return result
}






export default transcribeAudio;