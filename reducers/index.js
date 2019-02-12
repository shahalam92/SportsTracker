import {combineReducers} from 'redux';
import tokenReducer from './tokenReducer'; 
import organisationReducer from './organisationReducer';
import meetReducer from './meetReducer';
export default rootReducer=combineReducers({
tokenReducer:tokenReducer,
organisationReducer:organisationReducer,
meetReducer:meetReducer
})