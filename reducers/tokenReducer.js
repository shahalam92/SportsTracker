const InitialState={token:'',email:'',password:''}
export default tokenReducer=(state=InitialState,action)=>{
    switch(action.type){
        case 'STORE_TOKEN':
        state.token=action.payload;
        return state;
        case 'REMOVE_TOKEN':
        state.token=''
        return state;
        case 'SAVE_EMAIL':
        state.email=action.payload;
        return state;
        case 'SAVE_PASSWORD':
        state.password=action.payload;
        return state;
        return state;
        case 'EMPTY_STATE':
        state.email='';
        state.password=''
        default:return state
    }
}