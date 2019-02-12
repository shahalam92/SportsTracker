import React,{Component} from 'react';
import {View,Text,StyleSheet,Animated,Image} from 'react-native';
export default class Intro extends Component {
    static navigationOptions = { header: null }
    state = {
      springVal: new Animated.Value(0.8),
      fadeVal: new Animated.Value(1)
    };
   constructor(props){
      super(props); 
   }
    componentDidMount() {
      setTimeout(() => this.spring(), 2000);
      setTimeout(()=>{
              this.props.navigation.navigate('Login')
          },3500)
      
    }
    spring() {
      Animated.sequence([
        Animated.spring(this.state.springVal, {
          toValue: 0.6,
          friction: 7,
          tension: 20
        }),
        Animated.parallel([
          Animated.spring(this.state.springVal, {
            toValue: 17.5,
            friction: 7,
            tension: 5
          }),
          Animated.timing(this.state.fadeVal, {
            toValue: 0,
            duration: 500
          })
        ])
      ]).start();
    }
  
    render() {
      return (
        <View style={styles.wrapper}>
          <View style={styles.center}>
            <Animated.View
                 animation="pulse" easing="ease-out" iterationCount="infinite"
              style={{
                resizeMode: 'stretch',
                opacity: this.state.fadeVal,
                transform: [{ scale: this.state.springVal }]
              }}
            >
              <Image
          source={require('../Images/sportsSplash.png')}
          style={{ }}
         />
         
            </Animated.View>
          </View>
        </View>
      );
    }
  }
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // backgroundColor: "dodgerblue"
    backgroundColor: "#713D94"
  },
  center: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  introText: {
    fontSize: 50,
    color: "black",
    fontWeight: "bold"
  }
});