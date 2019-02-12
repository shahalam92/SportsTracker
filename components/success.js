import React from 'react';
import LottieView from 'lottie-react-native';

export default class Success extends React.Component {
componentDidMount() {
// this.animation.play();
// Or set a specific startFrame and endFrame with:
this.animation.play(30, 30);
}

render() {
return (
<LottieView
ref={animation => {
this.animation = animation;
}}
source={require('./success.json')}
/>
);
}
}