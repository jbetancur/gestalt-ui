import { combineReducers } from 'redux';
import fetchAll from './providers';
import fetchOne from './provider';
import selectedProviders from './selectedProviders';
import updateOne from './providerUpdate';
import selectedProviderSchema from './selectedProviderSchema';
import container from './container';

export default combineReducers({
  fetchAll,
  fetchOne,
  selectedProviders,
  updateOne,
  selectedProviderSchema,
  container,
});
