import { combineReducers } from 'redux';
import availableUsersFilter from './availableUsersFilter';
import memberUsersFilter from './memberUsersFilter';

export default combineReducers({
  availableUsersFilter,
  memberUsersFilter,
});
