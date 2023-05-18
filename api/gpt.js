import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "@env";


const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateResponseText = async (req) =>  {
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

  const prompt = req.prompt || '';
  console.log("prompt: " + prompt)
  if (prompt.trim().length === 0) {
    console.warn("Please enter a valid prompt")
    return;
  } else {
    console.log("Worked")
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(prompt),
      temperature: 0.6,
    });
    res.message = completion.data.choices[0].text
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


export default generateResponseText;