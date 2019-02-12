const InitialState={organisationData:[]}
export default eventReducer=(state=InitialState,action)=>{
    switch(action.type){
        case 'STORE_EVENT_DATA':
        state.organisationData.push(action.payload);
        return state;
        default:return state;
    }
}