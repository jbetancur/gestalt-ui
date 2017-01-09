import { combineReducers } from 'redux';
import integrationsFetchReducer from './integrationsFetch';

export default combineReducers({
  fetchAll: integrationsFetchReducer
});
