import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { blockStyles } from './blockStyles';

const MAX_BLUR = 100;
const MIN_BLUR = 0;
const hiddenText = "Toca para revelar"

export class AiBlock extends Component {


    constructor(props) {
        super(props);
        this.text = props.text
        this.toggleHidden = this.toggleHidden.bind(this)
        this.state = {
            displayedText: (props.hideResponse == true) ? hiddenText: this.text,
            textStyle: (props.hideResponse == true) ? aiStyles.hiddenText: aiStyles.noStyle,
        }
    }

    toggleHidden() {
        console.log("pressed")
        this.setState({
            displayedText: (this.state.displayedText == hiddenText) ? this.text : hiddenText,
            textStyle: (this.state.displayedText == hiddenText) ? aiStyles.noStyle : aiStyles.hiddenText
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.toggleHidden()}>

                <View style={[blockStyles.conversationBlock, aiStyles.aiResponse]}>
                    <Text style={blockStyles.conversationAuthor}>Gabriela P. Toro:</Text>
                    <Text style={[blockStyles.conversationText, this.state.textStyle]}>{this.state.displayedText}</Text>
                </View>
            </TouchableOpacity>
    )}
}

const aiStyles = StyleSheet.create({
    aiResponse: {
        backgroundColor: "#d2d3d4",

    },
    
    hiddenText: {
        // fontSize:10,
        // width:"100%",
        // borderColor:"red",
        // borderWidth:4,
        textAlign:"center",
    },

    // viewBlur: {
    //     height: 3,
    //     width: 70,
    //     shadowOpacity: 1,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 10, height: 10 },
    //     shadowRadius: 5,
    //     elevation: 5,
    //     borderWidth: 0.5,
    //     borderColor: "white",
    //     backgroundColor: "rgba(255, 255, 255, 1)"
    //   },

    noStyle: {},
})

AiBlock.propTypes = { text: PropTypes.string.isRequired, hideResponse: PropTypes.bool.isRequired }