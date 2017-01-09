import { combineReducers } from 'redux';
import containersFetchReducer from './containersFetch';

export default combineReducers({
  fetchAll: containersFetchReducer
});
