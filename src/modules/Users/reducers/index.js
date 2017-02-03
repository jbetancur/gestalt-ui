import { combineReducers } from 'redux';
import fetchAll from './users';
import fetchOne from './user';
import updateOne from './userUpdate';
import fetchOrgs from './organizations';
import selectedUsers from './selectedUsers';

export default combineReducers({
  fetchAll,
  fetchOne,
  updateOne,
  fetchOrgs,
  selectedUsers
});
