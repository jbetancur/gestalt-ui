import { combineReducers } from 'redux';
import fetchAll from './providers';
import fetchOne from './provider';

export default combineReducers({
  fetchAll,
  fetchOne
});
