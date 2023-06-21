
import { useEffect, useState, useRef, useCallback } from "react";
import { KeyboardAvoidingView, ConvoPageStyleSheetheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import "react-native-url-polyfill/auto"
import './prompts/generalizedPrompts.json'
import './prompts/appText.json'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
import { LoginPageStyleSheet } from "./LoginPageStyleSheet";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";



SplashScreen.preventAutoHideAsync();

export default function LoginPage({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const auth = getAuth()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.navigate("HomePage")
            }
        })
        return unsubscribe
    }, [])

    const handleSignUp = () =>{
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.email)
        })
        .catch(error => alert(error.message));
    }
    
    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user
            console.log("Logged in with", user.email)
        })
        .catch(error => alert(error.message))
    }

    const [fontsLoaded] = useFonts({
        'NotoSans': require('./assets/fonts/NotoSans-Regular.ttf'),
        'NotoSansBold': require('./assets/fonts/NotoSans-Regular.ttf'),
      });
    
      const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
    
      if (!fontsLoaded) {
        return null;
      }

    

    return (
	
    <KeyboardAvoidingView style={LoginPageStyleSheet.container} onLayout={onLayoutRootView}>
        <Text style = {LoginPageStyleSheet.title}>Login Page</Text>
        <View style = {LoginPageStyleSheet.inputContainer}>
            <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style = {[LoginPageStyleSheet.input, LoginPageStyleSheet.inputOutline]}
            />
            <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style = {[LoginPageStyleSheet.input, LoginPageStyleSheet.inputOutline]}
            secureTextEntry 
            />
        </View>

        <View style={LoginPageStyleSheet.buttonContainer}>
        <TouchableOpacity style = {LoginPageStyleSheet.button} onPress={() => {handleLogin();}}>
            <Text style = {LoginPageStyleSheet.buttonText}>Login</Text> 
        </TouchableOpacity>

        <TouchableOpacity style = {[LoginPageStyleSheet.registerButton, LoginPageStyleSheet.buttonOutline]} onPress={() => {handleSignUp(); 
        console.log("pressed");}}>
            <Text style = {LoginPageStyleSheet.registerButtonText}>Register</Text>  
        </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
}