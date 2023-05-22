import { Platform } from 'react-native';
import { Audio } from 'expo-av';
//import * as React from 'react';
import * as FileSystem from 'expo-file-system';
import {KEY_IOS, KEY_ANDROID} from "@env"




export const speech  = async (text) => {
  console.log("Started")
  const key = Platform.os == 'ios' ? KEY_IOS : KEY_ANDROID
  //bearer = 'Bearer ' + KEY_ANDROID
  const address = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`
  const payload = createRequest(text)
  //Integrate with expo
  const path = FileSystem.cacheDirectory + "voice1.mp3"

  try{
    console.log(text)
    const response = await fetch(`${address}`, payload)
    console.log("Fetched API")
    const result = await response.json()
    console.log(result)
    await recreateAndPlay(path,result.audioContent)
    console.log("Done")

  } catch (err){
    console.warn(err)
  }
}

/**
 * Method with the request sent to google cloud's api 
 * @param {*} text The text that the text to speech model will say 
 * @returns Returns null 
 */
const createRequest = (text) => ({
  method: 'POST',
  //File type is in json
  headers: {
    'Content-Type': 'application/json'
  },

  //Will say the inputed text
  body: JSON.stringify({
   input: {
     text: text,
   },

  //Specifying the type of voice and langage
  voice:{
    languageCode: 'es-ES',
    name: 'es-ES-Wavenet-D',
    ssmlGender: 'FEMALE'
  },

  //type of audio file
  audioConfig:{
    audioEncoding: 'MP3',
  }
  
  })
  
})

//const RNFS = require('react-native-fs')

// used for testing -- recreates an audio file from a base64 string and plays it
async function recreateAndPlay(path, base64) {
  const newUri = path
  await FileSystem.writeAsStringAsync(newUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
  });

  console.log("newUri = " + newUri)
  const sound = new Audio.Sound()
  await sound.loadAsync({uri: newUri})
  await sound.playAsync();
}