import {fetchAPI} from './fetchApi';

function selectOrg(body,token){
    return fetchAPI('GET',body,token)
}
function selectMeet(body,token){
    
    return fetchAPI('GET',token)
}
export default  API={
    selectOrg,
    selectMeet
}