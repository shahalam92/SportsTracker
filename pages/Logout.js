import React,{Component} from 'react';
import {View,Text,AsyncStorage} from 'react-native';
import Login from './Login';
// import Intercom from 'react-native-intercom';
export default class Logout extends Component{
    constructor(props){
        super(props);
        AsyncStorage.removeItem('ACCESS_TOKENS');
        this.props.navigation.navigate('Login')
        // Intercom.reset();
    }
    render(){
        return(
            <View></View>
        )
    }
}