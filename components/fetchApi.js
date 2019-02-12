export function fetchAPI(method='GET',body=null,token){   
 let request;
 if(method=='POST'){
    request=fetch('https://api.sportstrackerapp.com/pull?token='+token, {
        method: method,
        header:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:body
     })
 } 
 else{
    request=fetch('https://api.sportstrackerapp.com/pull?token='+token, {
        method: 'GET',
     })
 }
 return request.then((response)=>response.json())
 .then((resposeJson)=>{
    //  alert(JSON.stringify(resposeJson))
    return resposeJson;
 })

}