import React,{Component} from 'react';
import {View,Text,FlatList,TouchableHighlight,TouchableOpacity,BackHandler,Dimensions,Alert,ScrollView,RefreshControl,
SafeAreaView,NetInfo} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import {RkTextInput,RkButton} from 'react-native-ui-kitten';
var {width,height}=Dimensions.get('window');
import { SearchBar } from 'react-native-elements';
import SelectMeet from './SelectMeet';
// import PTRView from 'react-native-pull-to-refresh';
export default class Completed extends Component{
    static navigationOptions = {  
        headerTitle:
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{
        color:'#000000',
        fontSize:20,
        fontWeight:'bold',
        marginLeft:-40
    }}>
       Select Meet
    </Text>
    </View>
    }
    constructor(props){
        super(props);
        const {state} = props.navigation;
        this.Data=state.params.events;
        this.meet_id=state.params.meet_id;
        this.token=state.params.token;
        this.organization_id=state.params.organization_id;
        this.datas=[];
       
        this.Data.map((item)=>{
           if(item.completed==true){
             this.datas.push(item);
           }
        })
        if(this.datas.length==0){
          Alert.alert(
            'Error',
            'No completed events till now',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
          )
        }
        this.state={text:'',Data:this.datas}
    }
    
    componentDidMount () {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
      NetInfo.isConnected.fetch().done((isConnected) => {
        this.setState({ staus: isConnected })
      })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          // works best when the goBack is async
        //   return true;
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
    _onPress(){
        alert();
    }
    goBack=()=>{
      
        // this.props.navigation.goBack()
        this.props.navigation.navigate('SelectMeet')
    }
    _refresh=()=>{
      fetch('https://api.sportstrackerapp.com/pull?token='+this.token, {
          method: 'GET',
         //  headers: {
         //     token: {'token':'317c313534343432343030307c31'},
         //   }
       })
       .then((response) => response.json())
       .then((responseJson) => {
          var organisation=responseJson.organizations;
          var organizationsData=[]
          var datas=[]
          var MeetsData=[];
          organisation.map((item)=>{
              if(item.organization_id==this.organization_id){
                 organizationsData=item;
              }
          })
         
          organizationsData.meets.map((items)=>{
            if(items.meet_id==this.meet_id){
              MeetsData=items.events
            }
          })
          MeetsData.map((item)=>{
            if(item.completed==true){
              datas.push(item);
            }
         })
           this.setState({Data:datas})

          // this.setState({
          //    meets: responseJson.organizations
          // })
           this.setState({isVisible:true})
           this.setState({isLoading:false}) 
       })
       .catch((error) => {
          console.error(error);
       });
      }

    handleSearch = () => {
        this.value=false;
        let count=0;
        this.state.Data.filter((item)=>{
          item.name.includes(this.state.text)
           if(item.name.includes(this.state.text)==true){
             count++;
           }  
        })
        if(count==0){
          Alert.alert(
            'Search Result',
            'No search result with this keyword',
            [
             
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
          this.setState({Data:this.state.Data})
          return false;
        }
        else{
        this.setState({ Data: this.state.Data.filter(item => item.name.includes(this.state.text)) })
         
    }
      }

    render(){
        return(
            <SafeAreaView>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                {/* <View style={flex:0,justifyContent:'space-between'}> */}
                
                {/* <Text style={{fontSize:20, color:'#000000',
        fontFamily: 'open-sans',
        fontSize:20,
        fontWeight:'bold'}}>AllEvents </Text> */}
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'
                 ,borderWidth: 1,
                 backgroundColor:'#713D94',
                 borderColor: '#000000',
                 borderBottomWidth: 0,
                //  shadowColor: '#000',
                //  shadowOffset: { width: 0, height: 2 },
                //  shadowOpacity: 0.8,
                //  shadowRadius: 2,
                //  elevation: 1,
                 height:50,
                 width:width,
                }}>
                 <TouchableOpacity style={{position:'absolute',left:5}} onPress={()=>this.goBack()}>
                <Text style={{
        fontSize:16,color:'#ffffff',fontFamily:'opensans-light'}}>Back</Text>
        </TouchableOpacity>
            <Text style={{
        fontSize:20,color:'#ffffff',fontWeight:'bold'}}>Completed events</Text>
                    </View>
               {/* </View> */}
                </View>
                <SearchBar placeholder="Type Here..." lightTheme
            showLoading={false}
            onBlur={()=>this.handleSearch()}
          
            onChangeText={(text) =>
              {
               this.setState({text:text})
              }
               }
           ref={ref => this.textInputRef = ref}
            placeholder='Search'
            inputStyle={{ width: window.width - 20, backgroundColor: '#ffffff' }}
          />
          {/* <PTRView onRefresh={this._refresh} > */}
          <FlatList
        style={{backgroundColor:'white'}}
          data={this.state.Data}
          keyExtractor={(x, i) => i}
          renderItem={({ item,index }) =>
            (
              <View style={{ flexDirection: 'row', borderBottomColor: '#E6E6E6', borderWidth: 0.5,backgroundColor: index%2==0?"#F4F4F8":'#ffffff',paddingBottom:20,paddingTop:20 }}>
                <TouchableOpacity >
                  <View style={{ flex: 1, flexDirection: 'column',paddingLeft:10}}>
                    <Text style={{fontSize:20,fontWeight:'bold'}} numberOfLines={1} >{item.name} {item.gender.charAt(0).toUpperCase()+item.gender.slice(1)}</Text>
                    <View style={{ width: window.width - 60, flexGrow: 1, flex: 1 ,paddingLeft:3}}>
                      <Text style={{fontSize:16,marginTop:10}}>Time : {item.hour}:{item.minute} AM</Text>
                    <Text style={{fontSize:16,marginTop:10}}>Age : Under {item.age}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
