import React,{Component} from 'react';
import {View,Text,StyleSheet,Platform,TouchableOpacity,BackHandler,AsyncStorage,TouchableHighlight,ActivityIndicator,
  FlatList,Dimensions,RefreshControl,SafeAreaView,NetInfo,Alert,Image,StatusBar} from 'react-native';
import Moment from 'moment';
import Login from './Login';
import {SkypeIndicator,UIActivityIndicator,MaterialIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addToken,saveData,saveMeetData} from '../actions/index';
var {width,height}=Dimensions.get('window');
import API from '../components/api';
token='';
 class SelectOrganisation extends Component{
    static navigationOptions = {
        header: null
    }
    constructor(props){
        super(props);
        const {state} = props.navigation;
        this.token=this.props.tokenReducer.token;
        this.state={data:[],isVisible:false,isLoading:true}
         this.organizationsData=[];
    }
    componentDidMount () {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
      NetInfo.isConnected.fetch().done((isConnected) => {
        this.setState({ staus: isConnected })
      })
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        return true;
       });
       API.selectOrg('body',this.token).then((data)=>{
         var datas=data.organizations;
          this.setState({data:datas})
          this.props.saveData(datas)
        })
       this.setState({isVisible:true})
      this.setState({isLoading:false}) 
      }
      logout=()=>{
        AsyncStorage.removeItem('ACCESS_TOKENS');
        this.props.navigation.navigate('Login');
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
        API.selectOrg('body',this.token).then((data)=>{
          var datas=data.organizations;
           this.setState({data:datas})
           this.props.saveData(datas)
         })
        this.setState({isVisible:true})
        this.setState({isLoading:false}) 
           this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
             // works best when the goBack is async
             return true;
           
            });

      }
      componentWillUnmount() {
        this.setState({ showWebView: false });
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      }
      _onPress=(item)=>{
        var organisation=this.props.organisationReducer.organisationData[0]
       
       organisation.map((items)=>{
        if(items.organization_id==item.organization_id){
           this.props.saveMeetData(items)
        }
    })    
        
        if(item.meets.length==0){
          Alert.alert(
            'Error',
            'No meets present for this organisation',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
          )
          return false;
        }
        this.props.navigation.navigate('SelectMeet',{meet:item.meets,token:this.token,organization_id:item.organization_id});
      }
    render(){
        // if (this.state.isLoading) {
        //     return (
        //       <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        //         {/* <ActivityIndicator size="large" color="#c23b36" animating={true} /> */}
        //         <SkypeIndicator color="#c23b36"  size={80}/>
        //       </View>
        //     )
        //   }
        return(
            <SafeAreaView >
                <View>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'
                 ,borderWidth: 1,
                 backgroundColor:'#713D94',
                 borderColor: '#000000',
                 borderBottomWidth: 0.2,
                 shadowColor: '#000',
                 shadowOffset: { width: 0, height: 2 },
                 shadowRadius: 2,
                 elevation: 1,
                 height:60,
                 width:width
                }}>
                    <Text style={{
        fontSize:20,color:'#ffffff',fontWeight:'bold'}}>Select Organisation</Text>
        <TouchableOpacity style={{position:'absolute',left:10}} onPress={()=> this.props.navigation.openDrawer()}>
        <Image   source={require('../Images/menu2.png')}
       style={{height:30,width:40}}/>
        </TouchableOpacity>
                    </View>
                    {this.state.isLoading?<View style={{flexDirection:"row",justifyContent:'center',alignItems:'center'}}><MaterialIndicator color="#c23b36"  size={40} animating={true}/></View>:null}
                   
                </View>
   {/* <PTRView onRefresh={this._refresh} > */}
   <FlatList
        style={{backgroundColor:'white'}}
          data={this.state.data}
          keyExtractor={(x, i) => i}
          renderItem={({ item,index }) =>
            (
              <View style={{ flexDirection: 'row', borderBottomColor: '#E6E6E6', borderWidth: 0.5, backgroundColor: index%2==0?"#F4F4F8":'#ffffff' }}>
                <TouchableOpacity onPress={()=>this._onPress(item)}>
                  <View style={{ flex: 1, flexDirection: 'row',paddingLeft:10, height:60,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:20,fontWeight:'bold'}} numberOfLines={1} >{item.name}</Text>
                    <View style={{ width: window.width - 60, flexGrow: 1, flex: 1 ,paddingLeft:3}}>
                      {/* <Text style={{fontSize:16,fontFamily:'open-sans',marginTop:10}}>{Moment(item.date).format('llll')}</Text> */}
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
const styles=StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
function mapStateToProps(state){
    return state;
}
function mapDispatchToProps(dispatch){
return bindActionCreators({saveData,saveMeetData},dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(SelectOrganisation);

