import { combineReducers } from 'redux';
import selectedProviders from './selectedProviders';
import selectedProviderSchema from './selectedProviderSchema';
import container from './container';

export default combineReducers({
  selectedProviders,
  selectedProviderSchema,
  container,
});
