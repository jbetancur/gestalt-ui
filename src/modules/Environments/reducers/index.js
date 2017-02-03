import { combineReducers } from 'redux';
import fetchAll from './environments';
import fetchOne from './environment';
import navigation from './navigation';

export default combineReducers({
  fetchAll,
  fetchOne,
  navigation
});
