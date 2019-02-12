import React, { Component } from 'react';
import {
  View, Text, FlatList, TouchableHighlight, TouchableOpacity, BackHandler, Dimensions, Alert, ScrollView,
  RefreshControl, SafeAreaView, NetInfo, Picker,AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var { width, height } = Dimensions.get('window');
import { SearchBar } from 'react-native-elements';
import SelectMeet from './SelectMeet';
import NumericInput from 'react-native-numeric-input'
// import Intercom from 'react-native-intercom';
// import MarqueeText from 'react-native-marquee';
// import TextInputMask from 'react-native-text-input-mask';
import { TextInputMask } from 'react-native-masked-text'
export default class EventDetails extends Component {
  static navigationOptions = {
    headerTitle:
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{
          color: '#000000',
          // fontFamily: 'open-sans',
          fontSize: 20,
          fontWeight: 'bold',
          marginLeft: -40
        }}>
          Select Meet
    </Text>
      </View>
  }
  constructor(props) {
    super(props);
    const { state } = props.navigation;
    this.Data = state.params.events;
    this.name = state.params.name;
    this.age = state.params.age;
    this.gender = state.params.gender
    this.token=state.params.token;
    this.datas=[]
    this.state = { text: '', Data: this.Data.participants, time: [], time2: [], time3: [], time4: [] }
    this.val = this.Data.measurement;
    alert("Inside");
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done((isConnected) => {
      this.setState({ staus: isConnected })
    })
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
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
    return false;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  _onPress() {
    alert();
  }
  _refresh = () => {
    fetch('https://api.sportstrackerapp.com/pull?token=' + this.token, {
      method: 'GET',
      //  headers: {
      //     token: {'token':'317c313534343432343030307c31'},
      //   }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var organisation = responseJson.organizations;
        var organizationsData = []
        var MeetsData = [];
        organisation.map((item) => {
          if (item.organization_id == this.organization_id) {
            organizationsData = item;
          }
        })
        organizationsData.meets.map((items) => {
          if (items.meet_id == this.meet_id) {
            MeetsData = items.events
          }
        })
        this.setState({ Data: MeetsData })

        // this.setState({
        //    meets: responseJson.organizations
        // })
        this.setState({ isVisible: true })
        this.setState({ isLoading: false })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  goBack = () => {

    this.props.navigation.goBack()
    // this.props.navigation.navigate('SelectMeet')
  }
  goBack2 = () => {
    if (this.val.includes('Time')&&this.val.length==13) {
      if(this.state.time.length==0){
        alert("Please enter time")
        return true;
      }
      var timeInMs = [];
      this.state.time.map((time) => {
        var time = time;
        var mn = time.split(':');
        mn = mn.join('');
        var sc = '';
        var ms = '';
        var min = '';
        
        for (var i = 0; i < mn.length; i++) {
          if (i <= 1) {
            min += mn.charAt(i);
          }
          else if (i > 1 && i <= 3) {
            sc += mn.charAt(i);
          }
          else {
            ms += mn.charAt(i);
          }
        }
        var tm = (min * 60000) + (sc * 1000) + ms
        timeInMs.push(tm);
      })
      
      for(var i=0;i<timeInMs.length;i++){
        this.datas.push({"user_id":this.Data.participants[i].user_id,"result":timeInMs[i],"dnf":0,"dq":0})
      }
      let details ={
      token: this.token,
      event_id:this.Data.event_id,
      data: JSON.stringify(this.datas)
};

let formBody = [];
for (let property in details) {
  let encodedKey = encodeURIComponent(property);
  let encodedValue = encodeURIComponent(details[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");
// alert(formBody);
return fetch('https://api.sportstrackerapp.com/push?token='+this.token, {
  method: 'POST',
  headers: {
  
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formBody
})
  .then((response) => response.json())
  .then((responseJson) => {
     if(responseJson.status=='success'){
      Alert.alert(
        'Success',
        'Data save successfully',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
     }
  })
    }
    else if(this.val.includes('Time')&&this.val.length!=13){
      if(this.state.time.length==0){
        alert("Please enter time")
        return true;
      }
      var timeInMs = [];
      this.state.time.map((time) => {
        var time = time;
        var mn = time.split(':');
        mn = mn.join('');
        var sc = '';
        var ms = '';
        var min = '';
        
        for (var i = 0; i < mn.length; i++) {
          if (i <= 1) {
            sc += mn.charAt(i);
          }
          else if (i > 1 && i <= 3) {
            ms += mn.charAt(i);
          }
        }
        var tm = (sc * 1000) + ms
        timeInMs.push(tm);
      })
      for(var i=0;i<timeInMs.length;i++){
        this.datas.push({"user_id":this.Data.participants[i].user_id,"result":timeInMs[i],"dnf":0,"dq":0})
      }
      let details ={
      token: this.token,
      event_id:this.Data.event_id,
      data: JSON.stringify(this.datas)
};
let formBody = [];
for (let property in details) {
  let encodedKey = encodeURIComponent(property);
  let encodedValue = encodeURIComponent(details[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");
// alert(formBody);
return fetch('https://api.sportstrackerapp.com/push?token='+this.token, {
  method: 'POST',
  headers: {
  
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formBody
})
  .then((response) => response.json())
  .then((responseJson) => {
     if(responseJson.status=='success'){
      Alert.alert(
        'Success',
        'Data save successfully',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
     }
  })
    }
    else if (this.val == 'Position') {
      if(this.state.time2.length==0){
        alert("Please enter position")
        return true;
      }
      for(var i=0;i<this.state.time2.length;i++){
        this.datas.push({"user_id":this.Data.participants[i].user_id,"result":this.state.time2[i],"dnf":0,"dq":0})
      }
      let details ={
      token: this.token,
      event_id:this.Data.event_id,
      data: JSON.stringify(this.datas)
};

let formBody = [];
for (let property in details) {
  let encodedKey = encodeURIComponent(property);
  let encodedValue = encodeURIComponent(details[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");
// alert(formBody);
return fetch('https://api.sportstrackerapp.com/push?token='+this.token, {
  method: 'POST',
  headers: {
  
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formBody
})
  .then((response) => response.json())
  .then((responseJson) => {
     if(responseJson.status=='success'){
      Alert.alert(
        'Success',
        'Data save successfully',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
     }
  })
    }
    else if (this.val == 'Score') {
      if(this.state.time3.length==0){
        alert("Please enter Score")
        return true;
      }
      for(var i=0;i<this.state.time3.length;i++){
        this.datas.push({"user_id":this.Data.participants[i].user_id,"result":this.state.time3[i],"dnf":0,"dq":0})
      }
      let details ={
      token: this.token,
      event_id:this.Data.event_id,
      data: JSON.stringify(this.datas)
};

let formBody = [];
for (let property in details) {
  let encodedKey = encodeURIComponent(property);
  let encodedValue = encodeURIComponent(details[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");
// alert(formBody);
return fetch('https://api.sportstrackerapp.com/push?token='+this.token, {
  method: 'POST',
  headers: {
  
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formBody
})
  .then((response) => response.json())
  .then((responseJson) => {
     if(responseJson.status=='success'){
      Alert.alert(
        'Success',
        'Data save successfully',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
     }
  })
    }
    else if (this.val.includes('Distance')) {
      if(this.state.time4.length==0){
        alert("Please enter Score")
        return true;
      }
      var distanceInCm = [];
      this.state.time4.map((item) => {
        var tmd = item;
        var msd = tmd.split(':');
        msd = msd.join('');
        var mtr = '';
        var cm = '';
        for (var i = 0; i < msd.length; i++) {
          if (i <= 1) {
            mtr += msd.charAt(i)
          }
          else {
            cm += msd.charAt(i)
          }
        }
        var dis = mtr * 100 + cm
        distanceInCm.push(dis);
      })
      for(var i=0;i<distanceInCm.length;i++){
        this.datas.push({"user_id":this.Data.participants[i].user_id,"result":distanceInCm[i],"dnf":0,"dq":0})
      }
      let details ={
      token: this.token,
      event_id:this.Data.event_id,
      data: JSON.stringify(this.datas)
};

let formBody = [];
for (let property in details) {
  let encodedKey = encodeURIComponent(property);
  let encodedValue = encodeURIComponent(details[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join("&");
// alert(formBody);
return fetch('https://api.sportstrackerapp.com/push?token='+this.token, {
  method: 'POST',
  headers: {
  
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formBody
})
  .then((response) => response.json())
  .then((responseJson) => {
     if(responseJson.status=='success'){
      Alert.alert(
        'Success',
        'Data save successfully',
        [
         
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
     }
     else{
      Alert.alert(
        'Erro',
        'Something went wrong',
        [
         
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
     }
  })
    }
    // this.props.navigation.goBack()
    // this.props.navigation.navigate('SelectMeet')
  }
  handleSearch = () => {
    this.value = false;
    let count = 0;
    this.state.Data.filter((item) => {
      item.name.includes(this.state.text)
      if (item.name.includes(this.state.text) == true) {
        count++;
      }
    })
    if (count == 0) {
      Alert.alert(
        'Search Result',
        'No search result with this keyword',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
      this.setState({ Data: this.state.Data })
      return false;
    }
    else {
      this.setState({ Data: this.state.Data.filter(item => item.name.includes(this.state.text)) })
    }
  }
  onGoFocus() {
    // when you call getElement method, the instance of native TextInput will returned.
    this._myTextInputMask.getElement().focus()
  }
  getValue = (text) => {
    // alert(text)
  }

  render() {
    return (
      <SafeAreaView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            , borderWidth: 1,
            backgroundColor: '#713D94',
            borderColor: '#000000',
            borderBottomWidth: 0,
            height: 50,
            width: width,
          }}>
            <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={() => this.goBack()}>
              <Text style={{
                fontSize: 16, color: '#ffffff', fontFamily: 'opensans-light'
              }}>Back</Text>

            </TouchableOpacity>
            <View>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 19, color: '#ffffff'
              }}>{this.name} {this.gender.charAt(0).toUpperCase() + this.gender.slice(1)}</Text>
              <Text style={{
                fontWeight: 'bold',
                alignSelf: 'center',
                fontSize: 19, color: '#ffffff'
              }}>Under {this.age}</Text>

            </View>
            <TouchableOpacity style={{ position: 'absolute', right: 5 }} onPress={() => this.goBack2()}>
              <Text style={{
                fontSize: 16, color: '#ffffff', fontFamily: 'opensans-light'
              }}>Save</Text>
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </View>
        <SearchBar placeholder="Type Here..." lightTheme
          showLoading={false}
          onBlur={() => this.handleSearch()}

          onChangeText={(text) => {
            this.setState({ text: text })
          }
          }
          ref={ref => this.textInputRef = ref}
          placeholder='Search participant'
          inputStyle={{ width: window.width - 20, backgroundColor: '#ffffff' }}
        />
        <View style={{flexDirection:'row'}}>
        <Text style={{fontSize:20,alignItems:'flex-end',marginLeft:15}}>Participants</Text>
        <Text style={{fontSize:20,position:'absolute',right:20}}>{this.val}</Text>
         </View>
        <FlatList
          style={{ backgroundColor: 'white' }}
          data={this.state.Data}
          keyExtractor={(x, i) => i}
          renderItem={({ item, index }) =>
            (
              <View style={{ flexDirection: 'row', borderBottomColor: '#E6E6E6', borderWidth: 0.5, backgroundColor: index % 2 == 0 ? "#F4F4F8" : '#ffffff', paddingBottom: 20, paddingTop: 20 }}>

                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold',flexWrap: 'wrap' }} numberOfLines={1} >{item.name}</Text>
                  
                  {
                    this.val.includes('Time')&&this.val.length==13?

                      <View style={{ borderColor: '#713D94', borderWidth: 2, width: '30%', borderRadius: 37.5, position: 'absolute', right: 5, height: '140%' }}>
                       
                        <TextInputMask

                          // here we set the custom component and their props.
                          style={{ fontSize: 18, height: '140%', marginLeft:20,marginTop: -5 }}
                          customTextInputProps={{
                            style: { width: '100%', },
                            label: 'Birthday'
                          }}

                          type={'datetime'}
                          options={{
                            format: 'HH:mm:ss'
                          }}

                          // don't forget: the value and state!
                          onChangeText={text => {
                            let { time } = this.state;
                            time[index] = text;
                            this.setState({
                              time,
                            });
                          }}
                          value={this.state.time[index]}
                        />
                      </View> :
                       <View style={{ borderColor: '#713D94', borderWidth: 2, width: '30%', borderRadius: 37.5, position: 'absolute', right: 5, height: '140%' }}>
                       
                       <TextInputMask

                         // here we set the custom component and their props.
                         style={{ fontSize: 18, height: '140%', marginLeft:25,marginTop: -5 }}
                         customTextInputProps={{
                           style: { width: '100%', },
                           label: 'Birthday'
                         }}

                         type={'datetime'}
                         options={{
                           format: 'mm:ss'
                         }}

                         // don't forget: the value and state!
                         onChangeText={text => {
                           let { time } = this.state;
                           time[index] = text;
                           this.setState({
                             time,
                           });
                         }}
                         value={this.state.time[index]}
                       />
                     </View>
                  }

                  {
                    this.val == 'Position' ?
                      <View style={{ borderColor: '#713D94', borderWidth: 2, width: '30%', borderRadius: 37.5, position: 'absolute', right: 5, height: '140%' }}>
                      
                        <TextInputMask

                          // here we set the custom component and their props.
                          style={{fontSize: 18, height: '140%', marginLeft:20,marginTop: -5 }}
                          customTextInputProps={{
                            style: { width: '100%', },
                            label: 'Birthday'
                          }}

                          type={'only-numbers'}
                          options={{
                            format: 'HH:mm:ss'
                          }}

                          // don't forget: the value and state!
                          onChangeText={text => {
                            let { time2 } = this.state;
                            time2[index] = text;
                            this.setState({
                              time2,
                            });
                          }}
                          value={this.state.time2[index]}
                        />

                      </View> : null
                  }
                  {
                    this.val == 'Score' ?

                      <View style={{ borderColor: '#713D94', borderWidth: 2, width: '30%', borderRadius: 37.5, position: 'absolute', right: 5, height: '140%' }}>
                    
                        <TextInputMask
                          style={{ fontSize: 18, height: '140%', marginLeft:20,marginTop: -5  }}
                          customTextInputProps={{
                            style: { width: '100%', },
                            label: 'Birthday'
                          }}

                          type={'only-numbers'}
                          options={{
                            format: 'HH:mm:ss'
                          }}

                          // don't forget: the value and state!
                          onChangeText={text => {
                            let { time3 } = this.state;
                            time3[index] = text;
                            this.setState({
                              time3,
                            });
                          }}
                          value={this.state.time3[index]}
                        />

                      </View> : null
                  }
                  {
                    this.val.includes('Distance') ?

                      <View style={{ borderColor: '#713D94', borderWidth: 2, width: '30%', borderRadius: 37.5, position: 'absolute', right: 5, height: '140%' }}>
                        
                        <TextInputMask

                          // here we set the custom component and their props.
                          style={{ fontSize: 18, height: '140%', marginLeft:20,marginTop: -5  }}
                          customTextInputProps={{
                            style: { width: '100%', },
                            label: 'Birthday'
                          }}

                          type={'datetime'}
                          options={{
                            format: 'mm:ss'
                          }}

                          // don't forget: the value and state!
                          onChangeText={text => {
                            let { time4 } = this.state;
                            time4[index] = text;
                            this.setState({
                              time4,
                            });
                          }}
                          value={this.state.time4[index]}
                        />
                      </View> : null
                  }

                </View>

              </View>
            )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._refresh}
            />
          }
        />


        {/* </PTRView> */}

      </SafeAreaView>

    )
  }
}




// let details ={
//   event_id:7,
//   data:[

//     {

//       "user_id": 123,

//        "result": 94326, //time in ms (1:34.326)

//        "dnf": 0,

//        "dq": 0

//     },

//     {	

//        "user_id": 124,

//        "result": 86336,

//        "dnf": 0,

//        "dq": 0

//     },]
// };

// let formBody = [];
// for (let property in details) {
//   let encodedKey = encodeURIComponent(property);
//   let encodedValue = encodeURIComponent(details[property]);
//   formBody.push(encodedKey + "=" + encodedValue);
// }
// formBody = formBody.join("&");
// return fetch('https://api.sportstrackerapp.com/push?token=317c313534353232343536387c31', {
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
//   body: JSON.stringify(details)
// })
//   .then((response) => response.json())
//   .then((responseJson) => {
//     alert(JSON.stringify(responseJson));
//   })