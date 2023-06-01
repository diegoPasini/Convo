import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "@env";
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Audio } from "expo-av";
import { Buffer, Blob } from 'buffer';
import {decode as atob, encode as btoa} from 'base-64'


const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const transcribeAudio = async (req, prompts) =>  {
	res = {
		status: {
			code: 0,
			error: {
				message: "",
			}
		},
		result: ""
	}
	if (!configuration.apiKey) {
		console.warn("No API key")
		return;
	}

	const uri = req.uri || '';
	if (!uri) {
		console.error("Audio does not exist")
		return
	}
	
	response = await whisperFetch(uri, prompts)
	resJson = await response.json()
	console.log(resJson)

	if (response.status != 200) {
		throw new Error(`Error with Deepgram request: ${resJson.err_code} - ${resJson.err_msg}`)
	}
	// console.log(response)
	transcript = resJson.text
	console.log("Text: ", resJson.text)
	return transcript;
}


async function whisperFetch(uri, prompts) {
	var url = "https://api.openai.com/v1/audio/transcriptions";
	var bearer = 'Bearer ' + OPENAI_API_KEY
	const formData = new FormData()

	formData.append('file', {
		uri: uri,
		type: 'audio/mp4',
		name: 'audio.m4a'
	});

	formData.append("model", "whisper-1");
	console.log(prompts[0]["whisperLanguage"])
	formData.append("language", prompts[0]["whisperLanguage"])

	result = await fetch(url, {
		method: 'POST',
		headers: {
				'Authorization': bearer,
				"Content-Type": "multipart/form-data"
		},
		body: formData
})

	return result
}






export default transcribeAudio;