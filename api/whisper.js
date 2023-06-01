import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "@env";
const samantha = require("./samantha.mp3")
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
	
	try {
		response = await whisperFetch(uri, prompts)
		// console.log(response)
		resJson = await response.json()
		console.log(resJson)
		return resJson;
	} catch(error) {
	  // Consider adjusting the error handling logic for your use case
	  if (error.response) {
		console.error(error.response.status, error.response.data);
		res.status(error.response.status).json(error.response.data);
	  } else {
		console.error(`Error with OpenAI API request: ${error.message}`);
	  }
	}
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
	formData.append("language", prompts.whisperLanguage)

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




// used for testing -- recreates an audio file from a base64 string and plays it
async function recreateAndPlay(base64) {
    const newUri = FileSystem.cacheDirectory + "samantha2.mp3"
    await FileSystem.writeAsStringAsync(newUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
    });

    console.log("newUri = " + newUri)
    const sound = new Audio.Sound()
    await sound.loadAsync({uri: newUri})
    await sound.playAsync();
}



export default transcribeAudio;