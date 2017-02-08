import { combineReducers } from 'redux';
import license from './license';
import licenseUpdate from './licenseUpdate';

export default combineReducers({
  license,
  licenseUpdate
});
