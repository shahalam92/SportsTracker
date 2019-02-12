import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert, AsyncStorage, Keyboard, KeyboardAvoidingView, BackHandler,
  NetInfo,Platform,Animated,StatusBar
} from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import ErrorText from '../components/ErrorText';
import md5 from 'md5';
import FloatingLabel from 'react-native-floating-labels';
import ShakingText from 'react-native-shaking-text';
import Success from '../components/success';
import Fail from '../components/Fail'
const window = Dimensions.get('window');
import AnimateLoadingButton from 'react-native-animate-loading-button';
// import ForgotPassword from '../ForgotPassword/ForgotPassword';
const SCREEN_WIDTH = Dimensions.get('window').width;
baseUrl = "https://api.sportstrackerapp.com/";
import style, { IMAGE_HEIGHT, IMAGE_HEIGHT_SMALL } from '../components/style';
import logo from '../Images/sport-tracker-logo_w.png';
import {addToken,addEmail,addPassword,emptyState
} from '../actions/index'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
 class Login extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {  keyboards: '', error: '', errorValue: false, status: true, showTrue: false, showTrue2: false, checkLength: 0 }
    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
  }
  componentWillMount () {
    if (Platform.OS=='ios'){
     this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
     this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }else{
     this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
     this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }
   }
  componentDidMount() {
    this.setState({ email: '' })
    this.setState({ password: '' })
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done((isConnected) => {
      this.setState({ staus: isConnected })
    })
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

  }
  handleConnectionChange = (isConnected) => {
    if (!isConnected)
      Alert.alert(
        'Connection Error',
        'Internet is not connected',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        ],
        { cancelable: false }
      )
  }
  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
    this.setState({ showWebView: false });
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  _onPressHandler() {
    this.loadingButton.showLoading(true);
    this.login();
  }
  keyboardWillShow = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT_SMALL,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT,
    }).start();
  };
  keyboardDidShow = (event) => {
    Animated.timing(this.imageHeight, {
      toValue: IMAGE_HEIGHT_SMALL,
    }).start();
  };
  keyboardDidHide = (event) => {
    Animated.timing(this.imageHeight, {
      toValue: IMAGE_HEIGHT,
    }).start();
  };
  changeText = (text) => {
    this.setState({ email: text })
    this.setState({ errorValue: false })
    var regex = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
    if (regex.test(text)) {
      this.setState({ showTrue: true })
     
    }
    else {
      this.setState({ showTrue: false })
    }
    this.props.addEmail(text);
  }

  changeText2 = (text) => {
    this.setState({ password: text })
    this.setState({ errorValue: false })
    if (text.length > 5) {
      this.setState({ showTrue2: true })
    }
    else {
      this.setState({ showTrue2: false })
    }
    this.props.addPassword(text);  
   
}
   storeToken=(accessToken)=> {
    
    this.props.addToken(accessToken);
  }
  login = () => {
    let email = this.state.email;
    let password = this.state.password;
    if ((email == "" && password == "") || (email == "" || password == "")) {
      this.state.errorValue = true;
      this.setState({ errors: 'Please fill empty fields' })
      this.loadingButton.showLoading(false);
      return false;
    }
    else {
      var regex = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
      if (!regex.test(email)) {
        this.loadingButton.showLoading(false);
        return false;
      }

    }
    password = md5(password)
    let details = {
      'email': email,
      'password': password
    }
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch('https://api.sportstrackerapp.com/auth', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.token) {
        //   Intercom.registerIdentifiedUser({ email: email })
        //   Intercom.updateUser({ email: email });
          this.storeToken(responseJson.token);
          this.props.emptyState();
          this.loadingButton.showLoading(false);
          this.props.navigation.navigate('SelectOrganisation');
        }
        else {
          this.state.errorValue = true;
          this.setState({ errors: 'Invalid Username and password' })
          this.loadingButton.showLoading(false);
        }
      })
  }
  emailError = () => {
    if (this.state.errorValue) {
      return (
        <View style={{ marginTop: 10 }}>
          <ShakingText>
            <ErrorText errorText={this.state.errors} />
          </ShakingText>
        </View>
      )
    }
  }
  showLottie = () => {
    if (!this.state.showTrue) {
      return (

        <View style={{
          width: 40, height: 40, position: 'absolute',
          top: 160, right: 10
        }}>
          <Fail /></View>
      )
    }
    else {
      <View style={{
        width: 40, height: 40, position: 'absolute',
        top: 160, right: 10
      }}>
        <Success /></View>
    }
  }
  showLottie2 = () => {

    if (!this.state.showTrue) {
      return (
        <View style={{
          width: 40, height: 40, position: 'absolute',
          top: 220, right: 10
        }}>
          <Fail/></View>
      )
    }
    else {
      <View style={{
        width: 40, height: 40, position: 'absolute',
        top: 220, right: 10
      }}>
        <Success /></View>
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'column', alignItems: 'center'}}>
          {Platform.OS=='android'?<Animated.Image source={logo} style={[style.logo, { height:this.imageHeight}]} />:  
           <Animated.Image source={logo} style={[style.logo, { height:this.imageHeight,marginTop:-70}]} />
          }
          <Text style={{ fontSize: 25, color: '#ffffff' ,marginTop:10,fontFamily:'OpenSans-light'}}>Sign in</Text>
          <FloatingLabel
            labelStyle={styles.labelInput}
            inputStyle={styles.input}
            style={styles.formInput}
            value={this.props.tokenReducer.email}
            onChangeText={text => this.changeText(text)}
          >Email</FloatingLabel>
         {/* <View style={{width:60,height:40,marginLeft:300,marginTop:-40}}>
            {this.state.showTrue == false ? this.state.email ? <Fail /> : null : <Success />}
       </View> */}
          {this.emailError()}
          <FloatingLabel
            labelStyle={styles.labelInput}
            inputStyle={styles.input}
            style={styles.formInput}
            password={true}
            value={this.props.tokenReducer.password}
            onChangeText={text => this.changeText2(text)}
          >Password</FloatingLabel>
           {/* <View style={{width:60,height:40,marginLeft:300,marginTop:-40}}>
            {this.state.showTrue2 == false ? this.state.password ? <Fail /> : null : <Success />}
      </View> */}
          <View style={{ marginTop: 30 }}>
            <AnimateLoadingButton
              ref={c => (this.loadingButton = c)}
              width={SCREEN_WIDTH - 45}
              height={50}
              title="Sign In"
              titleFontSize={18}
              titleColor="#000000"
              backgroundColor="#ffffff"
              borderRadius={5}
              fontFamily='OpenSans-Bold'
              activityIndicatorColor={"#4F2874"}
              onPress={this._onPressHandler.bind(this)}
            />
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', bottom: 5, right: 15 }}>
          <HideWithKeyboard>
            <Text style={{ fontSize: 16, color: '#ffffff'}}>Version 1.0.0</Text>
          </HideWithKeyboard>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F2874'
  },
  TextInputStyle: {
    margin: 15,
    height: 60,
    width: window.width - 50,
    borderColor: '#96969b',
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 2,
    marginBottom: -15
  },
  TextInputStyle2: {
    margin: 15,
    height: 60,
    width: window.width - 50,
    borderColor: '#96969b',
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 2,
    marginTop: 40

  },
  button: {
    backgroundColor: 'black',
    width: window.width - 50,
    height: 60,
    borderRadius: 10,
    color: "white",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
    , marginTop: 10

  },
  forgot: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  signIn: {
    fontSize: 20
  },
  labelInput: {
    color: '#ffffff',
  },
  formInput: {
    borderBottomWidth: 1.5,
    width: window.width - 50,
    borderColor: '#ffffff',
  },
  input: {
    borderWidth: 0,
    fontSize: 18,
    color:'#ffffff'

  }
})

function mapStateToProps(state){
    return state;
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({addToken,addEmail,addPassword,emptyState},dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);
