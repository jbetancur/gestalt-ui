import { combineReducers } from 'redux';
import selectedGroups from './selectedGroups';
import availableUsersFilter from './availableUsersFilter';
import memberUsersFilter from './memberUsersFilter';

export default combineReducers({
  selectedGroups,
  availableUsersFilter,
  memberUsersFilter,
});
