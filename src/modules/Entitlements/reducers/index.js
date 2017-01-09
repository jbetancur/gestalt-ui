import { combineReducers } from 'redux';
import entitlementsFetchReducer from './entitlementsFetch';

export default combineReducers({
  fetchAll: entitlementsFetchReducer
});
