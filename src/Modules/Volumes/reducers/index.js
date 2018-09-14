import { combineReducers } from 'redux';
import selectedProvider from './selectedProvider';
import volumeListing from './volumeListing';

export default combineReducers({
  selectedProvider,
  volumeListing,
});
