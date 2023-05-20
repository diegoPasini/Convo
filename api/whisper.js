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

export const transcribeAudio = async (req) =>  {
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
//   const audio_file = readFile(filename)

  console.log("uri: " + uri)
  if (uri) {
    console.log("Audio exists ")
  } else {
    console.log("Audio does not exist")
    return
  }

//   try {
    // console.log("pre fetch")
    // blob = await fetch(filename)
    // console.log("past fetch")
    // console.log(uri)
    // const data = await FileSystem.readAsStringAsync("file://test.txt")
    // const [{ localUri }] = await Asset.loadAsync(
    //     require("./samantha.mp3")
    // );

    // console.log("asset = " + await localUri)
    // "data:audio/mp3;base64," +
    // base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
		// console.log(base64.substring(0,10))
    // const buffer = Buffer.from(recordingBase64, "base64")
    // const blob = new Blob([buffer], { type:'audio/mp4' })
    // const file = new File([blob],'test.mp4', {type:'audio/mp4'})
    // blob = await createBlob(base64)
		uriFetch = await fetch(uri)
		uriBlob = await uriFetch.blob()
    console.log("blob")
    console.log(uriBlob.type)
    const file = new File([uriBlob],'test.m4a', {type: uriBlob.type})
    // const file = new File([blob], "input.wav", { type: "audio/wav" });
    console.log(file.name)
    // console.log(blob)
    // blob = base64toBlob(base64, "multipart/form-data")
    response = await whisperFetch(file)
		console.log(await response)
    console.log(await response.json())
    // return;
    

    //replay to test


    // const transcript = await openai.createTranscription(file, "whisper-1")
    
    // console.log('pls')
    return response;
    // res.message = transcript.data.text
//   }
//   catch(error) {
//     // Consider adjusting the error handling logic for your use case
//     if (error.response) {
//       console.error(error.response.status, error.response.data);
//       res.status(error.response.status).json(error.response.data);
//     } else {
//       console.error(`Error with OpenAI API request: ${error.message}`);
//     }
//   }
  return res;
}

async function createBlob(base64) {
//     const file = Buffer.from(
//         base64,
//         'base64'
//       )
// // now it is Buffer

//     // const blob = new Blob([file])
//     return new Blob()
//     return blob
    response = await (fetch("data:audio/mp3;base64," + base64))
    return response.blob()
}


async function whisperFetch(file) {
    var url = "https://api.openai.com/v1/completions";
    var bearer = 'Bearer ' + OPENAI_API_KEY

    const formData = new FormData()
		// formData.append('file', file, "file.m4a");
		formData.append("prompt", "hello");
    formData.append("model", "text-davinci-003");
		console.log(formData)
    // const header = {
    //     'Authorization': bearer,
    //     "Content-Type": "multipart/form-data"
    // }
    
    // const options = {
    //     method: 'POST',
    //     headers: header,
    //     body: form
    //   }
    // const requestOptions = {
    //   method: "POST",
    //   headers: {
    //       Authorization: `Bearer ${OPENAI_API_KEY}`,
		// 			"Content-Type": "application/json",
    //     },
    //     body: formData,
    // };
    // result = await fetch(url, requestOptions);


    result = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": "hello",
            "model": "text-davinci-003",
        })
    })

    return result
}

function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    // var slicesCount = Math.ceil(bytesLength / sliceSize);
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    // return byteArrays
    return new Blob(byteArrays, { type: contentType });
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