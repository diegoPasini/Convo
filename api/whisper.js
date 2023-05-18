import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "@env";
const samantha = require("./samantha.mp3")
import * as FileSystem from 'expo-file-system';

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

  const filename = req.filename || '';
//   const audio_file = readFile(filename)

  console.log("filename: " + filename)
  if (audio_file) {
    console.log("Audio exists")
  } else {
    console.log("Audio does not exist")
    return
  }

  try {
    // console.log("pre fetch")
    // blob = await fetch(filename)
    // console.log("past fetch")
    console.log(samantha)
    // const data = await FileSystem.readAsStringAsync("file://test.txt")
    const transcript = await openai.createTranscription(samantha, "whisper-1")
    // res.message = transcript.data.text
    res.message = "test"
    console.log("Response: " + res.message)
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
  return res;
}

function generatePrompt(prompt) {
  const capitalizedAnimal =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();
  return `Respond to this message in conversation

Message: Hi, how are you?
Response: Great, thanks! How was your day yesterday?
Message: ${capitalizedAnimal}
Response:`;
}


export default transcribeAudio;