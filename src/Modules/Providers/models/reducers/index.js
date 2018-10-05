import { combineReducers } from 'redux';
import provider from './provider';
import providers from './providers';

export default combineReducers({
  provider,
  providers,
});
