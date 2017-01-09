import { combineReducers } from 'redux';
import policiesFetchReducer from './policiesFetch';

export default combineReducers({
  fetchAll: policiesFetchReducer
});
