import { combineReducers } from 'redux';
import groupsFetchReducer from './groupsFetch';

export default combineReducers({
  fetchAll: groupsFetchReducer
});
