import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "@env";

const trailingMessage = " (Responde en menos de 35 palabras y hazme una pregunta)"

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const numSavedMessages = 4

export const generateConvoResponse = async (req) =>  {

	if (!configuration.apiKey) {
		console.warn("No API key")
		return;
	}

	const prompt = req.prompt || '';
	var messages = req.messages;
	console.log("prompt: '" + prompt + "'")
	if (prompt == "" || prompt.trim().length === 0) {
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
		console.log("message history:")
		console.log(messageHistory)
		const completion = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messageHistory,
			temperature: 1,
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
	console.log("length")
	console.log(messages.chatHistory.length)
	if (messages.chatHistory.length > 0) {
		// remove trailing message at end of previous prompt
		// -2 because user messages are every other
		messages.chatHistory[messages.chatHistory.length-2].content = (messages.chatHistory[messages.chatHistory.length-2].content).replace(trailingMessage, "") 
	}
	newMessage = {"role": "user", "content": prompt + trailingMessage}
	if (messages.chatHistory.length == 0) {
		newHistory = [newMessage]
	} else {
		history = messages.chatHistory.slice(Math.max(messages.chatHistory.length - numSavedMessages, 0))
		newHistory = [...history, newMessage]
	}
	messages.chatHistory = newHistory
}

function getMessageHistory(messages) {
	if (messages.system != undefined)
		return [messages.system, ...messages.chatHistory]
	else
		return messages.chatHistory
}

export const generateMessageCorrection = async (message) => {

	if (message.length == 0) {
		console.warn("Invalid message for correction")
		return;
	} else {
		console.log("Valid correction message")
	}

	// response = await getAdaResponse(message)

	response = await getGPTTurboResponse(message)
	// result2 = completion.data.choices[1].message.content
	// response2 = extractResponse(result2)
	
	// console.log("CORRECTION 2")
	// console.log(result2)


	console.log("is 1 correct: " + response.isCorrect)

	// finalResponse = response1.isCorrect ? response2 : response1


	return response
	
}

function extractResponse(result) {
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

	// remove tabs

	correction = correction.replaceAll('\t', "")

	console.log(is_correct)
	console.log(correction)
	return {"isCorrect": is_correct, "correction": correction}
}

async function getGPTTurboResponse(message) {
	const prompt = `If the message has no grammar mistakes, respond 1. If not, respond 0 and correct each mistake. Spelling, accent, and punctuation errors do not count.

Examples:
User: "Anoche yo fue a la fiesta con mis amigos. Estábamos bailando y cantamos mucho. Cuando la música empezó, yo saltar y grité de emoción. Espero que tú va a venir a la próxima fiesta también."
Tu:
0
Listo de errores:
- "Anoche yo fue" -> "Anoche yo fui" (preterite tense)
- "cantamos mucho" -> "cantamos mucho" (correct)
- "yo saltar y grité" -> "yo salté y grité" (preterite tense)
- "Espero que tú va" -> "Espero que tú vengas" (subjunctive present tense)

User: Como fue tu dia?
Tu:
1

User: "Ayer yo vio una película en el cine. La película era muy interesante y yo gusta mucho. Si yo tuviera más tiempo, yo va a verla otra vez. Ojalá que el próximo fin de semana yo vaya al cine con mis amigos."

Tu:
0
Listo de errores:
- "yo vio" -> "yo vi"
- "yo gusta mucho" -> "me gustó mucho" (preterite tense)
- "yo va a verla" -> "la volvería a ver" (conditional tense)
- "Ojalá que" -> "Ojalá" (subjunctive mood)
- "yo vaya" -> "vaya yo" (subjunctive mood) 

User: "${message}"

Tu:`

	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			{role: "user", "content": prompt}
		],
		max_tokens: 200,
		temperature: 0.5,
		n: 1,
	});
	// console.log("full response")
	// console.log(completion)
	// result1 = (completion.data.choices[0].text).trim()
	// result2 = (completion.data.choices[1].text).trim()
	result = (completion.data.choices[0].message.content).trim()
	console.log("gpt result:")
	console.log(result)
	response = extractResponse(result)
	return response
}

async function getGPT3Response(message) {
	const prompt = `If the message has no grammar mistakes, respond 1. If not, respond 0 and correct each mistake.

	Examples:
	User: "Anoche yo fue a la fiesta con mis amigos. Estábamos bailando y cantamos mucho. Cuando la música empezó, yo saltar y grité de emoción. Espero que tú va a venir a la próxima fiesta también."
	Tu:
	"0
	Listo de errores:
	- 'Anoche yo fue' -> 'Anoche yo fui' (preterite tense)
	- 'cantamos mucho' -> 'cantamos mucho' (correct)
	- 'yo saltar y grité' -> 'yo salté y grité' (preterite tense)
	- 'Espero que tú va' -> 'Espero que tú vengas' (subjunctive present tense)"

	User: "Como fue tu dia?"
	Tu:
	1

	User: "Ayer yo vio una película en el cine. La película era muy interesante y yo gusta mucho. Si yo tuviera más tiempo, yo va a verla otra vez. Ojalá que el próximo fin de semana yo vaya al cine con mis amigos."

	Tu:
	"0
	Listo de errores:
	- 'yo vio' -> 'yo vi'
	- 'yo gusta mucho' -> 'me gustó mucho' (preterite tense)
	- 'yo va a verla' -> 'la volvería a ver' (conditional tense)
	- 'Ojalá que' -> 'Ojalá' (subjunctive mood)
	- 'yo vaya' -> 'vaya yo' (subjunctive mood)"
	
	User: "Cuando yo era niño, siempre jugaba con mis amigos en el parque. Mi mamá siempre me dice que estudie mucho para obtener buenas notas en la escuela. Si yo estudiar más, habría obtenido mejores calificaciones. Pero, a veces, yo no hizo mi tarea a tiempo. Mis amigos y yo nos encanta ir a la playa durante el verano. Es tan divertido nadar y tomar el sol. Me gustaría que el verano durar para siempre."

	Tu:
	"0
	Listo de errores:
	- 'Si yo estudiar más' -> 'Si yo hubiera estudiado más' (past subjunctive)
	- 'yo no hizo' -> 'yo no hice' (preterite tense)
	- 'Mis amigos y yo nos encanta' -> 'A mis amigos y a mí nos encanta' (subject-verb agreement)
	- 'Me gustaría que el verano durar para siempre' -> 'Me gustaría que el verano durara para siempre' (subjunctive)"

	User: "${message}"

	Tu:`

	const completion = await openai.createCompletion({
		model: "text-curie-001",
		prompt:prompt,
		max_tokens: 200,
		temperature: 1,
		n: 5,
	});
	console.log("full response")
	// console.log(completion)
	// result1 = (completion.data.choices[0].text).trim()
	// result2 = (completion.data.choices[1].text).trim()
	resultList = (completion.data.choices).map((choice) => choice.text)
	console.log("ada result list:")
	console.log(resultList)
	resultList = resultList.map((v) => extractResponse(v))
	finalResult = resultList.find((result) => !result.isCorrect) // get one that says the message is wrong
	if (finalResult == undefined) {
		finalResult = resultList[0]
	}
	console.log("ada final result")
	console.log(finalResult)
	return finalResult
} 