import React from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native-animatable';

export default class Fail extends React.Component {
componentDidMount() {
this.animation.play();
// Or set a specific startFrame and endFrame with:
this.animation.play(30, 120);
}

render() {
return (
   
<LottieView
ref={animation => {
this.animation = animation;
}}
source={require('./x_pop.json')}

/>

);
}
}