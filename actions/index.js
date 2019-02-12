export const addToken=(token)=>{
    return {
        type:"STORE_TOKEN",
        payload:token
    }
}
export const addEmail=(email)=>{
    return {
        type:"SAVE_EMAIL",
        payload:email
    }
}
export const addPassword=(password)=>{
    return{
        type:"SAVE_PASSWORD",
        payload:password
    }
}
export const emptyState = ()=>{
            return {
                type:'EMPTY_STATE'
            }
        }
export const saveData = (data)=>{
    return {
        type:'STORE_DATA',
        payload:data        
    }
}
export const saveMeetData = (data)=>{
    
    return{
        type:'STORE_MEET_DATA',
        payload:data
    }
}

export const saveEventData = (data)=>{
    return{
        type:'STORE_EVENT_DATA',
        payload:data
    }
}
