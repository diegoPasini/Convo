
![image](https://github.com/diegoPasini/ISP/assets/74738050/cc57dd38-b6eb-40c2-92cd-5ad0f2bb44e8)

# Convo

An AI powered Language Tutor

## What is Convo?

Currently, online language learning apps are great for improving writing, listening, and reading skills. Learning fluent conversational speaking, alone, however, is extremely difficult. It requires knowing someone who is a fluent speaker and can correct your grammar or hiring a tutor which is expensive. 

Convo aims to solve this issue by using generative AI to simulate a conversational language tutor. Currently Convo supports speaking in Spanish, French, English, Mandarin, Hindi, Hebrew, Korean, Russian, and Japanese.
## How does Convo Work?
An interaction with Convo works in four steps. 
1. The User speaks to Convo in the language they are trying to learn, and their message is transcribed. 
2. Convo generates a response based on the users message and previous messages in the conversation.
3. Convo's response is synthesized with text to speech and played for the user. 
4. The user's message is evaluated for grammar errors or context errors. 
5. The corrections for the user's speech are shown to the user. 


Below are real-time screenshots from Convo showing the steps.

This app was built on top of [React native](https://reactnative.dev/) using the [OpenAI](https://openai.com/blog/openai-api)  and [Google Cloud API](https://cloud.google.com/products?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-e-dr-1605212&utm_content=text-ad-none-any-DEV_c-CRE_665735422238-ADGP_Hybrid%20%7C%20BKWS%20-%20MIX%20%7C%20Txt_Google%20Products%20General-KWID_43700077225654147-kwd-28389832413&utm_term=KW_google%20cloud%20api-ST_google%20cloud%20api&gclid=Cj0KCQjw9MCnBhCYARIsAB1WQVWKjGDLxga6jqZLE3SpP2iPu6fVFlI-G8bVziRFBhdl4ylLGP5NsocaAoz3EALw_wcB&gclsrc=aw.ds). To transcribe the text, OpenAI's [Whisper model](https://openai.com/research/whisper) was used. This allows for high consistency within speech transcription and modularity for adding new languages. After transcribing the text, the conversation history and tuned prompting is sent to Open AI's GPT 3.5 DaVinci model to generate a reponse. Google Cloud's text to speech api is then used to generate a realistic sounding voice to respond to the user. Simultaenously, the message is sent to GPT 3.5 prompting it to generate corrections based on a set of examples. If the message is gramatically incorrect, Convo will display the corrections to the user. 

## Run Locally

Clone the project

```bash
  git clone https://github.com/diegoPasini/ISP
```

Install Expo Go on your mobile device

Install dependencies with npm

```
npm install
```

Create a .env file and add in your OpenAI API key and your Google TTS API key
```
TTS_KEY = ...
OPENAI_API_KEY = ...
```

Run the expo project and try Convo on your mobile device!
## Support

For support, please email dpasini@seas.upenn.edu or otaylor@stanford.edu.

