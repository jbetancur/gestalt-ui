import { combineReducers } from 'redux';
import fetchAll from './providers';
import fetchOne from './provider';
import selectedProviders from './selectedProviders';
import updateOne from './providerUpdate';

export default combineReducers({
  fetchAll,
  fetchOne,
  selectedProviders,
  updateOne
});
