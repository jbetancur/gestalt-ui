import { combineReducers } from 'redux';

import organizations from './organizations';
import filter from './filter';

export default combineReducers({
  organizations,
  filter
});
