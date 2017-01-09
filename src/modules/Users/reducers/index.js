import { combineReducers } from 'redux';
import fetchAll from './users';
import fetchOne from './user';
import updateOne from './userUpdate';
import fetchOrgs from './organizations';

export default combineReducers({
  fetchAll,
  fetchOne,
  updateOne,
  fetchOrgs
});
