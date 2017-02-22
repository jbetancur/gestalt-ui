import { combineReducers } from 'redux';

import self from './self';
import currentOrgContext from './currentOrgContext';

export default combineReducers({
  self,
  currentOrgContext,
});
