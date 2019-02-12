import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,List,Alert,FlatList,TouchableHighlight,BackHandler,Dimensions,RefreshControl,ontrol,
SafeAreaView,NetInfo} from 'react-native';
// import AllEvents from '../AllEvents/AllEvents';
var {width,height}=Dimensions.get('window');
import Moment from 'moment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import API from '../components/api';
import {saveMeetData} from '../actions/index';

 class SelectMeet extends Component{
    static navigationOptions = {  
        header: null
    }
    constructor(props){
         super(props);
        //  this.state={data:[{Name:'Athletics',Date:'04/02/2018'}]}
        const {state} = props.navigation;
        // this.meets=this.meet.reverse();
        this.meets=this.props.meetReducer.organisationData[0].meets;
        this.organization_id=state.params.organization_id
        this.token=state.params.token;
        this.state={meets:this.meets}
        // alert(JSON.stringify(this.props.organisationReducer.organisationData[0]));
        // alert(typeof(this.meets))
        // alert(this.meets.length)
        
    }
    componentDidMount () {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done((isConnected) => {
          this.setState({ staus: isConnected })
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.navigation.goBack();
         });

      }
      componentWillUnmount() {
        
    
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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

      _refresh=()=>{
        fetch('https://api.sportstrackerapp.com/pull?token='+this.token, {
            method: 'GET',

         })
         .then((response) => response.json())
         .then((responseJson) => {
            var organisation=responseJson.organizations;
            var organizationsData=[]
            organisation.map((item)=>{
                if(item.organization_id==this.organization_id){
                   organizationsData=item;
                }
            })
            // if(organizationsData.meets.length==0){
            //      Alert.alert(
            //       'Error',
            //       'No Meet Available',
            //       [
                   
            //         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            //         {text: 'OK', onPress: () => console.log('OK Pressed')},
            //       ],
            //       { cancelable: false }
            //     ) 
            //     this.props.navigation.goBack();
            //     return false;
            // }
            // alert(JSON.stringify(organizationsData.meets))
            this.setState({meets:organizationsData.meets})
            // this.setState({
            //    meets: responseJson.organizations
            // })
            
             this.setState({isVisible:true})
             this.setState({isLoading:false}) 
         })
         .catch((error) => {
            console.error(error);
         });
           this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
             return true;
           
            });
      }
    _onPress(item){
        alert(JSON.stringify(this.props.meetReducer.organisationData))
        if(item.events.length==0){
            Alert.alert(
              'Error',
              'No events present for this meet',
              [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              ],
              { cancelable: false }
            )
            return false;
          } 
    this.props.navigation.navigate('AllEvents',{events:item.events,meet_id:item.meet_id,token:this.token,organization_id:this.organization_id});
    }
    render(){
        return(
            <SafeAreaView>
                   <View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'
                 ,borderWidth: 1,
                 backgroundColor:'#713D94',
                 borderColor: '#000000',
                 borderBottomWidth: 0.5,
                 shadowColor: '#000',
                 shadowOffset: { width: 0, height: 2 },
                // shadowOpacity:0.8,
                shadowRadius: 2,
                 elevation: 1,
                 height:50,
                 width:width,
                }}>
                <TouchableOpacity style={{position:'absolute',left:5}} onPress={()=>this.props.navigation.goBack()}>
                <Text style={{ 
        fontSize:16,color:'#ffffff',fontFamily:'opensans-light'}}>Back</Text>
        </TouchableOpacity>
            <Text style={{
        fontSize:20,color:'#ffffff',fontWeight:'bold'}}>Select Meet</Text>
                    </View>
                </View>
                <View>
                    {/* <View style={{justifyContent:'center',alignItems:'center',marginTop:30}}>
                <Text style={{fontSize:30}}>Select Meet</Text>
                </View> */}
                {/* <PTRView onRefresh={this._refresh} > */}
                <FlatList
                //   data={[{title: 'Athletics', key: '02/04/2018'},{title: 'Swim', key: '02/04/2018'}]}
                 data={this.state.meets}
                renderItem={({item, separators,index}) => (
         <TouchableHighlight
      onPress={() => this._onPress(item)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={{flexDirection:"column",borderBottomWidth:0.5,borderColor:'black',paddingBottom:20,paddingTop:20,paddingLeft:10,backgroundColor: index%2==0?"#F4F4F8":'#ffffff'}}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>{item.name}</Text>
        <Text style={{fontSize:16,marginTop:10}}>{item.code}</Text>
        <Text style={{fontSize:16,marginTop:10}}>{Moment(item.date).format('LL')}</Text>
       
        {/* <Text style={{fontSize:16,marginTop:12}}>Age : {item.age_display.charAt(0).toUpperCase()+item.age_display.slice(1)}</Text>
        <Text style={{fontSize:16,marginTop:12}}>Age_type : {item.age_type.charAt(0).toUpperCase()+item.age_type.slice(1)}</Text>
         */}
      </View>
    </TouchableHighlight>
  )}
  refreshControl={
    <RefreshControl
     refreshing={this.state.isLoading}
     onRefresh={this._refresh}
    />
  }
/>
{/* </PTRView> */}
</View>
</SafeAreaView>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
    }
})
function mapStateToProps(state){
    return state;
}
export default connect(mapStateToProps)(SelectMeet);