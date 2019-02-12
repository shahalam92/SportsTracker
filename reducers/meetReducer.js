const InitialState={organisationData:[]}
export default meetReducer=(state=InitialState,action)=>{
    switch(action.type){
        case 'STORE_MEET_DATA':
        state.organisationData.push(action.payload);
        return state;
        default:return state;
    }
}