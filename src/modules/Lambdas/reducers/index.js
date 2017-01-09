import { combineReducers } from 'redux';
import fetchAll from './lambdas';
import fetchOne from './lambda';

export default combineReducers({
  fetchAll,
  fetchOne
});
