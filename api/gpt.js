import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "@env";

const trailingMessage = " (Respond in less than 30 words)"

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
	newMessage = {"role": "user", "content": prompt + trailingMessage}
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

	const prompt = `Responde con 1 si el siguiente mensaje tiene gramática totalmente correctas y tiene sentido.
	Si tiene alguno error, responde con 0 y explica por qué con una lista con viñetas.
	Example:
	User: [Mensaje]
	Tu:
	0
	Listo de errores:
	- "frase incorrecta" -> "frase corregida"
	- "frase incorrecta" -> "frase corregida"

	User: 
	${message}

	Tu:`

	try {
		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: prompt,
			max_tokens: 1000,
			temperature: 0.5,
		});
		console.log("full response")
		console.log(completion)
		result = completion.data.choices[0].text
		result = result.trim()
		console.log("CORRECTION")
		console.log(result)

		reNum = /[01]/g
		matchNum = reNum.exec(result)
		console.log(matchNum)
		console.log("Char at matchNum " + result.charAt(matchNum.index))
		is_correct = result.charAt(matchNum.index) == "1" ? true : false;
		if (!is_correct) {
			explanation = result.substr(matchNum.index)
			reCaps = /[A-Z]/
			reNL = /\n/
			matchCaps = reCaps.exec(explanation);
			matchNewLine = reNL.exec(explanation);
			if (matchCaps && matchNewLine) {
				index = Math.min(matchCaps.index, matchNewLine.index)
			} else {
				match = matchCaps || matchNewLine
				if (match)
					index = match.index
				else
					index = 0
			}
				
			console.log(index)
			correction = explanation.substr(index).trim()
		} else {
			correction = ""
		}
		console.log(is_correct)
		console.log(correction)

		return {"isCorrect": is_correct, "correction": correction}

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

