import React,{Component} from 'react';
import {Text,StyleSheet} from 'react-native';

export default class ErrorText extends Component{
    render(){
        return(
            <Text style={styles.textStyle}>
                {this.props.errorText}
                </Text>
        )
    }
}
const styles=StyleSheet.create({
    textStyle:{
        color:'#ffffff'
        ,fontSize:14
    }
})