import { combineReducers } from 'redux';
import fetchAll from './groups';
import fetchOne from './group';
import updateOne from './groupUpdate';
import fetchUsers from './users';
import groupMembers from './groupMembers';
import selectedGroups from './selectedGroups';
import availableUsersFilter from './availableUsersFilter';
import memberUsersFilter from './memberUsersFilter';

export default combineReducers({
  fetchAll,
  fetchOne,
  updateOne,
  fetchUsers,
  groupMembers,
  selectedGroups,
  availableUsersFilter,
  memberUsersFilter
});
