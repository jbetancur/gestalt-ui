import { combineReducers } from 'redux';
import fetchAll from './environments';
import fetchOne from './environment';

export default combineReducers({
  fetchAll,
  fetchOne,
});
