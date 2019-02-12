const InitialState={organisationData:[]}
export default organisationReducer=(state=InitialState,action)=>{
    switch(action.type){
        case 'STORE_DATA':
        state.organisationData.push(action.payload);
        return state;
        default:return state;
    }
}