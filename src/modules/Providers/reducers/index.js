import { combineReducers } from 'redux';
import fetchAll from './providers';
import fetchOne from './provider';
import selectedProviders from './selectedProviders';
import selectedProvider from './providerType';

export default combineReducers({
  fetchAll,
  fetchOne,
  selectedProviders,
  selectedProvider
});
