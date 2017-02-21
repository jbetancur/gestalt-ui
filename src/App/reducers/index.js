import { combineReducers } from 'redux';

import self from './self';
import baseOrganization from './baseOrganization';
import currentOrgContext from './currentOrgContext';

export default combineReducers({
  self,
  baseOrganization,
  currentOrgContext,
});
