import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "@env";


const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generateConvoResponse = async (req) =>  {

	if (!configuration.apiKey) {
		console.warn("No API key")
		return;
	}

	const prompt = req.prompt || '';
	var messages = req.messages;
	console.log("prompt: " + prompt)
	if (prompt.trim().length === 0) {
		console.warn("Please enter a valid prompt")
		return;
	} else if (messages == undefined) {
		console.warn("Please include chat history")
	} else {
		console.log("Worked")
	}

	try {
		updateMessageHistory(messages, prompt)
		messageHistory = getMessageHistory(messages)
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messageHistory,
			temperature: 0.6,
			max_tokens: 250,
		});
		responseMessage = completion.data.choices[0].message
		// if (messages.chatHistory.length == 0) {
		// 	messages.chatHistory = [userMessage, responseMessage]
		// } else {
		// 	console.log("appending")
		// 	messages.chatHistory.append(userMessage, responseMessage)
		// }
		messages.chatHistory = [...messages.chatHistory, responseMessage]
		messages.latest = responseMessage.content
		console.log("Response: " + messages.latest)
		return messages
		
  	} catch (error) {
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

function updateMessageHistory(messages, prompt) {
	newMessage = {"role": "user", "content": prompt}
	if (messages.chatHistory.length == 0) {
		newHistory = [newMessage]
	} else {
		history = messages.chatHistory.slice(Math.max(messages.chatHistory.length - 4, 0))
		newHistory = [...history, newMessage]
	}
	messages.chatHistory = newHistory
}

function getMessageHistory(messages) {
	return [messages.system, ...messages.chatHistory]
}

export const generateMessageCorrection = async (message) => {

	if (message.length == 0) {
		console.warn("Invalid message for correction")
		return;
	} else {
		console.log("Valid correction message")
	}

	const prompt = `Responde con 1 si el siguiente mensaje tiene gramática y ortografía totalmente correctas y tiene sentido.
	Si tiene alguno error, responde con 0 y en la siguiente linea, explica por qué.
	Mensaje: ${message}`

	try {
		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: prompt,
			max_tokens: 1000,
			temperature: 1,
		});
		result = completion.data.choices[0].text
		result = result.trim()
		console.log("CORRECTION")
		console.log(result)
		console.log("Char at 0 " + result.charAt(0))
		is_correct = result.charAt(0) == "1" ? true : false;
		if (!is_correct) {
			re = /[A-Z]/g
			match = re.exec(result);
			console.log(match)
			correction = result.substr(match.index)
		} else {
			correction = ""
		}
		console.log(is_correct)
		console.log(correction)

		return {"isCorrect": is_correct, "corrections": correction}

	} catch (error) {
		// Consider adjusting the error handling logic for your use case
		if (error.response) {
			console.error(error.response.status, error.response.data);
			res.status(error.response.status).json(error.response.data);
		} else {
			console.error(`Error with OpenAI API request: ${error.message}`);
		}
  	}

	
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

