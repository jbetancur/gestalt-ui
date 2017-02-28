import { combineReducers } from 'redux';
import fetchAll from './apis';
import fetchOne from './api';
import apiUpdate from './apiUpdate';
import selectedAPIs from './selectedAPIs';
import providers from './providers';

export default combineReducers({
  fetchAll,
  fetchOne,
  apiUpdate,
  selectedAPIs,
  providers,
});
